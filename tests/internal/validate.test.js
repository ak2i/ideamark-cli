const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { runCli, minimalDoc } = require('./helpers');
const { parseDocument } = require('../../src/parser');
const { getAtomicityBasis, ATOMICITY_BASIS_DEFAULT } = require('../../src/validate');

function parseNdjson(text) {
  return text
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)
    .map((line) => JSON.parse(line));
}

function diagnosticsOf(res) {
  return parseNdjson(res.stdout).filter((r) => r.type === 'diagnostic');
}

const HEADER_ONLY = [
  '---',
  'ideamark_version: "1.1.1"',
  'doc_id: "DOC-EMPTY"',
  'doc_type: "derived"',
  'status:',
  '  state: "in_progress"',
  'created_at: "2026-07-01"',
  'updated_at: "2026-07-01"',
  'lang: "en"',
  '---',
  '',
].join('\n');

test('validate: minimal v1.1.1 doc passes strict', () => {
  const res = runCli(['validate', '--strict'], minimalDoc());
  assert.strictEqual(res.status, 0);
});

test('validate: missing header is error', () => {
  const res = runCli(['validate'], '# No header');
  assert.strictEqual(res.status, 1);
  assert.match(res.stdout, /header_required/);
});

test('validate: strict missing header fields error', () => {
  const doc = minimalDoc().replace('doc_type: "derived"\n', '');
  const res = runCli(['validate', '--strict'], doc);
  assert.strictEqual(res.status, 1);
});

test('validate: strict requires entities/occurrences/sections (§7.3, §7.14)', () => {
  const res = runCli(['validate', '--strict'], HEADER_ONLY);
  assert.strictEqual(res.status, 1);
  assert.match(res.stdout, /entities_required/);
  assert.match(res.stdout, /occurrences_required/);
  assert.match(res.stdout, /sections_required/);
});

test('validate: working mode reports missing collections as warnings', () => {
  const res = runCli(['validate'], HEADER_ONLY);
  assert.strictEqual(res.status, 0);
  const diags = diagnosticsOf(res).filter((d) => /_required$/.test(d.code));
  assert.ok(diags.length >= 3);
  assert.ok(diags.every((d) => d.severity === 'warning'));
});

test('validate: anchorage is optional in v1.1.1 (§7.11)', () => {
  let doc = minimalDoc();
  doc = doc.replace('anchorage:\n  view: ["design"]\n  phase: ["implementation"]\n', '');
  doc = doc.replace('    anchorage: { view: ["design"], phase: ["implementation"] }\n', '');
  const res = runCli(['validate', '--strict'], doc);
  assert.strictEqual(res.status, 0);
  assert.doesNotMatch(res.stdout, /anchorage/);
});

test('validate: section without occurrences is error (§7.6)', () => {
  let doc = minimalDoc();
  doc = doc.replace('occurrences: ["OCC-1"]\n', '');
  doc = doc.replace('    occurrences: ["OCC-1"]\n', '');
  const res = runCli(['validate', '--strict'], doc);
  assert.strictEqual(res.status, 1);
  assert.match(res.stdout, /section_occurrences_required/);
});

test('validate: duplicate section id error (§7.5)', () => {
  const extra = '\n```yaml\nsection_id: "SEC-1"\noccurrences: ["OCC-1"]\n```\n';
  const doc = minimalDoc() + extra;
  const res = runCli(['validate', '--strict'], doc);
  assert.strictEqual(res.status, 1);
  assert.match(res.stdout, /id_duplicate/);
});

test('validate: unreferenced entity warning stays a warning', () => {
  const doc = minimalDoc().replace(
    'body: "test"',
    'body: "test"\n  IE-2:\n    kind: "observation"\n    payload:\n      format:\n        media_type: "text/plain"\n      body: "extra"'
  );
  const res = runCli(['validate', '--strict'], doc);
  assert.strictEqual(res.status, 0);
  const unused = diagnosticsOf(res).find((d) => d.code === 'entity_unused');
  assert.ok(unused);
  assert.strictEqual(unused.severity, 'warning');
});

test('validate: --fail-on-warn turns warnings into failure exit', () => {
  const doc = minimalDoc().replace(
    'body: "test"',
    'body: "test"\n  IE-2:\n    kind: "observation"\n    payload:\n      format:\n        media_type: "text/plain"\n      body: "extra"'
  );
  const res = runCli(['validate', '--strict', '--fail-on-warn'], doc);
  assert.strictEqual(res.status, 1);
});

test('validate: structure section missing error', () => {
  const doc = minimalDoc().replace('structure:\n  sections: ["SEC-1"]', 'structure:\n  sections: ["SEC-404"]');
  const res = runCli(['validate', '--strict'], doc);
  assert.strictEqual(res.status, 1);
  assert.match(res.stdout, /section_ref_invalid/);
});

