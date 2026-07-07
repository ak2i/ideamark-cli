const YAML = require('yaml');
const legacyParser = require('../parser');
const { loadDocument } = require('./load');
const { validateDocument, SPEC_VERSION, KNOWN_FIELDS } = require('./validate');

// Migration from IdeaMark v1.1.x .ideamark.md documents to v1.2.0 YAML
// (Part 4 §14; CLI contract §5.3).
//
// Principles (§14.5, §14.8, §14.10):
// - preserve object identities: legacy map keys become `id` values;
// - never drop data silently: legacy fields with no v1.2.0 home move to the
//   `x-ideamark-v1` extension field;
// - never convert uncertainty into false certainty: payload caches are
//   preserved as extension data, not promoted to `content`;
// - unresolved references are preserved with a warning (error in strict
//   migration); external-looking entity refs become stub Entities that carry
//   the reference in `ref`.

const EXT_KEY = 'x-ideamark-v1';

// Conservative document status mapping (§14.7).
const STATUS_MAP = {
  draft: 'draft',
  in_progress: 'draft',
  review: 'draft',
  in_review: 'draft',
  final: 'reviewed',
  complete: 'reviewed',
  completed: 'reviewed',
  done: 'reviewed',
  published: 'reviewed',
  reviewed: 'reviewed',
  deprecated: 'deprecated',
  superseded: 'superseded',
  archived: 'archived',
};

const META_MAPPED_KEYS = ['ideamark_version', 'doc_id', 'status', 'title', 'lang', 'created_at', 'updated_at', 'summary', 'authors'];

function diag(severity, code, message, path, objectId) {
  return { severity, code, rule: 'CLI', message, path: path || null, object_id: objectId || null, field: null };
}

