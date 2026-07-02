const test = require('node:test');
const assert = require('node:assert');
const { minimalDoc } = require('./helpers');
const { parseDocument } = require('../../src/parser');
const { validateDocument } = require('../../src/validate');
const { buildEvidenceBlock, attachEvidence } = require('../../src/evidence');

test('validate: missing header is error', () => {
  const res = validateDocument(parseDocument('# No header'), { mode: 'working' });
  assert.strictEqual(res.ok, false);
  assert.ok(res.diagnostics.some((x) => x.code === 'header_required'));
});

test('validate: strict missing fields error', () => {
  const doc = minimalDoc().replace('doc_type: "derived"\n', '');
  const res = validateDocument(parseDocument(doc), { mode: 'strict' });
  assert.strictEqual(res.ok, false);
});

test('validate: duplicate ID error', () => {
  const extra = '\n```yaml\nsection_id: "SEC-1"\noccurrences: ["OCC-1"]\n```\n';
  const doc = minimalDoc() + extra;
  const res = validateDocument(parseDocument(doc), { mode: 'strict' });
  assert.strictEqual(res.ok, false);
});

test('validate: unreferenced entity warning', () => {
  const doc = minimalDoc().replace(
    '    atomicity_basis: "interpretive"\noccurrences:',
    '    atomicity_basis: "interpretive"\n  IE-2:\n    kind: "observation"\n    payload:\n      body: "extra"\n      format:\n        media_type: "text/plain"\n    atomicity_basis: "interpretive"\noccurrences:'
  );
  const res = validateDocument(parseDocument(doc), { mode: 'strict' });
  assert.ok(res.diagnostics.some((x) => x.code === 'entity_unused'));
});

test('validate: broken section occurrence ref is error', () => {
  const doc = minimalDoc().replace('occurrences: ["OCC-1"]', 'occurrences: ["OCC-404"]');
  const res = validateDocument(parseDocument(doc), { mode: 'strict' });
  assert.strictEqual(res.ok, false);
});

test('validate: payload body/ref/cache one-of required', () => {
  const doc = minimalDoc().replace(
    '    payload:\n      body: "test"\n      format:\n        media_type: "text/plain"\n',
    '    payload: {}\n'
  );
  const res = validateDocument(parseDocument(doc), { mode: 'strict' });
  assert.strictEqual(res.ok, false);
  assert.ok(res.diagnostics.some((x) => x.code === 'payload_content_required'));
});

test('validate: payload.ref requires uri', () => {
  const doc = minimalDoc().replace(
    '      body: "test"\n      format:\n        media_type: "text/plain"\n',
    '      ref:\n        selector: "#fragment"\n      format:\n        media_type: "text/plain"\n'
  );
  const res = validateDocument(parseDocument(doc), { mode: 'strict' });
  assert.strictEqual(res.ok, false);
  assert.ok(res.diagnostics.some((x) => x.code === 'payload_ref_uri_required'));
});

test('validate: evidence block must be mapping', () => {
  const doc = minimalDoc() + '\n```yaml ideamark:evidence\n- kind: "diff-metric"\n```\n';
  const res = validateDocument(parseDocument(doc), { mode: 'working' });
  assert.strictEqual(res.ok, false);
  assert.ok(res.diagnostics.some((x) => x.code === 'evidence_mapping'));
});

test('validate: emit evidence yaml', () => {
  const doc = minimalDoc();
  const validated = validateDocument(parseDocument(doc), { mode: 'working' });
  const block = buildEvidenceBlock({
    kind: 'lint-report',
    scope: 'document',
    summary: validated.summary,
  });
  assert.match(block, /```yaml ideamark:evidence/);
});

test('validate: attach evidence to stdout', () => {
  const doc = minimalDoc();
  const res = attachEvidence(doc, { memo: 'attached' }, { scope: 'document' });
  assert.match(res.output, /```yaml ideamark:evidence/);
});
