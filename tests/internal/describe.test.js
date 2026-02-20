const test = require('node:test');
const assert = require('node:assert');
const { runCli } = require('./helpers');

test('describe: capabilities json', () => {
  const res = runCli(['describe', 'capabilities', '--format', 'json']);
  assert.match(res.stdout, /validate/);
});

test('describe: checklist yaml', () => {
  const res = runCli(['describe', 'checklist', '--format', 'yaml']);
  assert.match(res.stdout, /header_required/);
});

test('describe: vocab md', () => {
  const res = runCli(['describe', 'vocab']);
  assert.match(res.stdout, /anchorage\.view/);
});

test('describe: unknown topic exit 2', () => {
  const res = runCli(['describe', 'unknown']);
  assert.strictEqual(res.status, 2);
});

test('describe: default md for checklist', () => {
  const res = runCli(['describe', 'checklist']);
  assert.match(res.stdout, /strict checklist/);
});
