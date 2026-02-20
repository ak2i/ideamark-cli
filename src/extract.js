const { renderDocument } = require('./render');
const { validateDocument } = require('./validate');
const { uuidV4, nowDate, deepClone } = require('./utils');

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
    }
  }

  const newRegistry = {
    entities: {},
    occurrences: {},
    sections: {},
    relations: [],
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

  newRegistry.structure.sections = Array.from(keepSections);

  const header = deepClone(doc.header || {});
  header.doc_id = uuidV4();
  header.updated_at = nowDate();
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
