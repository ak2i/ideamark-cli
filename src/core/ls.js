function sortById(list) {
  return list.sort((a, b) => String(a.id || '').localeCompare(String(b.id || '')));
}

function listSources(data) {
  return sortById((data.sources || []).filter((x) => x && typeof x === 'object' && !Array.isArray(x)).map((src) => ({
    id: src.id,
    type: src.type,
    title: src.title,
    uri: src.uri,
  })));
}

function sectionForOccurrences(sections) {
  const map = {};
  for (const sec of sections || []) {
    if (!sec || typeof sec !== 'object' || !Array.isArray(sec.occurrences)) continue;
    for (const occ of sec.occurrences) {
      if (map[occ] === undefined) map[occ] = sec.id;
    }
  }
  return map;
}

function listSections(data) {
  return sortById((data.sections || []).filter((x) => x && typeof x === 'object' && !Array.isArray(x)).map((sec) => ({
    id: sec.id,
    title: sec.title,
    occ_count: Array.isArray(sec.occurrences) ? sec.occurrences.length : 0,
    status: sec.status,
  })));
}

function listOccurrences(data) {
  const occToSection = sectionForOccurrences(data.sections);
  return sortById((data.occurrences || []).filter((x) => x && typeof x === 'object' && !Array.isArray(x)).map((occ) => ({
    id: occ.id,
    role: occ.role,
    entity: occ.entity,
    section: occToSection[occ.id],
    status: occ.status,
  })));
}

function listEntities(data) {
  return sortById((data.entities || []).filter((x) => x && typeof x === 'object' && !Array.isArray(x)).map((ent) => ({
    id: ent.id,
    kind: ent.kind,
    ref: ent.ref,
    status: ent.status,
  })));
}

function collectVocab(data) {
  const vocab = {
    'meta.status': new Set(),
    'source.type': new Set(),
    'section.status': new Set(),
    'occurrence.role': new Set(),
    'occurrence.status': new Set(),
    'entity.kind': new Set(),
    'entity.status': new Set(),
    'anchor.type': new Set(),
    'anchor.precision': new Set(),
  };
  if (data.meta && data.meta.status) vocab['meta.status'].add(data.meta.status);
  for (const src of data.sources || []) if (src && src.type) vocab['source.type'].add(src.type);
  for (const sec of data.sections || []) if (sec && sec.status) vocab['section.status'].add(sec.status);
  for (const occ of data.occurrences || []) {
    if (!occ || typeof occ !== 'object') continue;
    if (occ.role) vocab['occurrence.role'].add(occ.role);
    if (occ.status) vocab['occurrence.status'].add(occ.status);
  }
  for (const ent of data.entities || []) {
    if (!ent || typeof ent !== 'object') continue;
    if (ent.kind) vocab['entity.kind'].add(ent.kind);
    if (ent.status) vocab['entity.status'].add(ent.status);
  }
  for (const ns of ['sources', 'sections', 'occurrences', 'entities']) {
    for (const obj of data[ns] || []) {
      for (const a of (obj && obj.anchors) || []) {
        if (a && a.type) vocab['anchor.type'].add(a.type);
        if (a && a.precision) vocab['anchor.precision'].add(a.precision);
      }
    }
  }
  return Object.fromEntries(Object.entries(vocab).map(([k, v]) => [k, Array.from(v).sort()]));
}

function toMarkdown(payload) {
  const lines = [];
  for (const key of ['sources', 'sections', 'occurrences', 'entities']) {
    if (!payload[key]) continue;
    lines.push(`# ${key}`);
    for (const item of payload[key]) lines.push(`- ${item.id}`);
    lines.push('');
  }
  if (payload.vocab) {
    lines.push('# vocab');
    for (const [k, values] of Object.entries(payload.vocab)) lines.push(`${k}: ${values.join(', ')}`);
    lines.push('');
  }
  return lines.join('\n');
}

function listDocument(data, options) {
  const payload = {};
  if (options.include.sources) payload.sources = listSources(data);
  if (options.include.sections) payload.sections = listSections(data);
  if (options.include.occurrences) payload.occurrences = listOccurrences(data);
  if (options.include.entities) payload.entities = listEntities(data);
  if (options.include.vocab) payload.vocab = collectVocab(data);
  return { ok: true, output: options.format === 'md' ? toMarkdown(payload) : JSON.stringify(payload) };
}

module.exports = { listDocument };
