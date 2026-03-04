const test = require('node:test');
const assert = require('node:assert');
const { runCli } = require('./helpers');

test('describe: capabilities json', () => {
  const res = runCli(['describe', 'capabilities', '--format', 'json']);
  const payload = JSON.parse(res.stdout);
  assert.strictEqual(payload.contract.version, '1.0.3');
  assert.ok(payload.commands.describe.topics.includes('ls'));
  assert.ok(payload.commands.describe.topics.includes('routing'));
  assert.strictEqual(payload.features.routing.supported, true);
  assert.ok(payload.commands.lint);
  assert.ok(payload.commands.diff);
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

test('describe: routing json', () => {
  const res = runCli(['describe', 'routing', '--format', 'json']);
  const payload = JSON.parse(res.stdout);
  assert.strictEqual(payload.topic, 'routing');
  assert.ok(Array.isArray(payload.source.section_ids));
  assert.ok(payload.source.section_ids.length > 0);
});

test('describe: ls guides with sections', () => {
  const res = runCli([
    'describe',
    'ls',
    '--target',
    'guides',
    '--sections',
    '--format',
    'json',
    '--lang',
    'en-US',
  ]);
  const payload = JSON.parse(res.stdout);
  assert.strictEqual(payload.target, 'guides');
  assert.ok(Array.isArray(payload.guides[0].sections));
  assert.ok(payload.guides[0].sections.some((s) => String(s.id).includes('SEC-IMK-SCOPE-BACKGROUND')));
});

test('describe: model requires ai audience', () => {
  const res = runCli(['describe', 'capabilities', '--audience', 'human', '--model', 'small']);
  assert.strictEqual(res.status, 2);
});
