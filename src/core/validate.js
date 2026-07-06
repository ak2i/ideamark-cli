// Structural validation for IdeaMark Core v1.2.0 (Part 4 §13).
//
// Every diagnostic carries a `rule` from docs/dev/v0.3.0/validation-checklist.md
// and a `code` from docs/dev/v0.3.0/diagnostic-codes.md. Severities below are
// Core-mode severities; strict mode promotes the D8 set (checklist §11).
//
// Boundary (§13.14): no URI dereferencing, no source verification, no
// Projection semantics, no payload schema validation, no granularity judgment.

const {
  REQUIRED_ARRAY_NAMESPACES,
  REQUIRED_NAMESPACES,
  OPTIONAL_NAMESPACES,
  isMapping,
  isNonEmptyString,
  buildModel,
} = require('./model');

const SPEC_VERSION = 'ideamark-core-v1.2.0';

const DOC_STATUS = ['draft', 'generated', 'reviewed', 'deprecated', 'superseded', 'archived'];
const OBJ_STATUS = ['active', 'draft', 'provisional', 'deprecated', 'superseded', 'rejected'];
const SOURCE_TYPES = ['document', 'web_page', 'code_file', 'repository', 'dataset', 'image', 'audio', 'video', 'stream', 'generated_artifact', 'composite', 'other'];
const ANCHOR_TYPES = ['line_range', 'character_range', 'paragraph', 'heading_path', 'page_range', 'media_time_range', 'image_region', 'dataset_rows', 'dataset_columns', 'dataset_cells', 'dataset_query', 'repository_path', 'code_symbol', 'composite_fragment', 'other'];
const PRECISION_VALUES = ['exact', 'approximate', 'inferred', 'unknown'];
const PROJECTION_ROLES = ['generation', 'reconstruction_reference', 'comparison', 'compatibility_hint', 'inline_note'];

const ID_PREFIX = { sources: 'src-', sections: 'sec-', occurrences: 'occ-', entities: 'ent-' };

// Recommended/known fields per namespace (Part 4 §3–§9). Fields outside these
// sets that are not x- namespaced raise EXT-01 unknown_field.
const KNOWN_FIELDS = {
  sources: ['id', 'type', 'title', 'uri', 'description', 'revision', 'accessed_at', 'media_type', 'lang', 'license', 'authors', 'status', 'components', 'generated_by', 'generated_at', 'access', 'note', 'notes', 'label', 'rationale', 'anchors', 'extensions'],
  sections: ['id', 'title', 'description', 'anchors', 'occurrences', 'status', 'note', 'notes', 'label', 'rationale', 'extensions'],
  occurrences: ['id', 'entity', 'role', 'status', 'rationale', 'anchors', 'confidence', 'note', 'notes', 'label', 'title', 'description', 'extensions'],
  entities: ['id', 'kind', 'content', 'payload', 'ref', 'status', 'lang', 'anchors', 'note', 'notes', 'label', 'title', 'description', 'rationale', 'supersedes', 'extensions'],
};
const ANCHOR_FIELDS = ['source', 'type', 'ranges', 'precision', 'role', 'purpose', 'path', 'paragraph', 'region', 'rows', 'columns', 'cells', 'query', 'symbol', 'revision', 'start', 'end', 'note', 'notes', 'description', 'label'];

// Anchor-type-specific recommended fields (ANC-09, §6.5–6.8).
const ANCHOR_TYPE_FIELDS = {
  line_range: ['ranges'],
  character_range: ['ranges'],
  page_range: ['ranges'],
  heading_path: ['path'],
  paragraph: ['paragraph'],
  media_time_range: ['start', 'end'],
  image_region: ['region'],
};

// Strict-mode promotion set (checklist §11, decision D8).
const STRICT_PROMOTED = new Set([
  'yaml_restricted_feature',
  'empty_namespace',
  'unknown_namespace',
  'unknown_status',
  'profile_unsupported',
  'unknown_projection_role',
  'unknown_source_type',
  'source_metadata_missing',
  'placeholder_object',
  'occurrence_entity_missing',
  'occurrence_role_missing',
  'unknown_anchor_type',
  'unknown_precision',
  'unknown_field',
  'undeclared_extension',
]);

