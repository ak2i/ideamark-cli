const { diag, makeMeta, makeSummary } = require('./diagnostics');
const { stableStringify } = require('./utils');

function isObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v);
}

function collectIds(registry) {
  return {
    entities: new Set(Object.keys(registry.entities || {})),
    occurrences: new Set(Object.keys(registry.occurrences || {})),
    sections: new Set(Object.keys(registry.sections || {})),
    relations: new Set(Object.keys(registry.relations || {})),
    perspectives: new Set(Object.keys(registry.perspectives || {})),
  };
}

function parseRef(ref, docId) {
  if (typeof ref !== 'string') return { kind: 'unknown' };
  if (ref.startsWith('ideamark://docs/')) {
    const m = ref.match(/^ideamark:\/\/docs\/([^#]+)#\/(entities|occurrences|sections|relations|perspectives)\/([^#]+)$/);
    if (m) {
      const [, refDoc, type, id] = m;
      if (docId && refDoc === docId) return { kind: 'local', type, id };
      return { kind: 'external', type, id };
    }
    return { kind: 'external' };
  }
  const fq = ref.match(/^([^#]+)#([^#]+)$/);
  if (fq) {
    const [, refDoc, id] = fq;
    if (docId && refDoc === docId) return { kind: 'local', id };
    return { kind: 'external', id };
  }
  return { kind: 'local', id: ref };
}

function hasAnyPayloadContent(payload) {
  return payload && (payload.body !== undefined || payload.ref !== undefined || payload.cache !== undefined);
}

function validateDocument(doc, options) {
  const mode = options.mode || 'working';
  const strict = mode === 'strict';
  const diagnostics = [];
  const registry = doc.registry || {};
  const isEvidenceBlock = (seg) => {
    return seg
      && seg.type === 'yaml'
      && seg.subtype === 'fenced'
      && typeof seg.info === 'string'
      && seg.info.includes('ideamark:evidence');
  };

  if (doc.parseErrors.length) {
    diagnostics.push(
      diag('error', 'yaml_parse_error', 'YAML parse error', { scope: 'yaml' }, mode)
    );
  }

  if (!doc.header) {
    diagnostics.push(
      diag('error', 'header_required', 'Document header is required', { scope: 'header' }, mode)
    );
  } else {
    if (doc.headerCount > 1) {
      diagnostics.push(
        diag('error', 'header_singleton', 'Multiple document headers found', { scope: 'header' }, mode)
      );
    }
    if (strict) {
      const required = ['ideamark_version', 'doc_id', 'doc_type', 'status', 'created_at', 'updated_at', 'lang'];
      for (const key of required) {
        if (doc.header[key] === undefined) {
          diagnostics.push(
            diag('error', 'header_required', `Missing header field: ${key}`, { scope: 'header', path: key }, mode)
          );
        }
      }
    }
  }

  for (const seg of doc.segments || []) {
    if (!isEvidenceBlock(seg)) continue;
    if (!seg.parsed || !seg.parsed.ok) continue;
    if (!isObject(seg.parsed.value)) {
      diagnostics.push(
        diag('error', 'evidence_mapping', 'Evidence Block must be a mapping/object', { scope: 'evidence' }, mode)
      );
    }
  }

  const idSets = collectIds(registry);

  if (Object.keys(registry.entities || {}).length === 0) {
    diagnostics.push(diag('error', 'entity_required', 'At least one entity required', { scope: 'entity' }, mode));
  }
  if (Object.keys(registry.occurrences || {}).length === 0) {
    diagnostics.push(diag('error', 'occurrence_required', 'At least one occurrence required', { scope: 'occurrence' }, mode));
  }
  if (Object.keys(registry.sections || {}).length === 0) {
    diagnostics.push(diag('error', 'section_required', 'At least one section required', { scope: 'section' }, mode));
  }

  if (doc.duplicates) {
    for (const id of doc.duplicates.entities || []) {
      diagnostics.push(diag('error', 'id_unique_within_doc', `Duplicate entity id: ${id}`, { scope: 'entity', id }, mode));
    }
    for (const id of doc.duplicates.occurrences || []) {
      diagnostics.push(diag('error', 'id_unique_within_doc', `Duplicate occurrence id: ${id}`, { scope: 'occurrence', id }, mode));
    }
    for (const id of doc.duplicates.sections || []) {
      diagnostics.push(diag('error', 'id_unique_within_doc', `Duplicate section id: ${id}`, { scope: 'section', id }, mode));
    }
  }

  const docId = doc.header && doc.header.doc_id;

  for (const [entityId, entity] of Object.entries(registry.entities || {})) {
    if (!isObject(entity)) {
      diagnostics.push(diag('error', 'entity_mapping_required', 'Entity must be a mapping/object', { scope: 'entity', id: entityId }, mode));
      continue;
    }
    if (!isObject(entity.payload)) {
      diagnostics.push(diag('error', 'entity_payload_required', 'Entity payload is required', { scope: 'entity', id: entityId, path: 'payload' }, mode));
      continue;
    }
    if (!hasAnyPayloadContent(entity.payload)) {
      diagnostics.push(diag('error', 'entity_payload_content_required', 'Entity payload must include body, ref, or cache', { scope: 'entity', id: entityId, path: 'payload' }, mode));
    }
    if (entity.payload.ref !== undefined) {
      if (!isObject(entity.payload.ref) || typeof entity.payload.ref.uri !== 'string' || entity.payload.ref.uri.length === 0) {
        diagnostics.push(diag('error', 'entity_payload_ref_uri_required', 'payload.ref.uri is required when payload.ref is present', { scope: 'entity', id: entityId, path: 'payload.ref.uri' }, mode));
      }
    }
    if (entity.atomicity_basis !== undefined && !['interpretive', 'lexical', 'structural'].includes(entity.atomicity_basis)) {
      diagnostics.push(diag('error', 'entity_atomicity_basis_invalid', 'atomicity_basis must be interpretive, lexical, or structural', { scope: 'entity', id: entityId, path: 'atomicity_basis' }, mode));
    }
  }

  for (const [occId, occ] of Object.entries(registry.occurrences || {})) {
    if (!isObject(occ)) {
      diagnostics.push(diag('error', 'occurrence_mapping_required', 'Occurrence must be a mapping/object', { scope: 'occurrence', id: occId }, mode));
      continue;
    }
    if (typeof occ.entity !== 'string' || occ.entity.length === 0) {
      diagnostics.push(diag('error', 'occurrence_entity_required', 'Occurrence entity is required', { scope: 'occurrence', id: occId, path: 'entity' }, mode));
    } else {
      const ref = parseRef(occ.entity, docId);
      if (ref.kind === 'local' && !idSets.entities.has(ref.id)) {
        diagnostics.push(diag('error', 'entity_ref_valid', 'Entity reference not found', { scope: 'occurrence', id: occId, path: 'entity' }, mode));
      }
    }
    if (typeof occ.role !== 'string' || occ.role.length === 0) {
      diagnostics.push(diag('error', 'occurrence_role_required', 'Occurrence role is required', { scope: 'occurrence', id: occId, path: 'role' }, mode));
    }
  }

  for (const [secId, sec] of Object.entries(registry.sections || {})) {
    if (!isObject(sec)) {
      diagnostics.push(diag('error', 'section_mapping_required', 'Section must be a mapping/object', { scope: 'section', id: secId }, mode));
      continue;
    }
    const occs = sec.occurrences;
    if (!Array.isArray(occs) || occs.length === 0) {
      diagnostics.push(diag('error', 'section_occurrences_required', 'Section occurrences must be a non-empty array', { scope: 'section', id: secId, path: 'occurrences' }, mode));
      continue;
    }
    for (const occRef of occs) {
      if (typeof occRef !== 'string') {
        diagnostics.push(diag('error', 'occurrence_ref_valid', 'Occurrence reference must be a string', { scope: 'section', id: secId, path: 'occurrences' }, mode));
        continue;
      }
      const ref = parseRef(occRef, docId);
      if (ref.kind === 'local' && !idSets.occurrences.has(ref.id)) {
        diagnostics.push(diag('error', 'occurrence_ref_valid', 'Occurrence reference not found', { scope: 'section', id: secId, path: 'occurrences' }, mode));
      }
    }
  }

  for (const [relId, rel] of Object.entries(registry.relations || {})) {
    if (!isObject(rel)) {
      diagnostics.push(diag('error', 'relation_mapping_required', 'Relation must be a mapping/object', { scope: 'relation', id: relId }, mode));
      continue;
    }
    for (const path of ['from', 'to']) {
      const value = rel[path];
      if (typeof value !== 'string' || value.length === 0) {
        diagnostics.push(diag('error', 'relation_ref_required', `Relation ${path} is required`, { scope: 'relation', id: relId, path }, mode));
        continue;
      }
      const ref = parseRef(value, docId);
      if (ref.kind !== 'local') continue;
      const found = idSets.entities.has(ref.id) || idSets.sections.has(ref.id);
      if (!found) {
        diagnostics.push(diag('error', 'relation_ref_valid', `Relation ${path} reference not found`, { scope: 'relation', id: relId, path }, mode));
      }
    }
  }

  if (idSets.entities.size) {
    const referencedEntities = new Set();
    for (const occ of Object.values(registry.occurrences || {})) {
      if (typeof occ.entity === 'string') {
        const ref = parseRef(occ.entity, docId);
        if (ref.kind === 'local') referencedEntities.add(ref.id);
      }
    }
    for (const id of idSets.entities) {
      if (!referencedEntities.has(id)) {
        diagnostics.push(diag('warning', 'entity_unreferenced', 'Entity not referenced', { scope: 'entity', id }, mode));
      }
    }
  }

  if (idSets.occurrences.size) {
    const referencedOcc = new Set();
    for (const sec of Object.values(registry.sections || {})) {
      const occs = sec && Array.isArray(sec.occurrences) ? sec.occurrences : [];
      for (const occRef of occs) {
        if (typeof occRef !== 'string') continue;
        const ref = parseRef(occRef, docId);
        if (ref.kind === 'local') referencedOcc.add(ref.id);
      }
    }
    for (const id of idSets.occurrences) {
      if (!referencedOcc.has(id)) {
        diagnostics.push(diag('warning', 'occurrence_unused', 'Occurrence not used in any section', { scope: 'occurrence', id }, mode));
      }
    }
  }

  const textMap = new Map();
  for (const occ of Object.values(doc.occurrenceBlocks || [])) {
    if (!occ.occurrence_id) continue;
    const key = stableStringify(occ);
    if (textMap.has(key)) {
      diagnostics.push(diag('warning', 'same_definition_candidate', 'Occurrence definition identical to another', { scope: 'occurrence', id: occ.occurrence_id }, mode));
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
};
