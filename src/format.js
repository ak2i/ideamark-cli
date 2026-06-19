const { parseDocument } = require('./parser');
const { renderDocument } = require('./render');

function formatDocument(text, options) {
  const canonical = !!options.canonical;
  const doc = parseDocument(text);
  const diagnostics = [];
  const output = renderDocument({ header: doc.header, registry: doc.registry }, { canonical });
  return { output, diagnostics };
}

module.exports = { formatDocument };