const PLACEHOLDER_HINT = 'if intentional, mark it with `status: draft`';

function isExtensionField(key) {
  return key.startsWith('x-');
}

function looksIso8601(v) {
  return typeof v === 'string' && /^\d{4}-\d{2}-\d{2}([T ][0-9:.]+([Zz]|[+-]\d{2}:?\d{2})?)?$/.test(v);
}

function validateDocument(loaded, options = {}) {
  const mode = options.mode === 'strict' ? 'strict' : 'core';
  const includeInfo = !!options.info;
  const allowUnsupportedSpec = !!options.allowUnsupportedSpec;

  const diagnostics = [];
  const push = (severity, code, rule, message, path, objectId, field) => {
    diagnostics.push({
      severity,
      code,
      rule,
      message,
      path: path || null,
      object_id: objectId || null,
      field: field || null,
    });
  };

  for (const d of loaded.diagnostics || []) diagnostics.push(d);

  const data = loaded.fatal ? null : loaded.data;
  if (data) {
    validateStructure(data, push);
  }

  // Mode resolution: strict promotes the D8 set; --allow-unsupported-spec
  // downgrades spec_version_unsupported (D7).
  const resolved = diagnostics.map((d) => {
    let severity = d.severity;
    if (d.code === 'spec_version_unsupported' && allowUnsupportedSpec) severity = 'warning';
    else if (mode === 'strict' && STRICT_PROMOTED.has(d.code)) severity = 'error';
    return severity === d.severity ? d : { ...d, severity };
  });

  const emitted = includeInfo ? resolved : resolved.filter((d) => d.severity !== 'info');
  const errors = emitted.filter((d) => d.severity === 'error').length;
  const warnings = emitted.filter((d) => d.severity === 'warning').length;
  const infos = emitted.filter((d) => d.severity === 'info').length;
  return {
    ok: errors === 0,
    mode,
    diagnostics: emitted,
    summary: { ok: errors === 0, errors, warnings, infos },
  };
}

