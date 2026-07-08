// Internal indexing model for IdeaMark Core v1.2.0 documents (Part 4 §1.3–1.4).
// Arrays are the serialized shape; this module builds id indexes for
// validation and lookup. The index is never serialized (§1.3).

const REQUIRED_ARRAY_NAMESPACES = ['sources', 'sections', 'occurrences', 'entities'];
const REQUIRED_NAMESPACES = ['meta', ...REQUIRED_ARRAY_NAMESPACES];
const OPTIONAL_NAMESPACES = ['structure', 'relations', 'perspectives', 'provenance', 'skeletons', 'extensions'];

function isMapping(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

function isNonEmptyString(v) {
  return typeof v === 'string' && v.length > 0;
}

// Collects one required array namespace into { valid, entries, idSet, duplicates }.
// entries carry the raw object, its array index, and its id when usable.
function collectNamespace(data, ns) {
  const value = data[ns];
  const out = { present: value !== undefined, valid: Array.isArray(value), entries: [], idSet: new Set(), duplicates: [] };
  if (!out.valid) return out;
  value.forEach((obj, index) => {
    const entry = { obj, index, id: null, idValid: false, mapping: isMapping(obj) };
    if (entry.mapping && isNonEmptyString(obj.id)) {
      entry.id = obj.id;
      entry.idValid = true;
      if (out.idSet.has(obj.id)) out.duplicates.push(entry);
      else out.idSet.add(obj.id);
    }
    out.entries.push(entry);
  });
  return out;
}

function collectSkeletons(data) {
  const value = data.skeletons;
  const out = { present: value !== undefined, valid: Array.isArray(value), entries: [], idSet: new Set(), duplicates: [] };
  if (!out.valid) return out;
  value.forEach((obj, index) => {
    const entry = { obj, index, id: null, idValid: false, mapping: isMapping(obj), nodesById: new Set(), linksById: new Set(), duplicateNodes: [], duplicateLinks: [] };
    if (entry.mapping && isNonEmptyString(obj.id)) {
      entry.id = obj.id;
      entry.idValid = true;
      if (out.idSet.has(obj.id)) out.duplicates.push(entry);
      else out.idSet.add(obj.id);
    }
    if (entry.mapping && Array.isArray(obj.nodes)) {
      obj.nodes.forEach((node, nodeIndex) => {
        if (isMapping(node) && isNonEmptyString(node.id)) {
          if (entry.nodesById.has(node.id)) entry.duplicateNodes.push({ node, index: nodeIndex, id: node.id });
          else entry.nodesById.add(node.id);
        }
      });
    }
    if (entry.mapping && Array.isArray(obj.links)) {
      obj.links.forEach((link, linkIndex) => {
        if (isMapping(link) && isNonEmptyString(link.id)) {
          if (entry.linksById.has(link.id)) entry.duplicateLinks.push({ link, index: linkIndex, id: link.id });
          else entry.linksById.add(link.id);
        }
      });
    }
    out.entries.push(entry);
  });
  return out;
}

function buildModel(data) {
  const model = { namespaces: {}, skeletons: collectSkeletons(data) };
  for (const ns of REQUIRED_ARRAY_NAMESPACES) {
    model.namespaces[ns] = collectNamespace(data, ns);
  }
  return model;
}

module.exports = {
  REQUIRED_ARRAY_NAMESPACES,
  REQUIRED_NAMESPACES,
  OPTIONAL_NAMESPACES,
  isMapping,
  isNonEmptyString,
  collectSkeletons,
  buildModel,
};
