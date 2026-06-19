const test = require('node:test');
const assert = require('node:assert');
const { minimalDoc } = require('./helpers');
const { parseDocument } = require('../../src/parser');
const { extractDocument } = require('../../src/extract');
const { validateDocument } = require('../../src/validate');

test('extract: section to new doc_id', () => {
  const res = extractDocument(parseDocument(minimalDoc()), { sectionId: 'SEC-1' });
  assert.strictEqual(res.ok, true);
  assert.match(res.output, /doc_id:/);
  assert.doesNotMatch(res.output, /doc_id: "DOC-1"/);
});

test('extract: occurrence closure includes entity', () => {
  const res = extractDocument(parseDocument(minimalDoc()), { occurrenceId: 'OCC-1' });
  assert.match(res.output, /entities:/);
  assert.match(res.output, /IE-1/);
});

test('extract: invalid input fails', () => {
  const res = extractDocument(parseDocument('No header'), { sectionId: 'SEC-1' });
  assert.strictEqual(res.ok, false);
});

test('extract: output validates strict', () => {
  const res = extractDocument(parseDocument(minimalDoc()), { sectionId: 'SEC-1' });
  const val = validateDocument(parseDocument(res.output), { mode: 'strict' });
  assert.strictEqual(val.ok, true);
});

test('extract: structure contains only extracted section', () => {
  const res = extractDocument(parseDocument(minimalDoc()), { sectionId: 'SEC-1' });
  assert.match(res.output, /structure:[\s\S]*sections:[\s\S]*SEC-1/);
});

test('extract: keeps only referenced perspectives', () => {
  const doc = minimalDoc()
    .replace('section_id: "SEC-1"\noccurrences: ["OCC-1"]', 'section_id: "SEC-1"\nperspectives: ["P-SEC"]\noccurrences: ["OCC-1"]')
    .replace(
      '    atomicity_basis: "interpretive"\noccurrences:',
      '    atomicity_basis: "interpretive"\n    perspective_scope: ["P-ENT"]\noccurrences:'
    )
    .replace(
      'perspectives: {}',
      'perspectives:\n  P-ENT:\n    description: "Entity perspective"\n  P-SEC:\n    description: "Section perspective"\n  P-UNUSED:\n    description: "Unused perspective"'
    );
  const res = extractDocument(parseDocument(doc), { sectionId: 'SEC-1' });
  assert.match(res.output, /P-ENT/);
  assert.match(res.output, /P-SEC/);
  assert.doesNotMatch(res.output, /P-UNUSED/);
});