function validateStructure(data, push) {
  // NS-01/02: required namespaces and their types.
  const nsValid = {};
  for (const ns of REQUIRED_NAMESPACES) {
    if (!(ns in data)) {
      push('error', 'required_namespace_missing', 'NS-01', `required namespace \`${ns}\` is missing`, ns);
      nsValid[ns] = false;
      continue;
    }
    const wantMapping = ns === 'meta';
    const ok = wantMapping ? isMapping(data[ns]) : Array.isArray(data[ns]);
    if (!ok) {
      push('error', 'required_namespace_wrong_type', 'NS-02', `required namespace \`${ns}\` must be ${wantMapping ? 'a mapping' : 'an array'}`, ns);
      nsValid[ns] = false;
      continue;
    }
    nsValid[ns] = true;
  }

  // NS-03: unknown top-level namespaces; NS-04: empty required namespaces.
  for (const key of Object.keys(data)) {
    if (!REQUIRED_NAMESPACES.includes(key) && !OPTIONAL_NAMESPACES.includes(key)) {
      push('warning', 'unknown_namespace', 'NS-03', `unknown top-level namespace \`${key}\` (preserved, not interpreted as Core)`, key);
    }
  }
  for (const ns of REQUIRED_ARRAY_NAMESPACES) {
    if (nsValid[ns] && data[ns].length === 0) {
      push('info', 'empty_namespace', 'NS-04', `required namespace \`${ns}\` is empty`, ns);
    }
  }

  if (nsValid.meta) validateMeta(data.meta, push);

  const model = buildModel(data);
  const ids = {};
  for (const ns of REQUIRED_ARRAY_NAMESPACES) {
    ids[ns] = model.namespaces[ns].valid ? model.namespaces[ns].idSet : null; // null = cannot resolve against
  }

  // Common object shape per namespace (SRC/SEC/OCC/ENT 01–03, EXT-01/02, NUL-01, XID-02).
  for (const ns of REQUIRED_ARRAY_NAMESPACES) {
    const info = model.namespaces[ns];
    if (!info.valid) continue;
    info.entries.forEach((entry) => {
      const path = `${ns}[${entry.index}]`;
      if (!entry.mapping) {
        push('error', 'object_not_mapping', `${ruleNs(ns)}-01`, `item in \`${ns}\` is not a mapping object`, path);
        return;
      }
      if (!entry.idValid) {
        push('error', 'object_id_invalid', `${ruleNs(ns)}-02`, `object in \`${ns}\` has a missing, empty, or non-string \`id\``, path, null, 'id');
      } else {
        if (!entry.id.startsWith(ID_PREFIX[ns])) {
          push('info', 'id_prefix_unconventional', 'XID-02', `id \`${entry.id}\` does not use the recommended \`${ID_PREFIX[ns]}\` prefix`, path, entry.id, 'id');
        }
      }
      checkObjectFields(ns, entry, path, push);
    });
    for (const dup of info.duplicates) {
      push('error', 'duplicate_id', `${ruleNs(ns)}-03`, `duplicate id \`${dup.id}\` in \`${ns}\``, `${ns}[${dup.index}]`, dup.id, 'id');
    }
  }

  // XID-01: cross-namespace id reuse.
  const seen = new Map();
  for (const ns of REQUIRED_ARRAY_NAMESPACES) {
    if (!ids[ns]) continue;
    for (const id of ids[ns]) {
      if (seen.has(id) && seen.get(id) !== ns) {
        push('warning', 'cross_namespace_id_reuse', 'XID-01', `id \`${id}\` is used in both \`${seen.get(id)}\` and \`${ns}\``, null, id);
      } else {
        seen.set(id, ns);
      }
    }
  }

  const referencedSources = new Set();
  const anchorCtx = { ids, referencedSources, push };

  if (model.namespaces.sources.valid) validateSources(model.namespaces.sources, anchorCtx);
  const sectionRefs = model.namespaces.sections.valid
    ? validateSections(model.namespaces.sections, ids, anchorCtx)
    : { referencedOccurrences: new Map() };
  const occRefs = model.namespaces.occurrences.valid
    ? validateOccurrences(model.namespaces.occurrences, ids, sectionRefs.referencedOccurrences, anchorCtx)
    : { referencedEntities: new Set() };
  if (model.namespaces.entities.valid) validateEntities(model.namespaces.entities, occRefs.referencedEntities, anchorCtx);

  // SRC-07: sources never referenced by any anchor.
  if (model.namespaces.sources.valid) {
    for (const entry of model.namespaces.sources.entries) {
      if (entry.idValid && !referencedSources.has(entry.id)) {
        push('info', 'source_unreferenced', 'SRC-07', `source \`${entry.id}\` is not referenced by any anchor`, `sources[${entry.index}]`, entry.id);
      }
    }
  }

  if ('structure' in data) validateStructureNamespace(data.structure, ids.sections, push);
  if ('extensions' in data && data.extensions !== undefined) {
    if (!isMapping(data.extensions)) {
      push('warning', 'field_wrong_type', 'EXT-03', '`extensions` should be a mapping', 'extensions');
    } else if (Object.keys(data.extensions).length) {
      push('info', 'undeclared_extension', 'EXT-02', 'extension data present in `extensions` (preserved; profile validation not performed)', 'extensions');
    }
  }
}

function ruleNs(ns) {
  return { sources: 'SRC', sections: 'SEC', occurrences: 'OCC', entities: 'ENT' }[ns];
}

function checkObjectFields(ns, entry, path, push) {
  for (const [key, value] of Object.entries(entry.obj)) {
    if (value === null) {
      // NUL-01. Required fields are reported by their own rules, not here.
      if (key !== 'id' && !(ns === 'occurrences' && (key === 'entity' || key === 'role'))) {
        push('warning', 'null_optional_field', 'NUL-01', `optional field \`${key}\` is explicitly null; omit it instead`, path, entry.id, key);
      }
      continue;
    }
    if (isExtensionField(key)) {
      push('info', 'undeclared_extension', 'EXT-02', `extension field \`${key}\` present (preserved; profile validation not performed)`, path, entry.id, key);
    } else if (!KNOWN_FIELDS[ns].includes(key)) {
      push('warning', 'unknown_field', 'EXT-01', `unknown field \`${key}\` on ${ns.slice(0, -1)} object`, path, entry.id, key);
    }
  }
  const status = entry.obj.status;
  const statusRule = { sources: 'SRC-08', sections: 'SEC-08', occurrences: 'OCC-08', entities: 'ENT-09' }[ns];
  if (isNonEmptyString(status) && !OBJ_STATUS.includes(status)) {
    push('warning', 'unknown_status', statusRule, `unknown object status \`${status}\``, path, entry.id, 'status');
  }
}

