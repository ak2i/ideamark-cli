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
  const headerPos = res.output.indexOf('---\n');
  const evidencePos = res.output.indexOf('```yaml ideamark:evidence');
  assert.ok(evidencePos > headerPos);
});

test('evidence: attach section-level near section block', () => {
  const doc = minimalDoc();
  const res = attachEvidence(doc, { memo: 'sec' }, { scope: 'section', targetId: 'SEC-1' });
  const sectionBlock = 'section_id: "SEC-1"';
  const sectionPos = res.output.indexOf(sectionBlock);
  const evidencePos = res.output.indexOf('```yaml ideamark:evidence');
  assert.ok(evidencePos > sectionPos);
});

test('evidence: attach occurrence-level near occurrence block', () => {
  const doc = minimalDoc();
  const res = attachEvidence(doc, { memo: 'occ' }, { scope: 'occurrence', targetId: 'OCC-1' });
  const occBlock = 'occurrence_id: "OCC-1"';
  const occPos = res.output.indexOf(occBlock);
  const evidencePos = res.output.indexOf('```yaml ideamark:evidence');
  assert.ok(evidencePos > occPos);
});

test('evidence: attach unknown target warns and appends', () => {
  const doc = minimalDoc();
  const res = attachEvidence(doc, { memo: 'miss' }, { scope: 'section', targetId: 'SEC-404' });
  assert.strictEqual(res.diagnostics.length, 1);
  assert.match(res.diagnostics[0].code, /evidence_attach_target_not_found/);
  assert.match(res.output, /```yaml ideamark:evidence/);
});
