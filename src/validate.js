const { diag, makeMeta, makeSummary } = require('./diagnostics');
const { stableStringify } = require('./utils');

// Structural validation for IdeaMark Core v1.1.1 (Core Constraints §7).
//
// Scope notes:
// - Validation constrains structure, not meaning (§7.1, §7.16). Payload bodies
//   are never interpreted here, and no controlled vocabulary is enforced for
//   entity.kind / occurrence.role / relation.type / anchorage.view /
//   anchorage.phase / payload.format.profile (§7.12).
// - Unknown fields are ignored; unknown payload profiles never invalidate a
//   document (§7.18).
// - External references (other documents' element ids, Core Spec §9.2 /
//   ADR-0003) are treated as opaque and are NOT resolved: reusing an element
//   id from another document is a normal case, not an error. Identity across
//   documents is exact (doc_id, element_id) comparison — no sameAs inference.

const ATOMICITY_BASIS_VALUES = ['interpretive', 'lexical', 'structural'];
const ATOMICITY_BASIS_DEFAULT = 'interpretive';

function isObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v);
}

// §7.11: atomicity_basis defaults to interpretive when omitted.
function getAtomicityBasis(entity) {
  if (isObject(entity) && entity.atomicity_basis !== undefined) return entity.atomicity_basis;
  return ATOMICITY_BASIS_DEFAULT;
}

function collectIds(registry) {
  return {
    entities: new Set(Object.keys(registry.entities || {})),
    occurrences: new Set(Object.keys(registry.occurrences || {})),
    sections: new Set(Object.keys(registry.sections || {})),
    relations: new Set(isObject(registry.relations) ? Object.keys(registry.relations) : []),
    perspectives: new Set(isObject(registry.perspectives) ? Object.keys(registry.perspectives) : []),
  };
}

