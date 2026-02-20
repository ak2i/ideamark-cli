const test = require('node:test');
const assert = require('node:assert');
const { runCli, minimalDoc } = require('./helpers');

test('format: idempotent', () => {
  const doc = minimalDoc();
  const first = runCli(['format'], doc).stdout;
  const second = runCli(['format'], first).stdout;
  assert.strictEqual(first, second);
});

test('format: canonical converts local refs', () => {
  const doc = minimalDoc();
  const res = runCli(['format', '--canonical'], doc);
  assert.match(res.stdout, /ideamark:\/\/docs\/DOC-1#\/entities\/IE-1/);
});

test('format: non-canonical keeps local refs', () => {
  const doc = minimalDoc();
  const res = runCli(['format'], doc);
  assert.match(res.stdout, /entity: IE-1/);
});

test('format: preserves text sections', () => {
  const doc = minimalDoc() + '\nExtra line.';
  const res = runCli(['format'], doc);
  assert.match(res.stdout, /Extra line\./);
});

test('format: works with frontmatter only', () => {
  const doc = ['---', 'doc_id: "X"', '---', '', '# Title'].join('\n');
  const res = runCli(['format'], doc);
  assert.match(res.stdout, /doc_id/);
});
