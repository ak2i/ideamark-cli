const { validateDocument } = require('./validate');
const { renderDocument } = require('./render');
const { uuidV4, nowDate, deepClone, stableStringify } = require('./utils');
const { renameRefsInObject } = require('./refs');

function mergeRegistry(base, incoming, diagnostics, renamePolicy) {
  const out = deepClone(base);
  const renameMap = {};

  const detectConflict = (id, def, existing) => {
    if (!existing) return false;
    return stableStringify(existing) !== stableStringify(def);
  };

  for (const [id, def] of Object.entries(incoming.entities || {})) {
    if (detectConflict(id, def, out.entities[id])) renameMap[id] = renamePolicy(id);
  }
  for (const [id, def] of Object.entries(incoming.occurrences || {})) {
    if (detectConflict(id, def, out.occurrences[id])) renameMap[id] = renamePolicy(id);
  }
  for (const [id, def] of Object.entries(incoming.sections || {})) {
    if (detectConflict(id, def, out.sections[id])) renameMap[id] = renamePolicy(id);
  }

  let inc = deepClone(incoming);
  if (Object.keys(renameMap).length) {
    inc = renameRefsInObject(inc, renameMap);
    diagnostics.push({
      type: 'diagnostic',
      severity: 'warning',
      code: 'id_conflict_renamed',
      message: 'ID conflict renamed',
      location: { scope: 'compose' },
      mode: 'strict',
    });
  }

  const renameKeys = (obj) => {
    const res = {};
    for (const [id, def] of Object.entries(obj || {})) {
      if (renameMap[id]) {
        const updated = deepClone(def);
        updated.aliases = Array.isArray(updated.aliases) ? updated.aliases.concat([id]) : [id];
        res[renameMap[id]] = updated;
      } else {
        res[id] = def;
      }
    }
    return res;
  };

  inc.entities = renameKeys(inc.entities || {});
  inc.occurrences = renameKeys(inc.occurrences || {});
  inc.sections = renameKeys(inc.sections || {});

  for (const [id, def] of Object.entries(inc.entities || {})) {
    if (!out.entities[id]) out.entities[id] = def;
  }
  for (const [id, def] of Object.entries(inc.occurrences || {})) {
    if (!out.occurrences[id]) out.occurrences[id] = def;
  }
  for (const [id, def] of Object.entries(inc.sections || {})) {
    if (!out.sections[id]) out.sections[id] = def;
  }

  return { registry: out, renameMap };
}

function composeDocuments(docs, options) {
  const diagnostics = [];
  for (const doc of docs) {
    const validation = validateDocument(doc, { mode: 'strict' });
    diagnostics.push(...validation.diagnostics);
    if (!validation.ok) return { diagnostics, ok: false };
  }

  const renamePolicy = () => uuidV4();
  let registry = {
    entities: {},
    occurrences: {},
    sections: {},
    relations: [],
    structure: { sections: [] },
  };

  for (const doc of docs) {
    const merged = mergeRegistry(registry, doc.registry, diagnostics, renamePolicy);
    registry = merged.registry;
    const incomingOrderRaw = (doc.registry.structure && doc.registry.structure.sections) || [];
    const incomingOrder = incomingOrderRaw.map((sec) => merged.renameMap[sec] || sec);
    if (!registry.structure.sections.length) {
      registry.structure.sections = incomingOrder.slice();
    } else {
      for (const sec of incomingOrder) {
        if (!registry.structure.sections.includes(sec)) registry.structure.sections.push(sec);
      }
    }
  }

  const header = deepClone(docs[0].header || {});
  if (options.update && options.baseHeader) {
    Object.assign(header, options.baseHeader);
  }

  if (options.docId) header.doc_id = options.docId;
  else if (options.inherit === 'first' && docs[0].header && docs[0].header.doc_id) header.doc_id = docs[0].header.doc_id;
  else if (options.inherit === 'base' && options.baseHeader && options.baseHeader.doc_id) header.doc_id = options.baseHeader.doc_id;
  else header.doc_id = uuidV4();

  header.updated_at = nowDate();
  header.status = header.status || { state: 'in_progress' };
  header.refs = header.refs || {};
  header.refs.sources = header.refs.sources || [];
  for (const doc of docs) {
    if (doc.header && doc.header.doc_id) {
      header.refs.sources.push({
        id: `src-${doc.header.doc_id}`,
        uri: doc.header.doc_id,
        role: 'source',
      });
    }
  }

  const output = renderDocument({ header, registry }, { canonical: false });
  return { diagnostics, ok: true, output };
}

module.exports = { composeDocuments };