function isMapping(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

function looksExternalRef(ref) {
  return typeof ref === 'string' && (ref.includes('://') || ref.includes('#'));
}

// Copies v1.2.0-known fields, collects the rest into x-ideamark-v1.
function splitKnown(ns, legacyObj, skip = []) {
  const out = {};
  const leftover = {};
  for (const [key, value] of Object.entries(legacyObj)) {
    if (skip.includes(key)) continue;
    if (KNOWN_FIELDS[ns].includes(key)) out[key] = value;
    else leftover[key] = value;
  }
  return { out, leftover };
}

function migrateEntity(id, legacy, stats) {
  const { out, leftover } = splitKnown('entities', legacy, ['payload']);
  const ent = { id, ...out };
  if (isMapping(legacy.payload)) {
    const p = { ...legacy.payload };
    if (typeof p.body === 'string') {
      ent.content = p.body;
      delete p.body;
    }
    if (isMapping(p.ref) && typeof p.ref.uri === 'string') {
      ent.ref = p.ref.uri;
      const rest = { ...p.ref };
      delete rest.uri;
      if (Object.keys(rest).length) p.ref = rest;
      else delete p.ref;
    } else if (typeof p.ref === 'string') {
      ent.ref = p.ref;
      delete p.ref;
    }
    if (Object.keys(p).length) leftover.payload = p;
  } else if (legacy.payload !== undefined) {
    leftover.payload = legacy.payload;
  }
  if (Object.keys(leftover).length) {
    ent[EXT_KEY] = leftover;
    stats.preserved++;
  }
  return ent;
}

function migrateSimple(ns, id, legacy, stats) {
  const { out, leftover } = splitKnown(ns, legacy);
  const obj = { id, ...out };
  if (Object.keys(leftover).length) {
    obj[EXT_KEY] = leftover;
    stats.preserved++;
  }
  return obj;
}

function keyedMapToArray(map, mapper) {
  return Object.entries(map || {}).map(([id, value]) => mapper(id, isMapping(value) ? value : {}));
}

function mapDocumentStatus(header, diagnostics) {
  const raw = isMapping(header.status) ? header.status.state : header.status;
  const key = typeof raw === 'string' ? raw.toLowerCase() : null;
  const mapped = (key && STATUS_MAP[key]) || 'draft';
  if (mapped !== raw) {
    diagnostics.push(diag('info', 'migration_status_mapped', `legacy status ${JSON.stringify(raw)} mapped to \`${mapped}\``, 'meta.status'));
  }
  return mapped;
}

function migrateDocument(text, options = {}) {
  const strict = !!options.strict;
  const includeInfo = !!options.info;
  const diagnostics = [];

  const legacy = legacyParser.parseDocument(text);
  const header = legacy.header || {};
  if (!('ideamark_version' in header) && !options.from) {
    diagnostics.push(diag('error', 'migration_source_unrecognized', 'input does not look like an IdeaMark v1.1.x document (no `ideamark_version` header); pass --from to force'));
    return { ok: false, output: null, diagnostics };
  }
  if (legacy.parseErrors && legacy.parseErrors.length) {
    diagnostics.push(diag('error', 'migration_source_unrecognized', `legacy document has YAML parse errors: ${legacy.parseErrors.join('; ')}`));
    return { ok: false, output: null, diagnostics };
  }
  const registry = legacy.registry || {};
  const stats = { preserved: 0 };

  // meta (§14.7)
  const meta = {
    spec_version: SPEC_VERSION,
    document_id: typeof header.doc_id === 'string' && header.doc_id ? header.doc_id : 'migrated-document',
    status: mapDocumentStatus(header, diagnostics),
  };
  if (meta.document_id === 'migrated-document' && header.doc_id === undefined) {
    diagnostics.push(diag('warning', 'migration_reference_unresolved', 'legacy document has no `doc_id`; document_id set to `migrated-document`', 'meta.document_id'));
  }
  if (typeof header.title === 'string') meta.title = header.title;
  if (typeof header.summary === 'string') meta.description = header.summary;
  if (typeof header.lang === 'string') meta.lang = header.lang;
  if (header.created_at !== undefined) meta.created_at = String(header.created_at);
  if (header.updated_at !== undefined) meta.updated_at = String(header.updated_at);
  if (header.authors !== undefined) meta.authors = header.authors;
  const metaLeftover = {};
  for (const [key, value] of Object.entries(header)) {
    if (!META_MAPPED_KEYS.includes(key)) metaLeftover[key] = value;
  }
  if (Object.keys(metaLeftover).length) {
    meta[EXT_KEY] = metaLeftover;
    stats.preserved++;
  }
  meta.migration = {
    from_spec_version: `ideamark-core-v${header.ideamark_version || '1.1.x'}`,
    to_spec_version: SPEC_VERSION,
    migrated_by: 'ideamark-cli',
    migrated_at: new Date().toISOString(),
  };

  // Required namespaces (§14.6: keyed maps -> arrays, keys preserved as ids)
  const sections = keyedMapToArray(registry.sections, (id, v) => migrateSimple('sections', id, v, stats));
  const occurrences = keyedMapToArray(registry.occurrences, (id, v) => migrateSimple('occurrences', id, v, stats));
  const entities = keyedMapToArray(registry.entities, (id, v) => migrateEntity(id, v, stats));

  // Reference reconciliation (§14.8)
  const entityIds = new Set(entities.map((e) => e.id));
  const occurrenceIds = new Set(occurrences.map((o) => o.id));
  for (const occ of occurrences) {
    const ref = occ.entity;
    if (typeof ref !== 'string' || !ref || entityIds.has(ref)) continue;
    if (looksExternalRef(ref)) {
      // External reuse: represent the referenced material as a stub Entity
      // carrying the external reference (§9.7 allows ref to another
      // IdeaMark object).
      entities.push({ id: ref, kind: 'reference', ref });
      entityIds.add(ref);
      diagnostics.push(diag('warning', 'migration_placeholder_created', `created stub entity for external reference \`${ref}\``, null, occ.id));
    } else {
      diagnostics.push(diag(strict ? 'error' : 'warning', 'migration_reference_unresolved', `occurrence references unknown entity \`${ref}\` (preserved)`, null, occ.id));
    }
  }
  for (const sec of sections) {
    for (const ref of Array.isArray(sec.occurrences) ? sec.occurrences : []) {
      if (typeof ref === 'string' && ref && !occurrenceIds.has(ref)) {
        diagnostics.push(diag(strict ? 'error' : 'warning', 'migration_reference_unresolved', `section references unknown occurrence \`${ref}\` (preserved)`, null, sec.id));
      }
    }
  }

  const out = { meta, sources: [], sections, occurrences, entities };

  // Optional namespaces: keep them top-level (Core-adjacent, §2.7) but apply
  // the same keyed-map-to-array normalization.
  if (isMapping(registry.structure) && Object.keys(registry.structure).length) {
    out.structure = registry.structure;
  }
  for (const ns of ['relations', 'perspectives']) {
    if (isMapping(registry[ns]) && Object.keys(registry[ns]).length) {
      out[ns] = keyedMapToArray(registry[ns], (id, v) => ({ id, ...v }));
    }
  }

  if (stats.preserved > 0) {
    diagnostics.push(diag('info', 'migration_data_preserved_as_extension', `${stats.preserved} object(s) carry legacy fields preserved under \`${EXT_KEY}\``));
  }

  if (diagnostics.some((d) => d.severity === 'error')) {
    return { ok: false, output: null, diagnostics: filterInfo(diagnostics, includeInfo) };
  }

  const output = YAML.stringify(out, { lineWidth: 0 });

  // Contract §5.3: Core-mode validation runs automatically on the result.
  const validated = validateDocument(loadDocument(output), { mode: 'core', info: includeInfo });
  const merged = [...diagnostics, ...validated.diagnostics];
  return {
    ok: validated.summary.errors === 0,
    output,
    diagnostics: filterInfo(merged, includeInfo),
  };
}

function filterInfo(diagnostics, includeInfo) {
  return includeInfo ? diagnostics : diagnostics.filter((d) => d.severity !== 'info');
}

module.exports = { migrateDocument };
