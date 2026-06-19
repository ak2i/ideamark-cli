const { stringifyYaml } = require('./parser');
const { sortKeys } = require('./utils');
const { normalizeRefsInObject } = require('./refs');

function sortRegistry(registry) {
  const out = { ...registry };
  const sortObj = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    const keys = Object.keys(obj).sort();
    const res = {};
    for (const k of keys) res[k] = obj[k];
    return res;
  };
  out.entities = sortObj(registry.entities || {});
  out.occurrences = sortObj(registry.occurrences || {});
  out.sections = sortObj(registry.sections || {});
  out.relations = sortObj(registry.relations || {});
  out.perspectives = sortObj(registry.perspectives || {});
  out.structure = registry.structure || { sections: [] };
  return out;
}

function renderDocument(model, options) {
  const canonical = !!options.canonical;
  const registry = sortRegistry(model.registry || {});
  const header = sortKeys(model.header || {});
  const idSets = {
    entities: new Set(Object.keys(registry.entities || {})),
    occurrences: new Set(Object.keys(registry.occurrences || {})),
    sections: new Set(Object.keys(registry.sections || {})),
    relations: new Set(Object.keys(registry.relations || {})),
    perspectives: new Set(Object.keys(registry.perspectives || {})),
  };
  const docId = header.doc_id;

  let headerObj = header;
  let registryObj = registry;

  if (canonical) {
    headerObj = normalizeRefsInObject(headerObj, docId, idSets);
    registryObj = normalizeRefsInObject(registryObj, docId, idSets);
  }

  return `${stringifyYaml({ ...headerObj, ...registryObj }).trimEnd()}\n`;
}

module.exports = { renderDocument };
