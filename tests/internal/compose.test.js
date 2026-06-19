const test = require('node:test');
const assert = require('node:assert');
const { minimalDoc } = require('./helpers');
const { parseDocument } = require('../../src/parser');
const { composeDocuments } = require('../../src/compose');

function docWithEntity(id, content) {
  return minimalDoc().replace(/IE-1/g, id).replace('body: "test"', `body: "${content}"`);
}

function docWithSectionNarrative(docId, narrative) {
  return minimalDoc({ header: { doc_id: docId } }).replace(
    '```\n\n```yaml\noccurrence_id: "OCC-1"',
    `\`\`\`\n\n${narrative}\n\n\`\`\`yaml\noccurrence_id: "OCC-1"`
  );
}

test('compose: union of entities', () => {
  const a = parseDocument(docWithEntity('IE-A', 'a'));
  const b = parseDocument(docWithEntity('IE-B', 'b'));
  const res = composeDocuments([a, b], {});
  assert.match(res.output, /IE-A/);
  assert.match(res.output, /IE-B/);
});

test('compose: conflict renames', () => {
  const a = parseDocument(docWithEntity('IE-1', 'a'));
  const b = parseDocument(docWithEntity('IE-1', 'b'));
  const res = composeDocuments([a, b], {});
  assert.match(res.output, /aliases/);
});

test('compose: structure merges order', () => {
  const a = parseDocument(minimalDoc());
  const b = parseDocument(
    minimalDoc()
      .replace(/SEC-1/g, 'SEC-2')
      .replace(/OCC-1/g, 'OCC-2')
      .replace(/IE-1/g, 'IE-2')
      .replace('doc_id: "DOC-1"', 'doc_id: "DOC-2"')
  );
  const res = composeDocuments([a, b], {});
  assert.match(res.output, /sections:[\s\S]*SEC-1[\s\S]*SEC-2/);
});

test('compose: inherit doc_id', () => {
  const a = parseDocument(minimalDoc());
  const b = parseDocument(minimalDoc().replace('DOC-1', 'DOC-2'));
  const res = composeDocuments([a, b], { inherit: 'first' });
  assert.match(res.output, /doc_id: DOC-1/);
});

test('compose: preserve markdown keeps section narrative near section yaml', () => {
  const a = parseDocument(docWithSectionNarrative('DOC-1', 'Section narrative A'));
  const b = parseDocument(docWithSectionNarrative('DOC-2', 'Section narrative B'));
  const res = composeDocuments([a, b], { preserveMarkdown: true });
  assert.match(res.output, /## SEC-1[\s\S]*Section narrative A/);
  assert.match(res.output, /## SEC-1[\s\S]*Section narrative B/);
  assert.doesNotMatch(res.output, /Source Narrative Appendix/);
});

test('compose: invalid input fails', () => {
  const a = parseDocument('No header');
  const b = parseDocument(minimalDoc());
  const res = composeDocuments([a, b], {});
  assert.strictEqual(res.ok, false);
});

test('compose: falls back to section registry when structure is missing', () => {
  const a = parseDocument(minimalDoc().replace('structure:\n  sections: ["SEC-1"]\n', ''));
  const b = parseDocument(
    minimalDoc()
      .replace(/SEC-1/g, 'SEC-2')
      .replace(/OCC-1/g, 'OCC-2')
      .replace(/IE-1/g, 'IE-2')
      .replace('doc_id: "DOC-1"', 'doc_id: "DOC-2"')
      .replace('structure:\n  sections: ["SEC-2"]\n', '')
  );
  const res = composeDocuments([a, b], {});
  assert.match(res.output, /sections:[\s\S]*SEC-1[\s\S]*SEC-2/);
});
