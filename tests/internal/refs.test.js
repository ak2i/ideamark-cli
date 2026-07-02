// Core Spec §9 (Document Identity and External References) / ADR-0003.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { runCli } = require('./helpers');
const { parseRef } = require('../../src/validate');

const SELF = 'DOC-SELF';

test('parseRef: bare id is a local reference', () => {
  assert.deepStrictEqual(parseRef('E-1', SELF), { kind: 'local', id: 'E-1' });
});

test('parseRef: canonical form resolves typed within own document (§9.2)', () => {
  for (const type of ['entities', 'occurrences', 'sections', 'perspectives']) {
    const ref = parseRef(`ideamark://docs/${SELF}#/${type}/X-1`, SELF);
    assert.deepStrictEqual(ref, { kind: 'local', type, id: 'X-1' });
  }
});

test('parseRef: canonical form with another doc_id is external (§9.2, §9.3)', () => {
  const ref = parseRef('ideamark://docs/DOC-OTHER#/entities/E-1', SELF);
  assert.strictEqual(ref.kind, 'external');
});

test('parseRef: shorthand form — own doc is local, other doc is external (§9.2)', () => {
  assert.deepStrictEqual(parseRef(`${SELF}#E-1`, SELF), { kind: 'local', id: 'E-1' });
  assert.strictEqual(parseRef('DOC-OTHER#E-1', SELF).kind, 'external');
});

test('parseRef: identity is exact string comparison — no normalization (§9.2)', () => {
  // Differently-cased doc_id is a different document; no URI normalization.
  assert.strictEqual(parseRef(`ideamark://docs/${SELF.toLowerCase()}#/entities/E-1`, SELF).kind, 'external');
});

test('refs: publish canonicalizes perspective refs incl. base (§9.2)', () => {
  const doc = fs.readFileSync(
    path.join('tests', 'fixtures', 'v1.1.1', 'valid', 'relations-perspectives.ideamark.md'),
    'utf8'
  ).replace(
    '  P-URBAN:\n    description: "Urban planning viewpoint"',
    '  P-BASE:\n    description: "Base viewpoint"\n  P-URBAN:\n    base: "P-BASE"\n    description: "Urban planning viewpoint"'
  );
  const res = runCli(['publish'], doc);
  assert.strictEqual(res.status, 0);
  assert.match(res.stdout, /perspective_scope:\n\s+- ideamark:\/\/docs\/DOC-V111-REL-PERSP#\/perspectives\/P-URBAN/);
  assert.match(res.stdout, /base: ideamark:\/\/docs\/DOC-V111-REL-PERSP#\/perspectives\/P-BASE/);
  // section.perspectives
  assert.match(res.stdout, /perspectives:\n\s+- ideamark:\/\/docs\/DOC-V111-REL-PERSP#\/perspectives\/P-URBAN/);
});

test('refs: external references survive publish unchanged (§9.3 opaque)', () => {
  const doc = fs.readFileSync(
    path.join('tests', 'fixtures', 'v1.1.1', 'valid', 'external-shorthand-ref.ideamark.md'),
    'utf8'
  );
  const res = runCli(['publish'], doc);
  assert.strictEqual(res.status, 0);
  assert.match(res.stdout, /entity: DOC-PAST-SESSION#E-CLAIM-001/);
});
