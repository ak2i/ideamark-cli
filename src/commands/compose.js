const { parseIdeaMark } = require('../parser/ideamark');
const { parseSelector, matchesSelector } = require('../selector/selector');
const { ensureTrailingNewline } = require('./utils');

function escapeYamlString(value) {
  return String(value).replace(/"/g, '\\"');
}

function renderProvenanceBlock(provenance) {
  const lines = ['```yaml', 'ideamark_provenance:', '  sources:'];
  provenance.forEach((item) => {
    lines.push(`    - path: "${escapeYamlString(item.path)}"`);
    lines.push(`      doc_id: "${escapeYamlString(item.doc_id || '')}"`);
    lines.push(`      section_id: "${escapeYamlString(item.section_id)}"`);
    lines.push('      range:');
    lines.push(`        start_line: ${item.range.start_line}`);
    lines.push(`        end_line: ${item.range.end_line}`);
  });
  lines.push('```');
  return lines.join('\n');
}

function computeBodyEnd(sectionIndex, sections, registries, lines) {
  const current = sections[sectionIndex];
  const next = sections[sectionIndex + 1];
  let endLine = next ? next.location.start_line - 1 : lines.length;

  const registryStarts = registries
    .map((r) => r.location.start_line)
    .filter((line) => line > current.location.end_line && line <= endLine)
    .sort((a, b) => a - b);

  if (registryStarts.length > 0) {
    endLine = registryStarts[0] - 1;
  }

  if (next) {
    let idx = next.location.start_line - 2;
    while (idx >= 0 && lines[idx].trim() === '') {
      idx -= 1;
    }
    if (idx >= 0) {
      const headingLine = lines[idx];
      if (/^\s{0,3}#{1,6}\s+/.test(headingLine)) {
        endLine = Math.min(endLine, idx);
      }
    }
  }

  return endLine;
}

function buildSectionMarkdown(lines, section, bodyEndLine) {
  const startLine = section.location.start_line;
  const endLine = bodyEndLine;
  if (startLine > endLine) return '';
  let slice = lines.slice(startLine - 1, endLine);
  let idx = slice.length - 1;
  while (idx >= 0 && slice[idx].trim() === '') idx -= 1;
  if (idx >= 0 && /^\s{0,3}#{1,6}\s+/.test(slice[idx])) {
    slice = slice.slice(0, idx);
  }
  return slice.join('\n');
}

function parseDoc(text, path) {
  const parsed = parseIdeaMark(text);
  const errors = parsed.errors || [];
  if (errors.length > 0) {
    return { errors };
  }

  const lines = text.split(/\r?\n/);
  const sections = parsed.sections;
  const registries = parsed.registries;

  const registry = registries.length > 0 ? registries[registries.length - 1].data : null;

  const doc = {
    doc_id: parsed.header ? parsed.header.data.doc_id : null,
    path
  };

  const enriched = sections.map((section, index) => {
    const bodyEnd = computeBodyEnd(index, sections, registries, lines);
    const markdown = buildSectionMarkdown(lines, section, bodyEnd);
    return {
      section_id: section.data.section_id,
      anchorage: section.data.anchorage || null,
      yaml: section.data,
      range: { start_line: section.location.start_line, end_line: bodyEnd },
      markdown,
      order: index,
      _registry: registry
    };
  });

  return { doc, sections: enriched, registry };
}

function orderSections(sections, sortMode) {
  if (sections.length === 0) return sections;
  const registry = sections[0]._registry;
  const structure = registry && registry.structure && Array.isArray(registry.structure.sections)
    ? registry.structure.sections
    : null;

  if (sortMode === 'structure' || sortMode === 'default') {
    if (structure && structure.length > 0) {
      const indexMap = new Map();
      structure.forEach((id, idx) => indexMap.set(id, idx));
      return [...sections].sort((a, b) => {
        const ai = indexMap.has(a.section_id) ? indexMap.get(a.section_id) : Number.MAX_SAFE_INTEGER;
        const bi = indexMap.has(b.section_id) ? indexMap.get(b.section_id) : Number.MAX_SAFE_INTEGER;
        if (ai !== bi) return ai - bi;
        return a.order - b.order;
      });
    }
    return [...sections].sort((a, b) => a.order - b.order);
  }

  if (sortMode === 'file') {
    return [...sections].sort((a, b) => a.order - b.order);
  }

  return [...sections];
}

function sortByTimestamp(sections) {
  return [...sections].sort((a, b) => {
    const at = extractTimestamp(a);
    const bt = extractTimestamp(b);
    if (at && bt) return at - bt;
    if (at && !bt) return -1;
    if (!at && bt) return 1;
    return a._globalOrder - b._globalOrder;
  });
}

function extractTimestamp(section) {
  const from = section.yaml?.timestamp_range?.from
    || section._registry?.sections?.[section.section_id]?.timestamp_range?.from;
  if (!from) return null;
  const parsed = Date.parse(from);
  if (!Number.isFinite(parsed)) return null;
  return parsed;
}

function composeDocuments(inputs, options) {
  const selector = options.selector ? parseSelector(options.selector) : null;
  const limit = options.limit || (selector ? selector.limit : null);

  let allSections = [];
  let provenance = [];

  inputs.forEach((input, fileIndex) => {
    const parsed = parseDoc(input.text, input.path);
    if (parsed.errors) {
      throw new Error(parsed.errors[0].message || 'Parse error');
    }

    const doc = parsed.doc;
    const ordered = orderSections(parsed.sections, options.sort || 'default');
    let filtered = ordered;

    if (selector) {
      filtered = ordered.filter((section) => matchesSelector(section, doc, selector));
    }

    filtered.forEach((section, idx) => {
      section._globalOrder = allSections.length + idx + fileIndex * 10000;
    });

    filtered.forEach((section) => {
      allSections.push({ ...section, _doc: doc });
    });
  });

  if (options.sort === 'timestamp') {
    allSections = sortByTimestamp(allSections);
  }

  if (limit && allSections.length > limit) {
    allSections = allSections.slice(0, limit);
  }

  const markdownParts = allSections.map((section) => ensureTrailingNewline(section.markdown));
  let composed = markdownParts.join('\n');

  if (options.withProvenance) {
    provenance = allSections.map((section) => ({
      path: section._doc.path || '',
      doc_id: section._doc.doc_id || '',
      section_id: section.section_id,
      range: section.range
    }));

    const block = renderProvenanceBlock(provenance);
    if (options.provenanceStyle === 'footer') {
      composed = ensureTrailingNewline(composed) + '\n' + block + '\n';
    } else if (options.provenanceStyle === 'both') {
      composed = block + '\n\n' + ensureTrailingNewline(composed) + '\n' + block + '\n';
    } else {
      composed = block + '\n\n' + ensureTrailingNewline(composed);
    }
  }

  return { composed: ensureTrailingNewline(composed), provenance };
}

module.exports = { composeDocuments };
