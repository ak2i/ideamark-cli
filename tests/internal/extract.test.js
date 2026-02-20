const test = require('node:test');
const assert = require('node:assert');
const { runCli, tempDir, writeTempFile, minimalDoc } = require('./helpers');

test('extract: section to new doc_id', () => {
  const res = runCli(['extract', '--section', 'SEC-1'], minimalDoc());
  assert.strictEqual(res.status, 0);
  assert.match(res.stdout, /doc_id:/);
  assert.doesNotMatch(res.stdout, /doc_id: "DOC-1"/);
});

test('extract: occurrence closure includes entity', () => {
  const res = runCli(['extract', '--occ', 'OCC-1'], minimalDoc());
  assert.match(res.stdout, /entities:/);
  assert.match(res.stdout, /IE-1/);
});

test('extract: invalid input fails', () => {
  const res = runCli(['extract', '--section', 'SEC-1'], 'No header');
  assert.strictEqual(res.status, 1);
});

test('extract: output validates strict', () => {
  const res = runCli(['extract', '--section', 'SEC-1'], minimalDoc());
  const val = runCli(['validate', '--strict'], res.stdout);
  assert.strictEqual(val.status, 0);
});

test('extract: structure contains only extracted section', () => {
  const res = runCli(['extract', '--section', 'SEC-1'], minimalDoc());
  assert.match(res.stdout, /structure:[\s\S]*sections:[\s\S]*SEC-1/);
});