function validateMeta(meta, push) {
  for (const field of ['spec_version', 'document_id', 'status']) {
    if (!(field in meta)) {
      push('error', 'meta_field_missing', metaRule(field), `\`meta.${field}\` is required`, 'meta', null, field);
    } else if (!isNonEmptyString(meta[field])) {
      push('error', 'meta_field_invalid', metaRule(field), `\`meta.${field}\` must be a non-empty string`, `meta.${field}`, null, field);
    }
  }
  if (isNonEmptyString(meta.spec_version) && meta.spec_version !== SPEC_VERSION) {
    push('error', 'spec_version_unsupported', 'META-02', `unsupported spec_version \`${meta.spec_version}\` (this tool targets ${SPEC_VERSION})`, 'meta.spec_version', null, 'spec_version');
  }
  if (isNonEmptyString(meta.status) && !DOC_STATUS.includes(meta.status)) {
    push('warning', 'unknown_status', 'META-05', `unknown document status \`${meta.status}\``, 'meta.status', null, 'status');
  }
  if (Array.isArray(meta.profiles) && meta.profiles.length) {
    push('warning', 'profile_unsupported', 'META-06', `declared profiles are not supported by this tool; profile validation was not performed (${meta.profiles.join(', ')})`, 'meta.profiles', null, 'profiles');
  }
  if (meta.projections !== undefined) {
    if (!Array.isArray(meta.projections)) {
      push('warning', 'projection_reference_malformed', 'META-07', '`meta.projections` should be an array', 'meta.projections', null, 'projections');
    } else {
      meta.projections.forEach((p, i) => {
        const path = `meta.projections[${i}]`;
        if (!isMapping(p)) {
          push('warning', 'projection_reference_malformed', 'META-07', 'projection reference should be a mapping', path);
          return;
        }
        if (!isNonEmptyString(p.role) || (p.ref === undefined && p.inline === undefined)) {
          push('warning', 'projection_reference_malformed', 'META-07', 'projection reference should have `role` and at least one of `ref` / `inline`', path);
        }
        if (isNonEmptyString(p.role) && !PROJECTION_ROLES.includes(p.role)) {
          push('warning', 'unknown_projection_role', 'META-08', `unknown projection role \`${p.role}\``, path, null, 'role');
        }
        // D6: p.inline content is intentionally not inspected.
      });
    }
  }
  for (const field of ['created_at', 'updated_at']) {
    if (meta[field] !== undefined && !looksIso8601(meta[field])) {
      push('warning', 'timestamp_malformed', 'META-10', `\`meta.${field}\` does not look like an ISO 8601 timestamp`, `meta.${field}`, null, field);
    }
  }
}

function metaRule(field) {
  return { spec_version: 'META-01', document_id: 'META-03', status: 'META-04' }[field];
}

function validateSources(info, ctx) {
  for (const entry of info.entries) {
    if (!entry.mapping) continue;
    const path = `sources[${entry.index}]`;
    const src = entry.obj;
    if (src.type === undefined || src.type === null) {
      ctx.push('warning', 'source_type_missing', 'SRC-04', 'source has no `type`', path, entry.id, 'type');
    } else if (isNonEmptyString(src.type) && !SOURCE_TYPES.includes(src.type)) {
      ctx.push('warning', 'unknown_source_type', 'SRC-05', `unknown source type \`${src.type}\``, path, entry.id, 'type');
    }
    if (!isNonEmptyString(src.title) && !isNonEmptyString(src.uri) && !isNonEmptyString(src.description)) {
      ctx.push('warning', 'source_metadata_missing', 'SRC-06', `source has no \`title\`, \`uri\`, or \`description\`; ${PLACEHOLDER_HINT}`, path, entry.id);
    }
    validateAnchors(src, path, entry.id, ctx);
  }
}

