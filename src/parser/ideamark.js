const YAML = require('yaml');
const { scanFencedBlocks } = require('./scan');

function isYamlInfo(info) {
  if (!info) return false;
  const lowered = info.toLowerCase();
  return lowered === 'yaml' || lowered === 'yml' || lowered.startsWith('yaml ');
}

function parseYamlBlock(block) {
  const doc = YAML.parseDocument(block.content, { prettyErrors: false });
  if (doc.errors && doc.errors.length > 0) {
    const err = doc.errors[0];
    let location = null;
    if (err.linePos && err.linePos.start && typeof err.linePos.start.line === 'number') {
      const base = block.startLine + 1;
      const start = err.linePos.start.line;
      const end = err.linePos.end && typeof err.linePos.end.line === 'number'
        ? err.linePos.end.line
        : start;
      location = {
        start_line: base + start - 1,
        end_line: base + end - 1
      };
    }
    return {
      error: {
        code: 'E_YAML_PARSE',
        message: `YAML parse error: ${err.message}`,
        location
      }
    };
  }

  return { data: doc.toJSON() };
}

function parseIdeaMark(text) {
  const blocks = scanFencedBlocks(text).filter((b) => isYamlInfo(b.info));
  const result = {
    header: null,
    sections: [],
    registries: [],
    errors: [],
    blocks: []
  };

  for (const block of blocks) {
    const parsed = parseYamlBlock(block);
    if (parsed.error) {
      result.errors.push(parsed.error);
      result.blocks.push({
        type: 'error',
        block,
        error: parsed.error
      });
      continue;
    }

    const data = parsed.data || {};
    const entry = {
      data,
      location: { start_line: block.startLine, end_line: block.endLine },
      block
    };

    if (data && data.ideamark_version === 1 && !result.header) {
      result.header = entry;
      result.blocks.push({ type: 'header', ...entry });
      continue;
    }

    if (data && Object.prototype.hasOwnProperty.call(data, 'section_id')) {
      result.sections.push(entry);
      result.blocks.push({ type: 'section', ...entry });
      continue;
    }

    if (data && (Object.prototype.hasOwnProperty.call(data, 'sections') || Object.prototype.hasOwnProperty.call(data, 'structure'))) {
      result.registries.push(entry);
      result.blocks.push({ type: 'registry', ...entry });
      continue;
    }

    result.blocks.push({ type: 'other', ...entry });
  }

  return result;
}

module.exports = { parseIdeaMark };
