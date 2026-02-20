const { parseDocument, stringifyYaml } = require('./parser');
const { normalizeRefsInObject } = require('./refs');

function formatDocument(text, options) {
  const canonical = !!options.canonical;
  const doc = parseDocument(text);
  const diagnostics = [];

  const idSets = {
    entities: new Set(Object.keys(doc.registry.entities || {})),
    occurrences: new Set(Object.keys(doc.registry.occurrences || {})),
    sections: new Set(Object.keys(doc.registry.sections || {})),
  };
  const docId = doc.header && doc.header.doc_id;

  const segments = doc.segments.map((seg) => {
    if (seg.type !== 'yaml') return seg;
    if (!seg.parsed || !seg.parsed.ok) return seg;
    let obj = seg.parsed.value;
    if (canonical) {
      obj = normalizeRefsInObject(obj, docId, idSets);
    }
    const dumped = stringifyYaml(obj).trimEnd();
    if (seg.subtype === 'frontmatter') {
      return { type: 'text', value: `---\n${dumped}\n---\n` };
    }
    return { type: 'text', value: `\`\`\`yaml\n${dumped}\n\`\`\`\n` };
  });

  const output = segments.map((s) => (s.type === 'text' ? s.value : '')).join('');
  return { output, diagnostics };
}

module.exports = { formatDocument };