test('validate: atomicity_basis defaults to interpretive (§7.11)', () => {
  assert.strictEqual(ATOMICITY_BASIS_DEFAULT, 'interpretive');
  assert.strictEqual(getAtomicityBasis({}), 'interpretive');
  assert.strictEqual(getAtomicityBasis({ atomicity_basis: 'lexical' }), 'lexical');
});

test('validate: omitted atomicity_basis produces no diagnostic (§7.11)', () => {
  const res = runCli(['validate', '--strict'], minimalDoc());
  assert.doesNotMatch(res.stdout, /atomicity_basis/);
});

test('validate: unknown atomicity_basis value is warning, not error (§7.11)', () => {
  const doc = minimalDoc().replace('    kind: "observation"\n', '    kind: "observation"\n    atomicity_basis: "creative"\n');
  const res = runCli(['validate', '--strict'], doc);
  assert.strictEqual(res.status, 0);
  const diag = diagnosticsOf(res).find((d) => d.code === 'atomicity_basis_unknown');
  assert.ok(diag);
  assert.strictEqual(diag.severity, 'warning');
});

test('validate: parser normalizes single-value multi-fields to arrays (§7.13)', () => {
  const doc = minimalDoc()
    .replace('  view: ["design"]', '  view: "design"')
    .replace('  phase: ["implementation"]', '  phase: "implementation"');
  const parsed = parseDocument(doc);
  assert.deepStrictEqual(parsed.registry.sections['SEC-1'].anchorage.view, ['design']);
  assert.deepStrictEqual(parsed.registry.sections['SEC-1'].anchorage.phase, ['implementation']);
  const res = runCli(['validate', '--strict'], doc);
  assert.strictEqual(res.status, 0);
});

test('validate: multi-value field as mapping is error (§7.13)', () => {
  const doc = minimalDoc().replace('  view: ["design"]', '  view: { nested: true }');
  const res = runCli(['validate', '--strict'], doc);
  assert.strictEqual(res.status, 1);
  assert.match(res.stdout, /multi_value_field_invalid/);
});

test('validate: relations as array is error (v1.1.1 map form)', () => {
  const doc = minimalDoc().replace(
    'structure:',
    'relations:\n  - type: "supports"\n    from: "IE-1"\n    to: "SEC-1"\nstructure:'
  );
  const res = runCli(['validate', '--strict'], doc);
  assert.strictEqual(res.status, 1);
  assert.match(res.stdout, /relations_mapping_required/);
});

const AMBIGUOUS_REL_FIXTURE = path.join(
  'tests', 'fixtures', 'v1.1.1', 'invalid', 'warn-ambiguous-relation-ref.ideamark.md'
);

test('validate: bare relation id in both namespaces warns (Core Spec §6.3)', () => {
  const doc = fs.readFileSync(AMBIGUOUS_REL_FIXTURE, 'utf8');
  const res = runCli(['validate', '--strict'], doc);
  assert.strictEqual(res.status, 0);
  const diag = diagnosticsOf(res).find((d) => d.code === 'relation_ref_ambiguous');
  assert.ok(diag);
  assert.strictEqual(diag.severity, 'warning');
});

test('validate: typed reference form disambiguates relation endpoint (§6.3)', () => {
  const doc = fs
    .readFileSync(AMBIGUOUS_REL_FIXTURE, 'utf8')
    .replace(
      'from: "X-AMB"',
      'from: "ideamark://docs/DOC-V111-WARN-AMBIGUOUS-REL#/sections/X-AMB"'
    );
  const res = runCli(['validate', '--strict'], doc);
  assert.strictEqual(res.status, 0);
  assert.doesNotMatch(res.stdout, /relation_ref_ambiguous/);
});

test('validate: publish canonicalizes ambiguous endpoint as entity (§6.3 order)', () => {
  const doc = fs.readFileSync(AMBIGUOUS_REL_FIXTURE, 'utf8');
  const res = runCli(['publish'], doc);
  assert.strictEqual(res.status, 0);
  assert.match(res.stdout, /from: ideamark:\/\/docs\/DOC-V111-WARN-AMBIGUOUS-REL#\/entities\/X-AMB/);
});

test('validate: unresolved local perspective ref is warning (§7.4 scope)', () => {
  const doc = minimalDoc().replace(
    '  SEC-1:\n    anchorage:',
    '  SEC-1:\n    perspectives: ["P-NOWHERE"]\n    anchorage:'
  );
  const res = runCli(['validate', '--strict'], doc);
  assert.strictEqual(res.status, 0);
  const diag = diagnosticsOf(res).find((d) => d.code === 'perspective_ref_unresolved');
  assert.ok(diag);
  assert.strictEqual(diag.severity, 'warning');
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
