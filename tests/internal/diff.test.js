const test = require('node:test');
const assert = require('node:assert');
const { tempDir, writeTempFile, runCli, minimalDoc } = require('./helpers');

function parseNdjson(text) {
  return text
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)
    .map((line) => JSON.parse(line));
}

test('diff: default ignores updated_at changes', () => {
  const dir = tempDir();
  const a = minimalDoc();
  const b = a.replace('updated_at: "2026-02-20"', 'updated_at: "2026-03-01"');
  const pa = writeTempFile(dir, 'a.md', a);
  const pb = writeTempFile(dir, 'b.md', b);

  const res = runCli(['diff', pa, pb]);
  assert.strictEqual(res.status, 0);
  const rows = parseNdjson(res.stdout);
  assert.strictEqual(rows.length, 0);
});

test('diff: include-meta reports updated_at change', () => {
  const dir = tempDir();
  const a = minimalDoc();
  const b = a.replace('updated_at: "2026-02-20"', 'updated_at: "2026-03-01"');
  const pa = writeTempFile(dir, 'a.md', a);
  const pb = writeTempFile(dir, 'b.md', b);

  const res = runCli(['diff', pa, pb, '--include-meta']);
  assert.strictEqual(res.status, 0);
  const rows = parseNdjson(res.stdout);
  assert.ok(rows.some((r) => r.op === 'replace' && r.path === '#/header/updated_at'));
});

test('diff: add entity appears as add operation', () => {
  const dir = tempDir();
  const a = minimalDoc();
  const b = a.replace('content: "test"', 'content: "test"\n  IE-2:\n    kind: "note"\n    content: "new"');
  const pa = writeTempFile(dir, 'a.md', a);
  const pb = writeTempFile(dir, 'b.md', b);

  const res = runCli(['diff', pa, pb, '--format', 'json']);
  assert.strictEqual(res.status, 0);
  const rows = JSON.parse(res.stdout);
  assert.ok(rows.some((r) => r.op === 'add' && r.path.includes('#/entities/IE-2')));
});

test('diff: structure order change emits move', () => {
  const dir = tempDir();
  const a = minimalDoc().replace('  sections: ["SEC-1"]', '  sections: ["SEC-1", "SEC-2"]');
  const a2 = a + '\n```yaml\nsection_id: "SEC-2"\nanchorage:\n  view: "background"\n  phase: "confirmed"\noccurrences: []\n```\n';
  const b = a2.replace('["SEC-1", "SEC-2"]', '["SEC-2", "SEC-1"]');
  const pa = writeTempFile(dir, 'a.md', a2);
  const pb = writeTempFile(dir, 'b.md', b);

  const res = runCli(['diff', pa, pb]);
  assert.strictEqual(res.status, 0);
  const rows = parseNdjson(res.stdout);
  assert.ok(rows.some((r) => r.op === 'move' && r.path === '#/structure/sections'));
});

test('diff: markdown output', () => {
  const dir = tempDir();
  const a = minimalDoc();
  const b = a + '\nextra markdown\n';
  const pa = writeTempFile(dir, 'a.md', a);
  const pb = writeTempFile(dir, 'b.md', b);

  const res = runCli(['diff', pa, pb, '--format', 'md', '--scope', 'all', '--include-markdown']);
  assert.strictEqual(res.status, 0);
  assert.match(res.stdout, /# diff report/);
});
