const test = require('node:test');
const assert = require('node:assert');
const { minimalDoc } = require('./helpers');
const { computeDiff, toMarkdown } = require('../../src/diff');

function twoSectionDoc() {
  return [
    '---',
    'ideamark_version: "1.1.1"',
    'doc_id: "DOC-2SEC"',
    'doc_type: "derived"',
    'status:',
    '  state: "in_progress"',
    'created_at: "2026-06-19T00:00:00Z"',
    'updated_at: "2026-06-19T00:00:00Z"',
    'lang: "en-US"',
    '---',
    '',
    '## SEC-1',
    '```yaml',
    'section_id: "SEC-1"',
    'occurrences: ["OCC-1"]',
    '```',
    '',
    '## SEC-2',
    '```yaml',
    'section_id: "SEC-2"',
    'occurrences: ["OCC-2"]',
    '```',
    '',
    '## Registry',
    '```yaml',
    'entities:',
    '  IE-1:',
    '    kind: "observation"',
    '    payload:',
    '      body: "test-1"',
    '      format:',
    '        media_type: "text/plain"',
    '    atomicity_basis: "interpretive"',
    '  IE-2:',
    '    kind: "observation"',
    '    payload:',
    '      body: "test-2"',
    '      format:',
    '        media_type: "text/plain"',
    '    atomicity_basis: "interpretive"',
    'occurrences:',
    '  OCC-1:',
    '    entity: "IE-1"',
    '    role: "observation"',
    '  OCC-2:',
    '    entity: "IE-2"',
    '    role: "observation"',
    'sections:',
    '  SEC-1:',
    '    occurrences: ["OCC-1"]',
    '  SEC-2:',
    '    occurrences: ["OCC-2"]',
    'relations: {}',
    'perspectives: {}',
    'structure:',
    '  sections: ["SEC-1", "SEC-2"]',
    '```',
    '',
  ].join('\n');
}

test('diff: default ignores updated_at changes', () => {
  const a = minimalDoc();
  const b = a.replace('updated_at: "2026-06-19T00:00:00Z"', 'updated_at: "2026-07-01T00:00:00Z"');
  const res = computeDiff(a, b, {});
  assert.strictEqual(res.ok, true);
  assert.strictEqual(res.changes.length, 0);
});

test('diff: include-meta reports updated_at change', () => {
  const a = minimalDoc();
  const b = a.replace('updated_at: "2026-06-19T00:00:00Z"', 'updated_at: "2026-07-01T00:00:00Z"');
  const res = computeDiff(a, b, { includeMeta: true });
  assert.strictEqual(res.ok, true);
  assert.ok(res.changes.some((r) => r.op === 'replace' && r.path === '#/header/updated_at'));
});

test('diff: add entity appears as add operation', () => {
  const a = minimalDoc();
  const b = a.replace(
    '    atomicity_basis: "interpretive"\noccurrences:',
    '    atomicity_basis: "interpretive"\n  IE-2:\n    kind: "note"\n    payload:\n      body: "new"\n      format:\n        media_type: "text/plain"\n    atomicity_basis: "interpretive"\noccurrences:'
  );
  const res = computeDiff(a, b, {});
  assert.strictEqual(res.ok, true);
  assert.ok(res.changes.some((r) => r.op === 'add' && r.path.includes('#/entities/IE-2')));
});

test('diff: structure order change emits move', () => {
  const a = twoSectionDoc();
  const b = a.replace('["SEC-1", "SEC-2"]', '["SEC-2", "SEC-1"]');
  const res = computeDiff(a, b, {});
  assert.strictEqual(res.ok, true);
  assert.ok(res.changes.some((r) => r.op === 'move' && r.path === '#/structure/sections'));
});

test('diff: markdown output', () => {
  const a = minimalDoc();
  const b = a + '\nextra markdown\n';
  const res = computeDiff(a, b, { scope: 'all', includeMarkdown: true });
  assert.strictEqual(res.ok, true);
  const md = toMarkdown(res.changes, { scope: 'all', includeMarkdown: true, includeMeta: false });
  assert.match(md, /# diff report/);
});