function parseRef(ref, docId) {
  if (typeof ref !== 'string') return { kind: 'unknown' };
  if (ref.startsWith('ideamark://docs/')) {
    const m = ref.match(/^ideamark:\/\/docs\/([^#]+)#\/(entities|occurrences|sections|perspectives)\/([^#]+)$/);
    if (m) {
      const [, refDoc, type, id] = m;
      if (docId && refDoc === docId) return { kind: 'local', type, id };
      return { kind: 'external' };
    }
    return { kind: 'external' };
  }
  const fq = ref.match(/^([^#]+)#([^#]+)$/);
  if (fq) {
    const [, refDoc, id] = fq;
    if (docId && refDoc === docId) return { kind: 'local', id };
    return { kind: 'external' };
  }
  return { kind: 'local', id: ref };
}

function validateDocument(doc, options) {
  const mode = (options && options.mode) || 'working';
  const strict = mode === 'strict';
  const diagnostics = [];
  const push = (severity, code, message, location) => {
    diagnostics.push(diag(severity, code, message, location, mode));
  };
  const isEvidenceBlock = (seg) => {
    return seg
      && seg.type === 'yaml'
      && seg.subtype === 'fenced'
      && typeof seg.info === 'string'
      && seg.info.includes('ideamark:evidence');
  };

  if (doc.parseErrors.length) {
    push('error', 'yaml_parse_error', 'YAML parse error', { scope: 'yaml' });
  }

  // Document header is a CLI-level requirement (document identity for
  // cross-document references), not part of Core Constraints §7.
  if (!doc.header) {
    push('error', 'header_required', 'Document header is required', { scope: 'header' });
  } else {
    if (doc.headerCount > 1) {
      push('error', 'header_singleton', 'Multiple document headers found', { scope: 'header' });
    }
    if (strict) {
      const required = [
        'ideamark_version',
        'doc_id',
        'doc_type',
        'status',
        'created_at',
        'updated_at',
        'lang',
      ];
      for (const key of required) {
        if (doc.header[key] === undefined) {
          push('error', 'header_required', `Missing header field: ${key}`, { scope: 'header', path: key });
        }
      }
    }
  }

  const registry = doc.registry || {};
  const docId = doc.header && doc.header.doc_id;
  const idSets = collectIds(registry);

  // §7.3 / §7.14: entities, occurrences, sections are required and non-empty.
  // Errors in strict mode; downgraded to warnings for working drafts.
  const requiredSeverity = strict ? 'error' : 'warning';
  if (idSets.entities.size === 0) {
    push(requiredSeverity, 'entities_required', 'Document must define at least one entity (§7.3, §7.14)', { scope: 'entity' });
  }
  if (idSets.occurrences.size === 0) {
    push(requiredSeverity, 'occurrences_required', 'Document must define at least one occurrence (§7.3, §7.14)', { scope: 'occurrence' });
  }
  if (idSets.sections.size === 0) {
    push(requiredSeverity, 'sections_required', 'Document must define at least one section (§7.3, §7.14)', { scope: 'section' });
  }

  // §7.5: identifier uniqueness per namespace (entity_id / occurrence_id /
  // section_id / relation_id / perspective_id).
  if (doc.duplicates) {
    const dupKinds = [
      ['entities', 'entity'],
      ['occurrences', 'occurrence'],
      ['sections', 'section'],
      ['relations', 'relation'],
      ['perspectives', 'perspective'],
    ];
    for (const [key, scope] of dupKinds) {
      for (const id of doc.duplicates[key] || []) {
        push('error', 'id_duplicate', `Duplicate ${scope} id: ${id}`, { scope, id });
      }
    }
  }

  // relations / perspectives are id-keyed namespaces in v1.1.1.
  if (registry.relations !== undefined && !isObject(registry.relations)) {
    push('error', 'relations_mapping_required', 'relations must be a mapping keyed by relation_id', { scope: 'relation', path: 'relations' });
  }
  if (registry.perspectives !== undefined && !isObject(registry.perspectives)) {
    push('error', 'perspectives_mapping_required', 'perspectives must be a mapping keyed by perspective_id', { scope: 'perspective', path: 'perspectives' });
  }

  // Evidence Block must be a mapping/object (CLI extension, v0.1.2)
  for (const seg of doc.segments || []) {
    if (!isEvidenceBlock(seg)) continue;
    if (!seg.parsed || !seg.parsed.ok) continue;
    if (!isObject(seg.parsed.value)) {
      push('error', 'evidence_mapping', 'Evidence Block must be a mapping/object', { scope: 'evidence' });
    }
  }

  // §7.6: each occurrence MUST define entity and role.
  // §7.4: occurrence.entity MUST refer to an existing entity (local refs only;
  // references into other documents are opaque and stay unchecked).
  for (const [occId, occ] of Object.entries(registry.occurrences || {})) {
    if (!isObject(occ)) {
      push('error', 'occurrence_entity_required', 'Occurrence must define entity (§7.6)', { scope: 'occurrence', id: occId, path: 'entity' });
      push('error', 'occurrence_role_required', 'Occurrence must define role (§7.6)', { scope: 'occurrence', id: occId, path: 'role' });
      continue;
    }
    if (occ.entity === undefined || occ.entity === null || occ.entity === '') {
      push('error', 'occurrence_entity_required', 'Occurrence must define entity (§7.6)', { scope: 'occurrence', id: occId, path: 'entity' });
    } else if (typeof occ.entity === 'string') {
      const ref = parseRef(occ.entity, docId);
      if (ref.kind === 'local' && !idSets.entities.has(ref.id)) {
        push('error', 'entity_ref_invalid', `Entity reference not found: ${occ.entity} (§7.4)`, { scope: 'occurrence', id: occId, path: 'entity' });
      }
    }
    if (occ.role === undefined || occ.role === null || occ.role === '') {
      push('error', 'occurrence_role_required', 'Occurrence must define role (§7.6)', { scope: 'occurrence', id: occId, path: 'role' });
    }
  }

  // §7.6: each section MUST define occurrences as a non-empty array.
  // §7.4: section.occurrences MUST refer to existing occurrences.
  for (const [secId, sec] of Object.entries(registry.sections || {})) {
    const occs = isObject(sec) ? sec.occurrences : undefined;
    if (!Array.isArray(occs) || occs.length === 0) {
      push('error', 'section_occurrences_required', 'Section must define a non-empty occurrences array (§7.6)', { scope: 'section', id: secId, path: 'occurrences' });
      continue;
    }
    for (const occRef of occs) {
      if (typeof occRef !== 'string') continue;
      const ref = parseRef(occRef, docId);
      if (ref.kind === 'local' && !idSets.occurrences.has(ref.id)) {
        push('error', 'occurrence_ref_invalid', `Occurrence reference not found: ${occRef} (§7.4)`, { scope: 'section', id: secId, path: 'occurrences' });
      }
    }
  }

  // §7.4 / Core Spec §6.3: relations.from / relations.to MUST refer to a valid
  // target (entity_ref or section_ref). A bare local id resolves against the
  // entity namespace first, then the section namespace; an id present in both
  // namespaces is ambiguous and reported as a warning (ADR-0001).
  if (isObject(registry.relations)) {
    for (const [relId, rel] of Object.entries(registry.relations)) {
      for (const end of ['from', 'to']) {
        const value = isObject(rel) ? rel[end] : undefined;
        if (value === undefined || value === null || value === '') {
          push('error', `relation_${end}_required`, `Relation must define ${end} (§7.4)`, { scope: 'relation', id: relId, path: end });
          continue;
        }
        if (typeof value !== 'string') continue;
        const ref = parseRef(value, docId);
        if (ref.kind !== 'local') continue;
        let resolved;
        if (ref.type === 'entities') {
          resolved = idSets.entities.has(ref.id);
        } else if (ref.type === 'sections') {
          resolved = idSets.sections.has(ref.id);
        } else {
          const inEntities = idSets.entities.has(ref.id);
          const inSections = idSets.sections.has(ref.id);
          resolved = inEntities || inSections;
          if (inEntities && inSections) {
            push('warning', 'relation_ref_ambiguous', `Relation ${end} id exists as both entity and section; resolved as entity — use a typed reference form to disambiguate (§6.3)`, { scope: 'relation', id: relId, path: end });
          }
        }
        if (!resolved) {
          push('error', `relation_${end}_invalid`, `Relation ${end} reference not found: ${value} (§7.4)`, { scope: 'relation', id: relId, path: end });
        }
      }
    }
  }

  // structure.sections is a CLI-level ordering extension (not Core v1.1.1);
  // dangling ids in it are still broken internal references.
  const struct = registry.structure || {};
  if (Array.isArray(struct.sections)) {
    for (const secRef of struct.sections) {
      if (typeof secRef !== 'string') continue;
      const ref = parseRef(secRef, docId);
      if (ref.kind === 'local' && !idSets.sections.has(ref.id)) {
        push('error', 'section_ref_invalid', `Structure section reference not found: ${secRef}`, { scope: 'structure', path: 'sections' });
      }
    }
  }

  // §7.7: entity payload is required and must contain body, ref, or cache.
  // §7.9: payload.ref requires ref.uri.
  // §7.8 / §7.10 / §7.15: media_type and captured_at are SHOULD -> warnings.
  for (const [entId, ent] of Object.entries(registry.entities || {})) {
    if (!isObject(ent) || ent.payload === undefined || ent.payload === null) {
      push('error', 'payload_required', 'Entity must define payload (§7.7)', { scope: 'entity', id: entId, path: 'payload' });
      continue;
    }
    const payload = ent.payload;
    if (!isObject(payload)) {
      push('error', 'payload_content_required', 'Entity payload must contain at least one of body/ref/cache (§7.7)', { scope: 'entity', id: entId, path: 'payload' });
      continue;
    }
    const hasBody = payload.body !== undefined && payload.body !== null;
    const hasRef = payload.ref !== undefined && payload.ref !== null;
    const hasCache = payload.cache !== undefined && payload.cache !== null;
    if (!hasBody && !hasRef && !hasCache) {
      push('error', 'payload_content_required', 'Entity payload must contain at least one of body/ref/cache (§7.7)', { scope: 'entity', id: entId, path: 'payload' });
    }
    if (hasRef) {
      const uri = isObject(payload.ref) ? payload.ref.uri : undefined;
      if (uri === undefined || uri === null || uri === '') {
        push('error', 'payload_ref_uri_required', 'payload.ref requires ref.uri (§7.9)', { scope: 'entity', id: entId, path: 'payload.ref.uri' });
      }
    }
    const mediaType = isObject(payload.format) ? payload.format.media_type : undefined;
    if (mediaType === undefined || mediaType === null || mediaType === '') {
      push('warning', 'payload_media_type_missing', 'payload.format.media_type is recommended (§7.8)', { scope: 'entity', id: entId, path: 'payload.format.media_type' });
    }
    if (hasCache) {
      const capturedAt = isObject(payload.cache) ? payload.cache.captured_at : undefined;
      if (capturedAt === undefined || capturedAt === null || capturedAt === '') {
        push('warning', 'payload_captured_at_missing', 'payload.cache.captured_at is recommended (§7.10)', { scope: 'entity', id: entId, path: 'payload.cache.captured_at' });
      }
    }
    // §7.11 / §7.15 / ADR-0005: atomicity_basis is an enum with default
    // interpretive. An unknown value is a warning; it is preserved as-is and
    // Core assigns it no semantics.
    if (ent.atomicity_basis !== undefined && !ATOMICITY_BASIS_VALUES.includes(ent.atomicity_basis)) {
      push('warning', 'atomicity_basis_unknown', `atomicity_basis should be one of ${ATOMICITY_BASIS_VALUES.join('|')} (§7.11)`, { scope: 'entity', id: entId, path: 'atomicity_basis' });
    }
  }

  // §7.13 / §7.15 / ADR-0005: multi-value fields must be arrays. Single
  // scalars are already normalized by the parser; a value that cannot be
  // normalized (a mapping) is an error — it breaks every consumer that
  // iterates these fields.
  for (const [secId, sec] of Object.entries(registry.sections || {})) {
    if (!isObject(sec)) continue;
    if (sec.perspectives !== undefined && !Array.isArray(sec.perspectives)) {
      push('error', 'multi_value_field_invalid', 'perspectives must be an array (§7.13)', { scope: 'section', id: secId, path: 'perspectives' });
    }
    if (isObject(sec.anchorage)) {
      for (const key of ['view', 'phase']) {
        if (sec.anchorage[key] !== undefined && !Array.isArray(sec.anchorage[key])) {
          push('error', 'multi_value_field_invalid', `anchorage.${key} must be an array (§7.13)`, { scope: 'section', id: secId, path: `anchorage.${key}` });
        }
      }
    }
  }
  for (const [entId, ent] of Object.entries(registry.entities || {})) {
    if (!isObject(ent)) continue;
    if (ent.perspective_scope !== undefined && !Array.isArray(ent.perspective_scope)) {
      push('error', 'multi_value_field_invalid', 'perspective_scope must be an array (§7.13)', { scope: 'entity', id: entId, path: 'perspective_scope' });
    }
  }

  // Perspective references: Core Spec §2.4 / ADR-0002 — reference integrity
  // (§7.4) intentionally excludes perspective_ref. A bare ref SHOULD resolve
  // within the document; unresolved refs are warnings, never errors.
  const checkPerspectiveRefs = (values, scope, id, path) => {
    if (!Array.isArray(values)) return;
    for (const value of values) {
      if (typeof value !== 'string') continue;
      const ref = parseRef(value, docId);
      if (ref.kind === 'local' && !idSets.perspectives.has(ref.id)) {
        push('warning', 'perspective_ref_unresolved', `Perspective reference not defined in this document: ${value}`, { scope, id, path });
      }
    }
  };
  for (const [secId, sec] of Object.entries(registry.sections || {})) {
    if (isObject(sec)) checkPerspectiveRefs(sec.perspectives, 'section', secId, 'perspectives');
  }
  for (const [entId, ent] of Object.entries(registry.entities || {})) {
    if (isObject(ent)) checkPerspectiveRefs(ent.perspective_scope, 'entity', entId, 'perspective_scope');
  }
  if (isObject(registry.perspectives)) {
    for (const [pid, p] of Object.entries(registry.perspectives)) {
      if (isObject(p) && p.base !== undefined) checkPerspectiveRefs([p.base], 'perspective', pid, 'base');
    }
  }

  // §7.15 warnings: unused entities / unused sections.
  if (idSets.entities.size) {
    const referencedEntities = new Set();
    for (const occ of Object.values(registry.occurrences || {})) {
      if (isObject(occ) && typeof occ.entity === 'string') {
        const ref = parseRef(occ.entity, docId);
        if (ref.kind === 'local') referencedEntities.add(ref.id);
      }
    }
    if (isObject(registry.relations)) {
      for (const rel of Object.values(registry.relations)) {
        if (!isObject(rel)) continue;
        for (const end of ['from', 'to']) {
          if (typeof rel[end] !== 'string') continue;
          const ref = parseRef(rel[end], docId);
          if (ref.kind === 'local' && ref.type !== 'sections') referencedEntities.add(ref.id);
        }
      }
    }
    for (const id of idSets.entities) {
      if (!referencedEntities.has(id)) {
        push('warning', 'entity_unused', 'Entity is not used by any occurrence (§7.15)', { scope: 'entity', id });
      }
    }
  }

  if (idSets.occurrences.size) {
    const referencedOcc = new Set();
    for (const sec of Object.values(registry.sections || {})) {
      const occs = isObject(sec) && Array.isArray(sec.occurrences) ? sec.occurrences : [];
      for (const occRef of occs) {
        if (typeof occRef !== 'string') continue;
        const ref = parseRef(occRef, docId);
        if (ref.kind === 'local') referencedOcc.add(ref.id);
      }
    }
    for (const id of idSets.occurrences) {
      if (!referencedOcc.has(id)) {
        push('warning', 'occurrence_unused', 'Occurrence not used in any section', { scope: 'occurrence', id });
      }
    }
  }

  // section_unused is a CLI hygiene warning (§7.17 / ADR-0004), not a Core
  // §7.15 item: a section is unused when a structure.sections listing (CLI
  // ordering extension) exists and omits it.
  if (Array.isArray(struct.sections) && struct.sections.length) {
    const listed = new Set();
    for (const secRef of struct.sections) {
      if (typeof secRef !== 'string') continue;
      const ref = parseRef(secRef, docId);
      if (ref.kind === 'local') listed.add(ref.id);
    }
    for (const id of idSets.sections) {
      if (!listed.has(id)) {
        push('warning', 'section_unused', 'Section is not listed in structure.sections (CLI extension, ADR-0004)', { scope: 'section', id });
      }
    }
  }

  // Same-definition heuristic (simple): identical occurrence text blocks
  const textMap = new Map();
  for (const occ of Object.values(doc.occurrenceBlocks || [])) {
    if (!occ.occurrence_id) continue;
    const key = stableStringify(occ);
    if (textMap.has(key)) {
      push('warning', 'same_definition_candidate', 'Occurrence definition identical to another', { scope: 'occurrence', id: occ.occurrence_id });
    } else {
      textMap.set(key, occ.occurrence_id);
    }
  }

  const meta = makeMeta(mode);
  const summary = makeSummary(diagnostics);
  return { diagnostics, meta, summary, ok: summary.ok };
}

module.exports = {
  validateDocument,
  parseRef,
  getAtomicityBasis,
  ATOMICITY_BASIS_DEFAULT,
  ATOMICITY_BASIS_VALUES,
};
