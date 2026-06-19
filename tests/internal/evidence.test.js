const test = require('node:test');
const assert = require('node:assert');
const { minimalDoc } = require('./helpers');
const { attachEvidence, buildEvidenceBlock } = require('../../src/evidence');

test('evidence: buildEvidenceBlock wraps mapping', () => {
  const block = buildEvidenceBlock({ memo: 'note' });
  assert.match(block, /```yaml ideamark:evidence/);
  assert.match(block, /memo: note/);
});

test('evidence: attach document-level after header', () => {
  const doc = minimalDoc();
  const res = attachEvidence(doc, { memo: 'doc' }, { scope: 'document' });
  const headerPos = res.output.indexOf('ideamark_version:');
  const evidencePos = res.output.indexOf('```yaml ideamark:evidence');
  assert.ok(evidencePos > headerPos);
});

test('evidence: attach section-level to whole-document yaml without warning when section exists', () => {
  const doc = minimalDoc();
  const res = attachEvidence(doc, { memo: 'sec' }, { scope: 'section', targetId: 'SEC-1' });
  assert.strictEqual(res.diagnostics.length, 0);
  assert.match(res.output, /```yaml ideamark:evidence/);
});

test('evidence: attach occurrence-level to whole-document yaml without warning when occurrence exists', () => {
  const doc = minimalDoc();
  const res = attachEvidence(doc, { memo: 'occ' }, { scope: 'occurrence', targetId: 'OCC-1' });
  assert.strictEqual(res.diagnostics.length, 0);
  assert.match(res.output, /```yaml ideamark:evidence/);
});

test('evidence: attach unknown target warns and appends', () => {
  const doc = minimalDoc();
  const res = attachEvidence(doc, { memo: 'miss' }, { scope: 'section', targetId: 'SEC-404' });
  assert.strictEqual(res.diagnostics.length, 1);
  assert.match(res.diagnostics[0].code, /evidence_attach_target_not_found/);
  assert.match(res.output, /```yaml ideamark:evidence/);
});