function validateSections(info, ids, ctx) {
  const referencedOccurrences = new Map(); // occ id -> [section ids]
  for (const entry of info.entries) {
    if (!entry.mapping) continue;
    const path = `sections[${entry.index}]`;
    const sec = entry.obj;
    validateAnchors(sec, path, entry.id, ctx);
    if (sec.occurrences !== undefined && sec.occurrences !== null) {
      if (!Array.isArray(sec.occurrences)) {
        ctx.push('error', 'field_wrong_type', 'SEC-04', '`occurrences` must be an array of Occurrence IDs', path, entry.id, 'occurrences');
        continue;
      }
      const local = new Set();
      sec.occurrences.forEach((ref, i) => {
        const refPath = `${path}.occurrences[${i}]`;
        if (!isNonEmptyString(ref)) {
          ctx.push('error', 'field_wrong_type', 'SEC-04', 'occurrence reference must be a non-empty string', refPath, entry.id, 'occurrences');
          return;
        }
        if (ids.occurrences && !ids.occurrences.has(ref)) {
          ctx.push('error', 'unresolved_reference', 'SEC-05', `section references missing occurrence \`${ref}\``, refPath, entry.id, 'occurrences');
        }
        if (local.has(ref)) {
          ctx.push('warning', 'duplicate_occurrence_reference', 'SEC-07', `section references occurrence \`${ref}\` more than once`, refPath, entry.id, 'occurrences');
        }
        local.add(ref);
        if (entry.idValid) {
          if (!referencedOccurrences.has(ref)) referencedOccurrences.set(ref, []);
          if (!referencedOccurrences.get(ref).includes(entry.id)) referencedOccurrences.get(ref).push(entry.id);
        }
      });
    }
    if (!Array.isArray(sec.occurrences) || sec.occurrences.length === 0) {
      ctx.push('warning', 'placeholder_object', 'SEC-06', `section has no occurrences; ${PLACEHOLDER_HINT}`, path, entry.id, 'occurrences');
    }
  }
  return { referencedOccurrences };
}

function validateOccurrences(info, ids, referencedOccurrences, ctx) {
  const referencedEntities = new Set();
  for (const entry of info.entries) {
    if (!entry.mapping) continue;
    const path = `occurrences[${entry.index}]`;
    const occ = entry.obj;
    validateAnchors(occ, path, entry.id, ctx);

    // OCC-04/05 (D5): absence of entity/role marks a placeholder — warning,
    // not error; see spec-feedback F1 for the §13.6 circularity.
    if (!isNonEmptyString(occ.entity)) {
      if (occ.entity !== undefined && occ.entity !== null && typeof occ.entity !== 'string') {
        ctx.push('error', 'field_wrong_type', 'OCC-06', '`entity` must be a string Entity ID', path, entry.id, 'entity');
      } else {
        ctx.push('warning', 'occurrence_entity_missing', 'OCC-04', `occurrence has no \`entity\`; ${PLACEHOLDER_HINT}`, path, entry.id, 'entity');
      }
    } else {
      referencedEntities.add(occ.entity);
      if (ids.entities && !ids.entities.has(occ.entity)) {
        ctx.push('error', 'unresolved_reference', 'OCC-06', `occurrence references missing entity \`${occ.entity}\``, path, entry.id, 'entity');
      }
    }
    if (!isNonEmptyString(occ.role)) {
      if (occ.role !== undefined && occ.role !== null && typeof occ.role !== 'string') {
        ctx.push('error', 'field_wrong_type', 'OCC-05', '`role` must be a string', path, entry.id, 'role');
      } else {
        ctx.push('warning', 'occurrence_role_missing', 'OCC-05', `occurrence has no \`role\`; ${PLACEHOLDER_HINT}`, path, entry.id, 'role');
      }
    }
    // OCC-07: role vocabulary is open in Core mode — no unknown-role diagnostic.

    if (occ.confidence !== undefined && occ.confidence !== null) {
      if (typeof occ.confidence !== 'number' || occ.confidence < 0 || occ.confidence > 1) {
        ctx.push('warning', 'confidence_out_of_range', 'OCC-09', '`confidence` should be a number between 0 and 1', path, entry.id, 'confidence');
      }
    }
    if (entry.idValid) {
      const refs = referencedOccurrences.get(entry.id) || [];
      if (refs.length === 0) {
        ctx.push('warning', 'occurrence_unreferenced', 'OCC-10', 'occurrence is not referenced by any section', path, entry.id);
      } else if (refs.length > 1) {
        ctx.push('warning', 'occurrence_multi_section', 'OCC-11', `occurrence is referenced by multiple sections (${refs.join(', ')}); prefer one occurrence per placement`, path, entry.id);
      }
    }
  }
  return { referencedEntities };
}

