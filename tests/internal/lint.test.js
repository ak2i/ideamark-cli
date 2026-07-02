const test = require('node:test');
const assert = require('node:assert');
const { runCli, minimalDoc } = require('./helpers');

function parseNdjson(text) {
  return text
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)
    .map((line) => JSON.parse(line));
}

test('lint: default non-blocking even with errors', () => {
  const broken = '# no header';
  const res = runCli(['lint'], broken);
  assert.strictEqual(res.status, 0);
  const lines = parseNdjson(res.stdout);
  const summary = lines.find((x) => x.type === 'summary');
  assert.ok(summary);
  assert.strictEqual(summary.ok, true);
  assert.ok(summary.error_count > 0);
});

test('lint: strict fails on error diagnostics', () => {
  const broken = '# no header';
  const res = runCli(['lint', '--strict'], broken);
  assert.strictEqual(res.status, 1);
  const lines = parseNdjson(res.stdout);
  const summary = lines.find((x) => x.type === 'summary');
  assert.ok(summary);
  assert.strictEqual(summary.ok, false);
});

function docWithoutAnchorage() {
  return minimalDoc()
    .replace('anchorage:\n  view: ["design"]\n  phase: ["implementation"]\n', '')
    .replace('    anchorage: { view: ["design"], phase: ["implementation"] }\n', '');
}

test('lint: minimal profile excludes recommended warnings', () => {
  const res = runCli(['lint', '--profile', 'minimal'], docWithoutAnchorage());
  assert.strictEqual(res.status, 0);
  const lines = parseNdjson(res.stdout);
  const diags = lines.filter((x) => x.type === 'diagnostic');
  assert.ok(!diags.some((x) => x.code === 'IM-LINT-104'));
});

test('lint: diagnostic profile warns on sections without anchorage signals', () => {
  const res = runCli(['lint', '--profile', 'diagnostic'], docWithoutAnchorage());
  assert.strictEqual(res.status, 0);
  const lines = parseNdjson(res.stdout);
  const diags = lines.filter((x) => x.type === 'diagnostic');
  assert.ok(diags.some((x) => x.code === 'IM-LINT-104'));
});

test('lint: anchorage view/phase satisfies IM-LINT-104', () => {
  const res = runCli(['lint', '--profile', 'diagnostic'], minimalDoc());
  assert.strictEqual(res.status, 0);
  const lines = parseNdjson(res.stdout);
  const diags = lines.filter((x) => x.type === 'diagnostic');
  assert.ok(!diags.some((x) => x.code === 'IM-LINT-104'));
});

test('lint: json format', () => {
  const res = runCli(['lint', '--format', 'json'], minimalDoc());
  assert.strictEqual(res.status, 0);
  const payload = JSON.parse(res.stdout);
  assert.strictEqual(payload.meta.type, 'meta');
  assert.ok(Array.isArray(payload.diagnostics));
  assert.strictEqual(payload.summary.type, 'summary');
});

test('lint: md format', () => {
  const res = runCli(['lint', '--format', 'md', '--profile', 'diagnostic'], docWithoutAnchorage());
  assert.strictEqual(res.status, 0);
  assert.match(res.stdout, /# lint report/);
  assert.match(res.stdout, /IM-LINT-104/);
});
