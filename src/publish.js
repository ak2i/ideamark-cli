const { formatDocument } = require('./format');
const { parseDocument } = require('./parser');
const { validateDocument } = require('./validate');
const { renderDocument } = require('./render');
const { nowDate, deepClone } = require('./utils');

function publishDocument(text) {
  const diagnostics = [];
  const formatted = formatDocument(text, { canonical: true });
  const parsed = parseDocument(formatted.output);
  const validation = validateDocument(parsed, { mode: 'strict' });
  diagnostics.push(...validation.diagnostics);
  if (!validation.ok) return { diagnostics, ok: false };

  const header = deepClone(parsed.header || {});
  header.updated_at = nowDate();
  if (header.status && typeof header.status === 'object') {
    header.status.state = 'published';
  }

  const output = renderDocument({ header, registry: parsed.registry }, { canonical: true });
  return { diagnostics, ok: true, output };
}

module.exports = { publishDocument };