function validateEntities(info, referencedEntities, ctx) {
  for (const entry of info.entries) {
    if (!entry.mapping) continue;
    const path = `entities[${entry.index}]`;
    const ent = entry.obj;
    validateAnchors(ent, path, entry.id, ctx);
    if (ent.content !== undefined && ent.content !== null && typeof ent.content !== 'string') {
      ctx.push('error', 'field_wrong_type', 'ENT-04', '`content` must be a string', path, entry.id, 'content');
    }
    if (ent.ref !== undefined && ent.ref !== null && !isNonEmptyString(ent.ref)) {
      ctx.push('error', 'field_wrong_type', 'ENT-05', '`ref` must be a non-empty string', path, entry.id, 'ref');
    }
    const hasMaterial = (ent.content !== undefined && ent.content !== null)
      || (ent.payload !== undefined && ent.payload !== null)
      || (ent.ref !== undefined && ent.ref !== null);
    if (!hasMaterial) {
      ctx.push('warning', 'placeholder_object', 'ENT-06', `entity has none of \`content\`, \`payload\`, \`ref\`; ${PLACEHOLDER_HINT}`, path, entry.id);
    }
    // ENT-07/08: payload is preserved without schema validation; kind is open.
    if (entry.idValid && !referencedEntities.has(entry.id)) {
      ctx.push('warning', 'entity_unreferenced', 'ENT-10', 'entity is not referenced by any occurrence', path, entry.id);
    }
  }
}

