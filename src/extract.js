const { renderDocument } = require('./render');
const { validateDocument } = require('./validate');
const { uuidV4, nowTimestamp, deepClone } = require('./utils');
const { parseRef } = require('./validate');

function orderedSectionIds(registry) {
  const order = Array.isArray(registry.structure && registry.structure.sections)
    ? registry.structure.sections.filter((x) => typeof x === 'string')
    : [];
  if (order.length) return order;
  return Object.keys(registry.sections || {});
}

function extractDocument(doc, options) {
  const diagnostics = [];
  const mode = 'strict';
  const validation = validateDocument(doc, { mode });
  diagnostics.push(...validation.diagnostics);
  if (!validation.ok) return { diagnostics, ok: false };

  const registry = deepClone(doc.registry);
  const targetSection = options.sectionId || null;
  const targetOcc = options.occurrenceId || null;

  const keepSections = new Set();
  const keepOcc = new Set();
  const keepEnt = new Set();

  if (targetSection) {
    keepSections.add(targetSection);
    const sec = registry.sections[targetSection] || {};
    const occs = sec.occurrences || [];
    for (const occId of occs) {
      if (typeof occId === 'string') keepOcc.add(occId);
    }
  }
  if (targetOcc) {
    keepOcc.add(targetOcc);
    for (const [secId, sec] of Object.entries(registry.sections || {})) {
      const occs = sec.occurrences || [];
      if (Array.isArray(occs) && occs.includes(targetOcc)) keepSections.add(secId);
    }
  }

  // Expand closure
  let changed = true;
  while (changed) {
    changed = false;
    for (const occId of Array.from(keepOcc)) {
      const occ = registry.occurrences[occId];
      if (!occ) continue;
      if (typeof occ.entity === 'string' && !keepEnt.has(occ.entity)) {
        keepEnt.add(occ.entity);
        changed = true;
      }
      if (typeof occ.target === 'string' && !keepEnt.has(occ.target)) {
        keepEnt.add(occ.target);
        changed = true;
      }
      if (Array.isArray(occ.supporting_evidence)) {
        for (const ev of occ.supporting_evidence) {
          if (typeof ev === 'string' && registry.occurrences[ev] && !keepOcc.has(ev)) {
            keepOcc.add(ev);
            changed = true;
          }
          if (typeof ev === 'string' && registry.entities[ev] && !keepEnt.has(ev)) {
            keepEnt.add(ev);
            changed = true;
          }
        }
      }
      if (occ.derived_from) {
        const items = Array.isArray(occ.derived_from) ? occ.derived_from : [occ.derived_from];
        for (const item of items) {
          if (item && typeof item === 'object') {
            if (typeof item.entity === 'string' && registry.entities[item.entity] && !keepEnt.has(item.entity)) {
              keepEnt.add(item.entity);
              changed = true;
            }
            if (typeof item.occurrence === 'string' && registry.occurrences[item.occurrence] && !keepOcc.has(item.occurrence)) {
              keepOcc.add(item.occurrence);
              changed = true;
            }
          }
        }
      }
    }
  }

  const newRegistry = {
    entities: {},
    occurrences: {},
    sections: {},
    relations: {},
    perspectives: {},
    structure: { sections: [] },
  };

  for (const id of keepEnt) {
    if (registry.entities[id]) newRegistry.entities[id] = registry.entities[id];
  }
  for (const id of keepOcc) {
    if (registry.occurrences[id]) newRegistry.occurrences[id] = registry.occurrences[id];
  }
  for (const id of keepSections) {
    if (registry.sections[id]) newRegistry.sections[id] = registry.sections[id];
  }
  for (const [relId, rel] of Object.entries(registry.relations || {})) {
    const from = typeof rel.from === 'string' ? parseRef(rel.from, doc.header && doc.header.doc_id) : null;
    const to = typeof rel.to === 'string' ? parseRef(rel.to, doc.header && doc.header.doc_id) : null;
    const fromKept = from && from.kind === 'local' && (keepEnt.has(from.id) || keepSections.has(from.id));
    const toKept = to && to.kind === 'local' && (keepEnt.has(to.id) || keepSections.has(to.id));
    if (fromKept && toKept) newRegistry.relations[relId] = rel;
  }

  const usedPerspectiveIds = new Set();
  for (const id of keepEnt) {
    const entity = registry.entities[id];
    const scopes = entity && Array.isArray(entity.perspective_scope) ? entity.perspective_scope : [];
    for (const ref of scopes) {
      if (typeof ref === 'string' && registry.perspectives && registry.perspectives[ref]) {
        usedPerspectiveIds.add(ref);
      }
    }
  }
  for (const id of keepSections) {
    const section = registry.sections[id];
    const refs = section && Array.isArray(section.perspectives) ? section.perspectives : [];
    for (const ref of refs) {
      if (typeof ref === 'string' && registry.perspectives && registry.perspectives[ref]) {
        usedPerspectiveIds.add(ref);
      }
    }
  }
  for (const id of usedPerspectiveIds) {
    newRegistry.perspectives[id] = deepClone(registry.perspectives[id]);
  }

  newRegistry.structure.sections = orderedSectionIds(registry).filter((id) => keepSections.has(id));

  const header = deepClone(doc.header || {});
  header.doc_id = uuidV4();
  header.updated_at = nowTimestamp();
  header.status = header.status || { state: 'in_progress' };
  header.refs = header.refs || {};
  header.refs.sources = header.refs.sources || [];
  if (doc.header && doc.header.doc_id) {
    header.refs.sources.push({
      id: `src-${doc.header.doc_id}`,
      uri: doc.header.doc_id,
      role: 'source',
    });
  }

  const output = renderDocument({ header, registry: newRegistry }, { canonical: false });
  return { diagnostics, ok: true, output };
}

module.exports = { extractDocument };
