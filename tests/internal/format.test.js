const test = require('node:test');
const assert = require('node:assert');
const { minimalDoc } = require('./helpers');
const { formatDocument } = require('../../src/format');

test('format: idempotent', () => {
  const doc = minimalDoc();
  const first = formatDocument(doc, {}).output;
  const second = formatDocument(first, {}).output;
  assert.strictEqual(first, second);
});

test('format: canonical converts local refs', () => {
  const doc = minimalDoc();
  const res = formatDocument(doc, { canonical: true });
  assert.match(res.output, /ideamark:\/\/docs\/DOC-1#\/entities\/IE-1/);
});

test('format: non-canonical keeps local refs', () => {
  const doc = minimalDoc();
  const res = formatDocument(doc, {});
  assert.match(res.output, /entity: IE-1/);
});

test('format: preserves text sections', () => {
  const doc = minimalDoc() + '\nExtra line.';
  const res = formatDocument(doc, {});
  assert.match(res.output, /Extra line\./);
});

test('format: works with frontmatter only', () => {
  const doc = ['---', 'doc_id: "X"', '---', '', '# Title'].join('\n');
  const res = formatDocument(doc, {});
  assert.match(res.output, /doc_id/);
});

test('format: preserves evidence info string', () => {
  const doc = minimalDoc() + '\n```yaml ideamark:evidence\nmemo: "note"\n```\n';
  const res = formatDocument(doc, {});
  assert.match(res.output, /```yaml ideamark:evidence/);
});
