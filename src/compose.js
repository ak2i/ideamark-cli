const { validateDocument } = require('./validate');
const { renderDocument } = require('./render');
const { uuidV4, nowDate, deepClone, stableStringify } = require('./utils');
const { renameRefsInObject } = require('./refs');
const { stringifyYaml } = require('./parser');
const { sortKeys } = require('./utils');
const YAML = require('yaml');

function extractSectionNarratives(text) {
  const lines = String(text || '').split(/\r?\n/);
  const sections = new Map();
  const headingRe = /^##\s+(.+?)\s*$/;
  const fenceStartRe = /^\s*```yaml(?:\s+.*)?\s*$/;

  const headingIndexes = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(headingRe);
    if (m) {
      headingIndexes.push({ index: i, title: m[1] });
    }
  }

  for (let k = 0; k < headingIndexes.length; k++) {
    const { index, title } = headingIndexes[k];
    if (title === 'Registry') continue;
    const end = k + 1 < headingIndexes.length ? headingIndexes[k + 1].index : lines.length;
    const chunk = lines.slice(index, end);

    // find first yaml fenced block (section block)
    let fs = -1;
    let fe = -1;
    for (let i = 0; i < chunk.length; i++) {
      if (fenceStartRe.test(chunk[i])) {
        fs = i;
        break;
      }
    }
    if (fs === -1) continue;
    for (let i = fs + 1; i < chunk.length; i++) {
      if (chunk[i].trim() === '```') {
        fe = i;
        break;
      }
    }
    if (fe === -1) continue;

    const yamlText = chunk.slice(fs + 1, fe).join('\n');
    let secId = null;
    try {
      const obj = YAML.parse(yamlText);
      if (obj && typeof obj === 'object' && typeof obj.section_id === 'string') {
        secId = obj.section_id;
      }
    } catch (_) {
      // ignore parse error and skip this section narrative extraction
    }
    if (!secId) continue;

    const tailLines = chunk.slice(fe + 1);
    const filteredTail = [];
    for (let i = 0; i < tailLines.length; i++) {
      const line = tailLines[i];
      if (/^\s*```yaml(?:\s+.*)?\s*$/.test(line)) {
        i++;
        while (i < tailLines.length && tailLines[i].trim() !== '```') i++;
        continue;
      }
      filteredTail.push(line);
    }

    const tail = filteredTail.join('\n').trim();
    if (!tail) continue;
    const current = sections.get(secId);
    sections.set(secId, current ? `${current}\n\n${tail}` : tail);
  }

  return sections;
}

function applyRenameMapToText(text, renameMap) {
  let out = String(text || '');
  for (const [from, to] of Object.entries(renameMap || {})) {
    if (!from || !to || from === to) continue;
    const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    out = out.replace(new RegExp(escaped, 'g'), to);
  }
  return out;
}

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
    doc.__renameMapForCompose = merged.renameMap || {};
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

  let output = renderDocument({ header, registry }, { canonical: false });

  if (options && options.preserveMarkdown) {
    const sectionNarrative = new Map();
    for (const doc of docs) {
      const rawMap = extractSectionNarratives(doc.text || '');
      for (const [secIdRaw, narrative] of rawMap.entries()) {
        const secId = (doc.__renameMapForCompose && doc.__renameMapForCompose[secIdRaw]) || secIdRaw;
        const normalized = applyRenameMapToText(narrative, doc.__renameMapForCompose).trim();
        if (!normalized) continue;
        const prev = sectionNarrative.get(secId);
        sectionNarrative.set(secId, prev ? `${prev}\n\n${normalized}` : normalized);
      }
    }

    const headerYaml = stringifyYaml(sortKeys(header)).trimEnd();
    const lines = ['---', headerYaml, '---', ''];
    const structure = (registry.structure && registry.structure.sections) || [];
    const seen = new Set();
    const sectionOrder = [];
    for (const sec of structure) {
      const id = typeof sec === 'string' ? sec : null;
      if (id && registry.sections && registry.sections[id]) {
        sectionOrder.push(id);
        seen.add(id);
      }
    }
    for (const id of Object.keys(registry.sections || {})) {
      if (!seen.has(id)) sectionOrder.push(id);
    }

    for (const secId of sectionOrder) {
      const sec = registry.sections[secId] || {};
      const secYaml = stringifyYaml({ section_id: secId, ...sec }).trimEnd();
      lines.push(`## ${secId}`);
      lines.push('```yaml');
      lines.push(secYaml);
      lines.push('```');
      lines.push('');
      const narrative = sectionNarrative.get(secId);
      if (narrative) {
        lines.push(narrative);
        lines.push('');
      }
    }

    const registryYaml = stringifyYaml(registry).trimEnd();
    lines.push('## Registry');
    lines.push('```yaml');
    lines.push(registryYaml);
    lines.push('```');
    lines.push('');

    output = lines.join('\n');
  }

  return { diagnostics, ok: true, output };
}

module.exports = { composeDocuments };
