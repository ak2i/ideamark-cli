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
  };
}

function parseRef(ref, docId) {
  if (typeof ref !== 'string') return { kind: 'unknown' };
  if (ref.startsWith('ideamark://docs/')) {
    const m = ref.match(/^ideamark:\/\/docs\/([^#]+)#\/(entities|occurrences|sections)\/([^#]+)$/);
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
  const mode = options.mode || 'working';
  const strict = mode === 'strict';
  const diagnostics = [];
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
          diagnostics.push(
            diag('error', 'header_required', `Missing header field: ${key}`, { scope: 'header', path: key }, mode)
          );
        }
      }
    }
  }

  // Section anchorage required
  for (const [secId, sec] of Object.entries(doc.registry.sections || {})) {
    if (sec.anchorage === undefined) {
      diagnostics.push(
        diag('error', 'anchorage_required', 'Section anchorage required', { scope: 'section', id: secId }, mode)
      );
      continue;
    }
    if (!isObject(sec.anchorage)) {
      diagnostics.push(
        diag('error', 'anchorage_mapping', 'Anchorage must be a mapping/object', { scope: 'section', id: secId, path: 'anchorage' }, mode)
      );
    }
  }

  // Evidence Block must be a mapping/object
  for (const seg of doc.segments || []) {
    if (!isEvidenceBlock(seg)) continue;
    if (!seg.parsed || !seg.parsed.ok) continue;
    if (!isObject(seg.parsed.value)) {
      diagnostics.push(
        diag('error', 'evidence_mapping', 'Evidence Block must be a mapping/object', { scope: 'evidence' }, mode)
      );
    }
  }

  // Occurrence existence required (strict)
  if (strict) {
    if (!doc.registry.occurrences || Object.keys(doc.registry.occurrences).length === 0) {
      diagnostics.push(
        diag('error', 'occurrence_required', 'At least one occurrence required', { scope: 'occurrence' }, mode)
      );
    }
  }

  // ID uniqueness
  const idSets = collectIds(doc.registry);
  const seen = new Set();
  for (const [kind, set] of Object.entries(idSets)) {
    for (const id of set) {
      const key = `${kind}:${id}`;
      if (seen.has(key)) {
        diagnostics.push(
          diag('error', 'id_unique_within_doc', `Duplicate ${kind} id: ${id}`, { scope: kind, id }, mode)
        );
      }
      seen.add(key);
    }
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

  // References
  const docId = doc.header && doc.header.doc_id;
  for (const [occId, occ] of Object.entries(doc.registry.occurrences || {})) {
    if (typeof occ.entity === 'string') {
      const ref = parseRef(occ.entity, docId);
      if (ref.kind === 'local' && !idSets.entities.has(ref.id) && !occ.inline) {
        diagnostics.push(
          diag('error', 'entity_ref_valid', 'Entity reference not found', { scope: 'occurrence', id: occId, path: 'entity' }, mode)
        );
      }
    }
    if (typeof occ.target === 'string') {
      const ref = parseRef(occ.target, docId);
      if (ref.kind === 'local' && !idSets.entities.has(ref.id)) {
        diagnostics.push(
          diag('error', 'entity_ref_valid', 'Target entity reference not found', { scope: 'occurrence', id: occId, path: 'target' }, mode)
        );
      }
    }
    if (Array.isArray(occ.supporting_evidence)) {
      for (const ev of occ.supporting_evidence) {
        const ref = parseRef(ev, docId);
        if (ref.kind === 'local' && !idSets.entities.has(ref.id) && !idSets.occurrences.has(ref.id)) {
          diagnostics.push(
            diag('error', 'ref_valid', 'Supporting evidence reference not found', { scope: 'occurrence', id: occId, path: 'supporting_evidence' }, mode)
          );
        }
      }
    }
  }

  for (const [secId, sec] of Object.entries(doc.registry.sections || {})) {
    const occs = sec.occurrences || [];
    if (Array.isArray(occs)) {
      for (const occRef of occs) {
        if (typeof occRef === 'string') {
          const ref = parseRef(occRef, docId);
          if (ref.kind === 'local' && !idSets.occurrences.has(ref.id)) {
            diagnostics.push(
              diag('error', 'occurrence_ref_valid', 'Occurrence reference not found', { scope: 'section', id: secId, path: 'occurrences' }, mode)
            );
          }
        }
      }
    }
  }

  const struct = doc.registry.structure || {};
  if (Array.isArray(struct.sections)) {
    for (const secRef of struct.sections) {
      if (typeof secRef === 'string') {
        const ref = parseRef(secRef, docId);
        if (ref.kind === 'local' && !idSets.sections.has(ref.id)) {
          diagnostics.push(
            diag('error', 'section_ref_valid', 'Structure section reference not found', { scope: 'structure', path: 'sections' }, mode)
          );
        }
      }
    }
  }

  // Unused warnings
  if (idSets.entities.size) {
    const referencedEntities = new Set();
    for (const occ of Object.values(doc.registry.occurrences || {})) {
      if (typeof occ.entity === 'string') {
        const ref = parseRef(occ.entity, docId);
        if (ref.kind === 'local') referencedEntities.add(ref.id);
      }
      if (typeof occ.target === 'string') {
        const ref = parseRef(occ.target, docId);
        if (ref.kind === 'local') referencedEntities.add(ref.id);
      }
    }
    for (const id of idSets.entities) {
      if (!referencedEntities.has(id)) {
        diagnostics.push(
          diag('warning', 'entity_unreferenced', 'Entity not referenced', { scope: 'entity', id }, mode)
        );
      }
    }
  }

  if (idSets.occurrences.size) {
    const referencedOcc = new Set();
    for (const sec of Object.values(doc.registry.sections || {})) {
      const occs = sec.occurrences || [];
      if (Array.isArray(occs)) {
        for (const occRef of occs) {
          if (typeof occRef === 'string') {
            const ref = parseRef(occRef, docId);
            if (ref.kind === 'local') referencedOcc.add(ref.id);
          }
        }
      }
    }
    for (const id of idSets.occurrences) {
      if (!referencedOcc.has(id)) {
        diagnostics.push(
          diag('warning', 'occurrence_unused', 'Occurrence not used in any section', { scope: 'occurrence', id }, mode)
        );
      }
    }
  }

  // Same-definition heuristic (simple): identical occurrence text blocks
  const textMap = new Map();
  for (const occ of Object.values(doc.occurrenceBlocks || [])) {
    if (!occ.occurrence_id) continue;
    const key = stableStringify(occ);
    if (textMap.has(key)) {
      diagnostics.push(
        diag('warning', 'same_definition_candidate', 'Occurrence definition identical to another', { scope: 'occurrence', id: occ.occurrence_id }, mode)
      );
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
