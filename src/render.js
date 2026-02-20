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
  if (Array.isArray(registry.relations)) out.relations = registry.relations;
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
  };
  const docId = header.doc_id;

  let headerObj = header;
  let registryObj = registry;

  if (canonical) {
    headerObj = normalizeRefsInObject(headerObj, docId, idSets);
    registryObj = normalizeRefsInObject(registryObj, docId, idSets);
  }

  const headerYaml = stringifyYaml(headerObj).trimEnd();
  const lines = [`---`, headerYaml, `---`, ``];

  const structure = (registryObj.structure && registryObj.structure.sections) || [];
  const seen = new Set();
  const sectionOrder = [];
  for (const sec of structure) {
    const id = typeof sec === 'string' ? sec : null;
    if (id && registryObj.sections && registryObj.sections[id]) {
      sectionOrder.push(id);
      seen.add(id);
    }
  }
  for (const id of Object.keys(registryObj.sections || {})) {
    if (!seen.has(id)) sectionOrder.push(id);
  }

  for (const secId of sectionOrder) {
    const sec = registryObj.sections[secId] || {};
    const secYaml = stringifyYaml({ section_id: secId, ...sec }).trimEnd();
    lines.push(`## ${secId}`);
    lines.push('```yaml');
    lines.push(secYaml);
    lines.push('```');
    lines.push('');
  }

  const registryYaml = stringifyYaml(registryObj).trimEnd();
  lines.push('## Registry');
  lines.push('```yaml');
  lines.push(registryYaml);
  lines.push('```');
  lines.push('');

  return lines.join('\n');
}

module.exports = { renderDocument };
