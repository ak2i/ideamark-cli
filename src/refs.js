const { parseRef } = require('./validate');

function canonicalUri(docId, type, id) {
  if (!docId) return id;
  return `ideamark://docs/${docId}#/${type}/${id}`;
}

function normalizeRefsInObject(obj, docId, idSets) {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj.map((v) => normalizeRefsInObject(v, docId, idSets));
  }
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (k === 'entity' || k === 'target') {
      out[k] = normalizeRefValue(v, docId, idSets.entities, 'entities');
      continue;
    }
    if (k === 'supporting_evidence') {
      if (Array.isArray(v)) {
        out[k] = v.map((x) => normalizeRefValue(x, docId, idSets.entities, 'entities'));
      } else {
        out[k] = v;
      }
      continue;
    }
    if (k === 'occurrences') {
      if (Array.isArray(v)) {
        out[k] = v.map((x) => normalizeRefValue(x, docId, idSets.occurrences, 'occurrences'));
      } else {
        out[k] = v;
      }
      continue;
    }
    if (k === 'sections') {
      if (Array.isArray(v)) {
        out[k] = v.map((x) => normalizeRefValue(x, docId, idSets.sections, 'sections'));
      } else {
        out[k] = v;
      }
      continue;
    }
    if (k === 'from' || k === 'to') {
      out[k] = normalizeRefValue(v, docId, idSets.entities, 'entities');
      continue;
    }
    out[k] = normalizeRefsInObject(v, docId, idSets);
  }
  return out;
}

function normalizeRefValue(value, docId, idSet, type) {
  if (typeof value !== 'string') return value;
  const ref = parseRef(value, docId);
  if (ref.kind === 'local') {
    const id = ref.id;
    if (idSet && idSet.has(id)) return canonicalUri(docId, type, id);
  }
  return value;
}

function renameRefsInObject(obj, renameMap) {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj.map((v) => renameRefsInObject(v, renameMap));
  }
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'string') {
      out[k] = renameRefValue(v, renameMap);
    } else {
      out[k] = renameRefsInObject(v, renameMap);
    }
  }
  return out;
}

function renameRefValue(value, renameMap) {
  if (typeof value !== 'string') return value;
  if (renameMap[value]) return renameMap[value];
  const m = value.match(/^ideamark:\/\/docs\/([^#]+)#\/(entities|occurrences|sections)\/([^#]+)$/);
  if (m) {
    const id = m[3];
    if (renameMap[id]) return value.replace(`/${id}`, `/${renameMap[id]}`);
  }
  const fq = value.match(/^([^#]+)#([^#]+)$/);
  if (fq) {
    const id = fq[2];
    if (renameMap[id]) return `${fq[1]}#${renameMap[id]}`;
  }
  return value;
}

module.exports = {
  canonicalUri,
  normalizeRefsInObject,
  renameRefsInObject,
  renameRefValue,
};
