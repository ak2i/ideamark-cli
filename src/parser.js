const YAML = require('yaml');
const { sortKeys } = require('./utils');

function parseFrontmatter(text) {
  const lines = text.split(/\r?\n/);
  if (lines[0] !== '---') return null;
  let end = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === '---') {
      end = i;
      break;
    }
  }
  if (end === -1) return null;
  const content = lines.slice(1, end).join('\n');
  return { content, startLine: 0, endLine: end };
}

function tokenize(text) {
  const lines = text.split(/\r?\n/);
  const segments = [];
  let i = 0;
  let fence = null;

  const front = parseFrontmatter(text);
  if (front) {
    const pre = lines.slice(0, front.endLine + 1).join('\n');
    segments.push({ type: 'yaml', subtype: 'frontmatter', raw: pre, content: front.content });
    i = front.endLine + 1;
  }

  let buffer = [];
  for (; i < lines.length; i++) {
    const line = lines[i];
    const yamlFenceMatch = line.match(/^\s*```yaml(\s+.*)?\s*$/);
    if (!fence && yamlFenceMatch) {
      const info = line.trim().slice('```'.length).trim();
      if (buffer.length) {
        segments.push({ type: 'text', value: buffer.join('\n') + '\n' });
        buffer = [];
      }
      const yamlLines = [];
      i++;
      while (i < lines.length && lines[i].trim() !== '```') {
        yamlLines.push(lines[i]);
        i++;
      }
      const raw = ['```' + info, ...yamlLines, '```'].join('\n');
      segments.push({ type: 'yaml', subtype: 'fenced', info, raw, content: yamlLines.join('\n') });
      continue;
    }
    const fenceMatch = line.match(/^\s*(`{3,}|~{3,})(.*)$/);
    if (fenceMatch) {
      const marker = fenceMatch[1];
      const info = fenceMatch[2].trim();
      if (!fence) {
        fence = { char: marker[0], len: marker.length };
      } else if (marker[0] === fence.char && marker.length >= fence.len && info === '') {
        fence = null;
      }
    }
    buffer.push(line);
  }
  if (buffer.length) segments.push({ type: 'text', value: buffer.join('\n') });
  return segments;
}

function parseYamlBlock(block) {
  try {
    const obj = YAML.parse(block.content);
    return { ok: true, value: obj };
  } catch (err) {
    return { ok: false, error: err };
  }
}

function classifyBlock(obj, isFrontmatter) {
  if (!obj || typeof obj !== 'object') return 'other';
  if (isFrontmatter) return 'header';
  const hasHeaderKeys = obj.ideamark_version !== undefined && obj.doc_id && obj.doc_type;
  if (hasHeaderKeys) return 'header';
  if (obj.section_id) return 'section';
  if (obj.occurrence_id) return 'occurrence';
  if (
    obj.entities ||
    obj.occurrences ||
    obj.sections ||
    obj.structure ||
    obj.relations ||
    obj.perspectives
  ) {
    return 'registry';
  }
  return 'other';
}

function isPlainObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v);
}

// Core Constraints §7.13: perspectives / perspective_scope / anchorage.view /
// anchorage.phase accept a single value but are normalized to arrays.
function normalizeMultiValue(v) {
  if (v === undefined || v === null) return v;
  if (Array.isArray(v)) return v;
  if (typeof v === 'object') return v;
  return [v];
}

function normalizeRegistry(registry) {
  for (const sec of Object.values(registry.sections || {})) {
    if (!isPlainObject(sec)) continue;
    if (sec.perspectives !== undefined) sec.perspectives = normalizeMultiValue(sec.perspectives);
    if (isPlainObject(sec.anchorage)) {
      if (sec.anchorage.view !== undefined) sec.anchorage.view = normalizeMultiValue(sec.anchorage.view);
      if (sec.anchorage.phase !== undefined) sec.anchorage.phase = normalizeMultiValue(sec.anchorage.phase);
    }
  }
  for (const ent of Object.values(registry.entities || {})) {
    if (!isPlainObject(ent)) continue;
    if (ent.perspective_scope !== undefined) ent.perspective_scope = normalizeMultiValue(ent.perspective_scope);
  }
  return registry;
}

function parseDocument(text) {
  const segments = tokenize(text);
  const yamlBlocks = [];
  let header = null;
  let headerCount = 0;
  const registryBlocks = [];
  const sectionBlocks = [];
  const occurrenceBlocks = [];
  const parseErrors = [];

  segments.forEach((seg, idx) => {
    if (seg.type !== 'yaml') return;
    const parsed = parseYamlBlock(seg);
    const entry = { index: idx, ...seg, parsed };
    seg.parsed = parsed;
    yamlBlocks.push(entry);
    if (!parsed.ok) {
      parseErrors.push({ index: idx, error: parsed.error });
      return;
    }
    const obj = parsed.value;
    const kind = classifyBlock(obj, seg.subtype === 'frontmatter');
    entry.kind = kind;
    seg.kind = kind;
    if (kind === 'header') {
      headerCount += 1;
      if (!header) header = obj;
    } else if (kind === 'registry') {
      registryBlocks.push(obj);
    } else if (kind === 'section') {
      sectionBlocks.push(obj);
    } else if (kind === 'occurrence') {
      occurrenceBlocks.push(obj);
    }
  });

  const registry = {
    entities: {},
    occurrences: {},
    sections: {},
    relations: {},
    perspectives: {},
    structure: { sections: [] },
  };
  const duplicates = {
    entities: new Set(),
    occurrences: new Set(),
    sections: new Set(),
    relations: new Set(),
    perspectives: new Set(),
  };
  const seenSectionBlocks = new Set();
  const seenOccurrenceBlocks = new Set();

  // Core Constraints §7.5: identifiers are unique within their namespace.
  // Merge every registry block; a key already present counts as a duplicate.
  const mergeNamespace = (key, source) => {
    if (!isPlainObject(source)) return;
    for (const [id, value] of Object.entries(source)) {
      if (Object.prototype.hasOwnProperty.call(registry[key], id)) duplicates[key].add(id);
      registry[key][id] = value;
    }
  };

  for (const r of registryBlocks) {
    mergeNamespace('entities', r.entities);
    mergeNamespace('occurrences', r.occurrences);
    mergeNamespace('sections', r.sections);
    if (r.relations !== undefined) {
      if (isPlainObject(r.relations) && isPlainObject(registry.relations)) {
        mergeNamespace('relations', r.relations);
      } else {
        // Non-mapping shape is kept as-is; validate reports it.
        registry.relations = r.relations;
      }
    }
    if (r.perspectives !== undefined) {
      if (isPlainObject(r.perspectives) && isPlainObject(registry.perspectives)) {
        mergeNamespace('perspectives', r.perspectives);
      } else {
        registry.perspectives = r.perspectives;
      }
    }
    if (r.structure) registry.structure = r.structure;
  }

  // Merge section blocks into registry
  for (const sec of sectionBlocks) {
    if (!sec.section_id) continue;
    if (seenSectionBlocks.has(sec.section_id)) duplicates.sections.add(sec.section_id);
    seenSectionBlocks.add(sec.section_id);
    if (!registry.sections[sec.section_id]) registry.sections[sec.section_id] = {};
    const { section_id, ...rest } = sec;
    registry.sections[section_id] = { ...registry.sections[section_id], ...rest };
  }

  // Merge occurrence blocks into registry
  for (const occ of occurrenceBlocks) {
    if (!occ.occurrence_id) continue;
    if (seenOccurrenceBlocks.has(occ.occurrence_id)) duplicates.occurrences.add(occ.occurrence_id);
    seenOccurrenceBlocks.add(occ.occurrence_id);
    if (!registry.occurrences[occ.occurrence_id]) registry.occurrences[occ.occurrence_id] = {};
    registry.occurrences[occ.occurrence_id] = { ...registry.occurrences[occ.occurrence_id], ...occ };
  }

  normalizeRegistry(registry);

  return {
    text,
    segments,
    yamlBlocks,
    parseErrors,
    header,
    headerCount,
    registryBlocks,
    sectionBlocks,
    occurrenceBlocks,
    duplicates,
    registry,
  };
}

function stringifyYaml(obj) {
  return YAML.stringify(obj, {
    indent: 2,
    lineWidth: 0,
    sortMapEntries: (a, b) => String(a.key).localeCompare(String(b.key)),
  });
}

function normalizeYamlObject(obj) {
  return sortKeys(obj);
}

module.exports = {
  parseDocument,
  stringifyYaml,
  normalizeYamlObject,
  normalizeMultiValue,
};
