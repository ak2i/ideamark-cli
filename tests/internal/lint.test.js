const test = require('node:test');
const assert = require('node:assert');
const { minimalDoc } = require('./helpers');
const { parseDocument } = require('../../src/parser');
const { lintDocument, lintToJson, lintToMarkdown } = require('../../src/lint');

test('lint: default non-blocking even with errors', () => {
  const broken = '# no header';
  const res = lintDocument(parseDocument(broken), { profile: 'diagnostic', strict: false });
  assert.strictEqual(res.ok, true);
  assert.ok(res.summary.error_count > 0);
});

test('lint: strict fails on error diagnostics', () => {
  const broken = '# no header';
  const res = lintDocument(parseDocument(broken), { profile: 'diagnostic', strict: true });
  assert.strictEqual(res.ok, false);
  assert.strictEqual(res.summary.ok, false);
});

test('lint: minimal profile excludes recommended warnings', () => {
  const res = lintDocument(parseDocument(minimalDoc()), { profile: 'minimal', strict: false });
  assert.strictEqual(res.ok, true);
  assert.ok(!res.diagnostics.some((x) => x.code === 'IM-LINT-104'));
});

test('lint: diagnostic profile emits payload media_type warning', () => {
  const doc = minimalDoc().replace('        media_type: "text/plain"\n', '');
  const res = lintDocument(parseDocument(doc), { profile: 'diagnostic', strict: false });
  assert.strictEqual(res.ok, true);
  assert.ok(res.diagnostics.some((x) => x.code === 'IM-LINT-104'));
});

test('lint: json format', () => {
  const res = lintDocument(parseDocument(minimalDoc()), { profile: 'diagnostic', strict: false });
  const payload = JSON.parse(lintToJson(res));
  assert.strictEqual(payload.meta.type, 'meta');
  assert.ok(Array.isArray(payload.diagnostics));
  assert.strictEqual(payload.summary.type, 'summary');
});

test('lint: md format', () => {
  const doc = minimalDoc().replace('        media_type: "text/plain"\n', '');
  const res = lintDocument(parseDocument(doc), { profile: 'diagnostic', strict: false });
  const md = lintToMarkdown(res, 'diagnostic', false);
  assert.match(md, /# lint report/);
  assert.match(md, /IM-LINT-104/);
});
