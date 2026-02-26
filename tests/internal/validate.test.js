const test = require('node:test');
const assert = require('node:assert');
const { runCli, tempDir, writeTempFile, minimalDoc } = require('./helpers');

test('validate: missing header is error', () => {
  const res = runCli(['validate'], '# No header');
  assert.strictEqual(res.status, 1);
  assert.match(res.stdout, /diagnostic/);
});

test('validate: strict missing fields error', () => {
  const doc = minimalDoc().replace('doc_type: "derived"\n', '');
  const res = runCli(['validate', '--strict'], doc);
  assert.strictEqual(res.status, 1);
});

test('validate: duplicate ID error', () => {
  const extra = '\n```yaml\nsection_id: "SEC-1"\nanchorage:\n  view: "design"\n  phase: "implementation"\n```\n';
  const doc = minimalDoc() + extra;
  const res = runCli(['validate', '--strict'], doc);
  assert.strictEqual(res.status, 1);
});

test('validate: unreferenced entity warning', () => {
  const doc = minimalDoc().replace('content: "test"', 'content: "test"\n  IE-2:\n    kind: "observation"\n    content: "extra"');
  const res = runCli(['validate', '--strict'], doc);
  assert.match(res.stdout, /warning/);
});

test('validate: structure section missing error', () => {
  const doc = minimalDoc().replace('structure:\n  sections: ["SEC-1"]', 'structure:\n  sections: ["SEC-404"]');
  const res = runCli(['validate', '--strict'], doc);
  assert.strictEqual(res.status, 1);
});

test('validate: anchorage required (non-strict)', () => {
  let doc = minimalDoc();
  doc = doc.replace(
    '## SEC-1\n```yaml\nsection_id: "SEC-1"\nanchorage:\n  view: "design"\n  phase: "implementation"\noccurrences: ["OCC-1"]\n```\n\n',
    ''
  );
  doc = doc.replace(
    '    anchorage: { view: "design", phase: "implementation" }\n',
    ''
  );
  const res = runCli(['validate'], doc);
  assert.strictEqual(res.status, 1);
  assert.match(res.stdout, /anchorage_required/);
});

test('validate: anchorage must be mapping', () => {
  let doc = minimalDoc();
  doc = doc.replace(
    'anchorage:\n  view: "design"\n  phase: "implementation"\n',
    'anchorage: "oops"\n'
  );
  doc = doc.replace(
    '    anchorage: { view: "design", phase: "implementation" }\n',
    '    anchorage: "oops"\n'
  );
  const res = runCli(['validate'], doc);
  assert.strictEqual(res.status, 1);
  assert.match(res.stdout, /anchorage_mapping/);
});

test('validate: evidence block must be mapping', () => {
  const doc = minimalDoc() + '\n```yaml ideamark:evidence\n- kind: "diff-metric"\n```\n';
  const res = runCli(['validate'], doc);
  assert.strictEqual(res.status, 1);
  assert.match(res.stdout, /evidence_mapping/);
});

test('validate: emit evidence yaml', () => {
  const doc = minimalDoc();
  const res = runCli(['validate', '--emit-evidence', 'yaml'], doc);
  assert.strictEqual(res.status, 0);
  assert.match(res.stdout, /```yaml ideamark:evidence/);
});

test('validate: attach evidence to stdout', () => {
  const doc = minimalDoc();
  const res = runCli(['validate', '--attach', '-'], doc);
  assert.strictEqual(res.status, 0);
  assert.match(res.stdout, /```yaml ideamark:evidence/);
});