function validateAnchors(obj, ownerPath, ownerId, ctx) {
  if (obj.anchors === undefined || obj.anchors === null) return;
  if (!Array.isArray(obj.anchors)) {
    ctx.push('error', 'field_wrong_type', 'ANC-01', '`anchors` must be an array', ownerPath, ownerId, 'anchors');
    return;
  }
  obj.anchors.forEach((anchor, i) => {
    const path = `${ownerPath}.anchors[${i}]`;
    if (!isMapping(anchor)) {
      ctx.push('error', 'object_not_mapping', 'ANC-02', 'anchor must be a mapping', path, ownerId);
      return;
    }
    if (!isNonEmptyString(anchor.source)) {
      ctx.push('error', 'anchor_field_missing', 'ANC-03', 'anchor lacks required `source`', path, ownerId, 'source');
    } else {
      ctx.referencedSources.add(anchor.source);
      if (ctx.ids.sources && !ctx.ids.sources.has(anchor.source)) {
        ctx.push('error', 'unresolved_reference', 'ANC-05', `anchor references missing source \`${anchor.source}\``, path, ownerId, 'source');
      }
    }
    if (!isNonEmptyString(anchor.type)) {
      ctx.push('error', 'anchor_field_missing', 'ANC-04', 'anchor lacks required `type`', path, ownerId, 'type');
    } else {
      if (!ANCHOR_TYPES.includes(anchor.type)) {
        ctx.push('warning', 'unknown_anchor_type', 'ANC-06', `unknown anchor type \`${anchor.type}\``, path, ownerId, 'type');
      }
      const wanted = ANCHOR_TYPE_FIELDS[anchor.type];
      if (wanted) {
        const missing = wanted.filter((f) => anchor[f] === undefined || anchor[f] === null);
        if (missing.length) {
          ctx.push('warning', 'anchor_fields_incomplete', 'ANC-09', `\`${anchor.type}\` anchor lacks recommended field(s): ${missing.join(', ')}`, path, ownerId);
        }
      }
    }
    if (anchor.precision !== undefined && anchor.precision !== null) {
      if (!PRECISION_VALUES.includes(anchor.precision)) {
        ctx.push('warning', 'unknown_precision', 'ANC-07', `unknown anchor precision \`${anchor.precision}\``, path, ownerId, 'precision');
      } else if (anchor.precision === 'approximate' || anchor.precision === 'inferred') {
        ctx.push('info', 'anchor_precision_note', 'ANC-10', `anchor is marked \`${anchor.precision}\``, path, ownerId, 'precision');
      }
    }
    if (anchor.ranges !== undefined && anchor.ranges !== null) {
      if (!Array.isArray(anchor.ranges)) {
        ctx.push('warning', 'anchor_range_invalid', 'ANC-08', '`ranges` should be an array of { start, end } mappings', path, ownerId, 'ranges');
      } else {
        anchor.ranges.forEach((range, j) => {
          const rPath = `${path}.ranges[${j}]`;
          if (!isMapping(range) || !Number.isInteger(range.start) || !Number.isInteger(range.end)) {
            ctx.push('warning', 'anchor_range_invalid', 'ANC-08', 'range should have integer `start` and `end`', rPath, ownerId, 'ranges');
          } else if (range.start > range.end) {
            ctx.push('warning', 'anchor_range_invalid', 'ANC-08', `range start (${range.start}) is greater than end (${range.end})`, rPath, ownerId, 'ranges');
          }
        });
      }
    }
    // ANC-11 (D9): anchor role/purpose are open vocabulary — no diagnostic.
    for (const [key, value] of Object.entries(anchor)) {
      if (value === null) continue;
      if (isExtensionField(key)) {
        ctx.push('info', 'undeclared_extension', 'EXT-02', `extension field \`${key}\` present on anchor (preserved)`, path, ownerId, key);
      } else if (!ANCHOR_FIELDS.includes(key)) {
        ctx.push('warning', 'unknown_field', 'EXT-01', `unknown field \`${key}\` on anchor`, path, ownerId, key);
      }
    }
  });
}

function validateStructureNamespace(structure, sectionIds, push) {
  if (!isMapping(structure)) {
    push('warning', 'structure_invalid', 'STR-01', '`structure` should be a mapping', 'structure');
    return;
  }
  if (structure.sections !== undefined && structure.sections !== null) {
    if (!Array.isArray(structure.sections)) {
      push('warning', 'structure_invalid', 'STR-01', '`structure.sections` should be an array of Section IDs', 'structure.sections');
    } else {
      const seen = new Set();
      structure.sections.forEach((ref, i) => {
        const path = `structure.sections[${i}]`;
        if (!isNonEmptyString(ref)) {
          push('warning', 'structure_invalid', 'STR-01', 'structure section reference should be a string', path);
          return;
        }
        if (sectionIds && !sectionIds.has(ref)) {
          push('warning', 'structure_section_unresolved', 'STR-02', `structure references missing section \`${ref}\``, path);
        }
        if (seen.has(ref)) {
          push('warning', 'structure_section_duplicate', 'STR-04', `structure lists section \`${ref}\` more than once`, path);
        }
        seen.add(ref);
      });
      if (sectionIds) {
        for (const id of sectionIds) {
          if (!seen.has(id)) {
            push('warning', 'structure_section_omitted', 'STR-03', `section \`${id}\` is omitted from structure.sections`, 'structure.sections');
          }
        }
      }
    }
  }
  for (const groupKind of ['groups', 'views']) {
    if (Array.isArray(structure[groupKind])) {
      structure[groupKind].forEach((g, i) => {
        if (isMapping(g) && Array.isArray(g.sections)) {
          g.sections.forEach((ref, j) => {
            if (isNonEmptyString(ref) && sectionIds && !sectionIds.has(ref)) {
              push('warning', 'structure_reference_invalid', 'STR-05', `structure ${groupKind} reference missing section \`${ref}\``, `structure.${groupKind}[${i}].sections[${j}]`);
            }
          });
        }
      });
    }
  }
}

module.exports = { validateDocument, SPEC_VERSION, STRICT_PROMOTED };
