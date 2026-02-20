const test = require('node:test');
const assert = require('node:assert');
const { runCli, minimalDoc } = require('./helpers');

test('publish: sets status to published', () => {
  const res = runCli(['publish'], minimalDoc());
  assert.match(res.stdout, /status:[\s\S]*state: published/);
});

test('publish: updates updated_at', () => {
  const res = runCli(['publish'], minimalDoc());
  assert.doesNotMatch(res.stdout, /updated_at: "2026-02-20"/);
});

test('publish: canonicalizes refs', () => {
  const res = runCli(['publish'], minimalDoc());
  assert.match(res.stdout, /ideamark:\/\/docs\/DOC-1#\/entities\/IE-1/);
});

test('publish: fails on invalid input', () => {
  const res = runCli(['publish'], 'No header');
  assert.strictEqual(res.status, 1);
});

test('publish: no artifact on failure', () => {
  const res = runCli(['publish'], 'No header');
  assert.strictEqual(res.stdout.trim(), '');
});
