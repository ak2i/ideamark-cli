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
    const isYamlFence = line.trim() === '```yaml';
    if (!fence && isYamlFence) {
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
      const raw = ['```yaml', ...yamlLines, '```'].join('\n');
      segments.push({ type: 'yaml', subtype: 'fenced', raw, content: yamlLines.join('\n') });
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
  if (obj.section_id && obj.anchorage) return 'section';
  if (obj.occurrence_id) return 'occurrence';
  if (obj.entities || obj.occurrences || obj.sections || obj.structure || obj.relations) return 'registry';
  return 'other';
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
    relations: [],
    structure: { sections: [] },
  };
  const duplicates = { entities: new Set(), occurrences: new Set(), sections: new Set() };
  const seenSectionBlocks = new Set();
  const seenOccurrenceBlocks = new Set();

  if (registryBlocks.length) {
    const r = registryBlocks[0];
    if (r.entities) registry.entities = r.entities;
    if (r.occurrences) registry.occurrences = r.occurrences;
    if (r.sections) registry.sections = r.sections;
    if (r.relations) registry.relations = r.relations;
    if (r.structure) registry.structure = r.structure;
  }

  // Merge section blocks into registry
  for (const sec of sectionBlocks) {
    if (!sec.section_id) continue;
    if (seenSectionBlocks.has(sec.section_id)) duplicates.sections.add(sec.section_id);
    seenSectionBlocks.add(sec.section_id);
    if (!registry.sections[sec.section_id]) registry.sections[sec.section_id] = {};
    const target = registry.sections[sec.section_id];
    if (sec.anchorage) target.anchorage = sec.anchorage;
    if (sec.occurrences) target.occurrences = sec.occurrences;
  }

  // Merge occurrence blocks into registry
  for (const occ of occurrenceBlocks) {
    if (!occ.occurrence_id) continue;
    if (seenOccurrenceBlocks.has(occ.occurrence_id)) duplicates.occurrences.add(occ.occurrence_id);
    seenOccurrenceBlocks.add(occ.occurrence_id);
    if (!registry.occurrences[occ.occurrence_id]) registry.occurrences[occ.occurrence_id] = {};
    registry.occurrences[occ.occurrence_id] = { ...registry.occurrences[occ.occurrence_id], ...occ };
  }

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
};
