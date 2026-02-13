const { parseIdeaMark } = require('../parser/ideamark');
const { parseSelector, matchesSelector } = require('../selector/selector');

function buildSectionMarkdown(lines, section, bodyEndLine, options) {
  const includeYaml = options.includeYaml === 'section';
  const includeBody = options.includeBody !== false;
  const sectionStart = section.location.start_line;
  const sectionEnd = section.location.end_line;
  const bodyStart = sectionEnd + 1;

  let startLine = null;
  let endLine = null;

  if (includeYaml && includeBody) {
    startLine = sectionStart;
    endLine = bodyEndLine;
  } else if (includeYaml && !includeBody) {
    startLine = sectionStart;
    endLine = sectionEnd;
  } else if (!includeYaml && includeBody) {
    startLine = bodyStart;
    endLine = bodyEndLine;
  } else {
    return '';
  }

  if (startLine > endLine) return '';
  let slice = lines.slice(startLine - 1, endLine);
  let idx = slice.length - 1;
  while (idx >= 0 && slice[idx].trim() === '') idx -= 1;
  if (idx >= 0 && /^\s{0,3}#{1,6}\s+/.test(slice[idx])) {
    slice = slice.slice(0, idx);
  }
  return slice.join('\n');
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

function extractSectionsFromText(text, options) {
  const parsed = parseIdeaMark(text);
  const errors = parsed.errors || [];

  if (errors.length > 0) {
    return { errors };
  }

  const selector = options.selector ? parseSelector(options.selector) : null;
  const limit = options.limit || (selector ? selector.limit : null);

  const lines = text.split(/\r?\n/);
  const sections = parsed.sections;
  const registries = parsed.registries;

  const doc = {
    doc_id: parsed.header ? parsed.header.data.doc_id : null,
    path: options.path || null,
    header: parsed.header ? parsed.header.data : null
  };

  let extracted = sections.map((section, index) => {
    const bodyEnd = computeBodyEnd(index, sections, registries, lines);
    const markdown = buildSectionMarkdown(lines, section, bodyEnd, options);
    return {
      section_id: section.data.section_id,
      anchorage: section.data.anchorage || null,
      range: { start_line: section.location.start_line, end_line: bodyEnd },
      markdown,
      yaml: section.data
    };
  });

  if (selector) {
    extracted = extracted.filter((section) => matchesSelector(section, doc, selector));
  }

  if (limit && extracted.length > limit) {
    extracted = extracted.slice(0, limit);
  }

  return { doc, sections: extracted, errors: [] };
}

module.exports = { extractSectionsFromText };
