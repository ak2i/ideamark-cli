const test = require('node:test');
const assert = require('node:assert');
const { minimalDoc } = require('./helpers');
const { publishDocument } = require('../../src/publish');

test('publish: sets status to published', () => {
  const res = publishDocument(minimalDoc());
  assert.match(res.output, /status:[\s\S]*state: published/);
});

test('publish: updates updated_at', () => {
  const res = publishDocument(minimalDoc());
  assert.doesNotMatch(res.output, /updated_at: "2026-06-19T00:00:00Z"/);
  assert.match(res.output, /updated_at: \d{4}-\d{2}-\d{2}T/);
});

test('publish: canonicalizes refs', () => {
  const res = publishDocument(minimalDoc());
  assert.match(res.output, /ideamark:\/\/docs\/DOC-1#\/entities\/IE-1/);
});

test('publish: fails on invalid input', () => {
  const res = publishDocument('No header');
  assert.strictEqual(res.ok, false);
});

test('publish: no artifact on failure', () => {
  const res = publishDocument('No header');
  assert.strictEqual(res.output, undefined);
});
