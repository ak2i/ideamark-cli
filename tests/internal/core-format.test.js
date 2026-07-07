const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const YAML = require('yaml');

const { formatDocument, CANONICAL_ORDER } = require('../../src/core/format');
const { loadDocument } = require('../../src/core/load');
const { validateDocument } = require('../../src/core/validate');

const FIXTURES = path.join(__dirname, '..', 'fixtures', 'v1.2.0');

function readFixture(...rel) {
  return fs.readFileSync(path.join(FIXTURES, ...rel), 'utf8');
}

function validCorpus() {
  const dir = path.join(FIXTURES, 'valid');
  return fs.readdirSync(dir).filter((f) => f.endsWith('.ideamark.yaml'));
}

test('round-trip: format preserves data and validation results for the valid corpus', () => {
  for (const name of validCorpus()) {
    const text = readFixture('valid', name);
    const result = formatDocument(text);
    assert.strictEqual(result.ok, true, name);
    assert.deepStrictEqual(YAML.parse(result.output), YAML.parse(text), `${name}: data changed by format`);
    const validated = validateDocument(loadDocument(result.output), { mode: 'core' });
    assert.deepStrictEqual(validated.diagnostics, [], `${name}: formatted output no longer clean`);
  }
});

test('round-trip: format is idempotent', () => {
  for (const name of validCorpus()) {
    const once = formatDocument(readFixture('valid', name)).output;
    const twice = formatDocument(once, { info: true });
    assert.strictEqual(twice.output, once, `${name}: format not idempotent`);
    assert.ok(twice.diagnostics.some((d) => d.code === 'format_noop'), `${name}: second format should be a noop`);
  }
});

test('round-trip: comments, key order, and scalar styles are preserved', () => {
  const text = [
    '# document header comment',
    'meta:',
    '  spec_version: ideamark-core-v1.2.0',
    '  document_id: "fx-comments" # keep the quotes',
    '  status: draft',
    '# sources below',
    'sources: []',
    'sections: []',
    'occurrences: []',
    'entities: []',
    '',
  ].join('\n');
  const result = formatDocument(text);
  assert.strictEqual(result.ok, true);
  assert.match(result.output, /# document header comment/);
  assert.match(result.output, /# keep the quotes/);
  assert.match(result.output, /# sources below/);
  assert.match(result.output, /"fx-comments"/, 'scalar quote style should be preserved in round-trip mode');
});

test('round-trip: unknown namespaces and extension fields are preserved', () => {
  const unknownNs = readFixture('warnings', 'warn-unknown_namespace.ideamark.yaml');
  const out1 = formatDocument(unknownNs).output;
  assert.deepStrictEqual(YAML.parse(out1).custom_data, { hello: 'world' });

  const unknownField = readFixture('warnings', 'warn-unknown_field.ideamark.yaml');
  const out2 = formatDocument(unknownField).output;
  assert.strictEqual(YAML.parse(out2).entities[0].mystery_field, 'not namespaced');
});

test('canonical: reorders top-level namespaces without changing data', () => {
  const shuffled = [
    'entities:',
    '  - id: ent-001',
    '    content: Reusable material.',
    'meta:',
    '  spec_version: ideamark-core-v1.2.0',
    '  document_id: fx-canonical',
    '  status: draft',
    'custom_ns:',
    '  kept: true',
    'occurrences:',
    '  - id: occ-001',
    '    entity: ent-001',
    '    role: evidence',
    'sources: []',
    'sections:',
    '  - id: sec-001',
    '    occurrences:',
    '      - occ-001',
    '',
  ].join('\n');
  const result = formatDocument(shuffled, { canonical: true, info: true });
  assert.strictEqual(result.ok, true);
  const keys = Object.keys(YAML.parse(result.output));
  assert.deepStrictEqual(keys, ['meta', 'sources', 'sections', 'occurrences', 'entities', 'custom_ns']);
  assert.deepStrictEqual(YAML.parse(result.output), YAML.parse(shuffled));
  assert.ok(result.diagnostics.some((d) => d.code === 'canonical_reordered'));
});

test('canonical: contract order covers required namespaces first', () => {
  assert.deepStrictEqual(
    CANONICAL_ORDER.slice(0, 5),
    ['meta', 'sources', 'sections', 'occurrences', 'entities']
  );
});

test('canonical: preserves comments while reordering', () => {
  const text = [
    'entities: # entity list',
    '  - id: ent-001',
    '    content: Reusable material.',
    'meta:',
    '  spec_version: ideamark-core-v1.2.0',
    '  document_id: fx-canonical-comments',
    '  status: draft',
    'sources: []',
    'sections: []',
    'occurrences: []',
    '',
  ].join('\n');
  const result = formatDocument(text, { canonical: true });
  assert.match(result.output, /# entity list/);
  assert.deepStrictEqual(YAML.parse(result.output), YAML.parse(text));
});

test('format refuses multi-document streams instead of dropping documents', () => {
  const text = 'meta:\n  a: 1\n---\nmeta:\n  a: 2\n';
  const result = formatDocument(text);
  assert.strictEqual(result.ok, false);
  assert.strictEqual(result.output, null);
  const err = result.diagnostics.find((d) => d.code === 'yaml_restricted_feature' && d.severity === 'error');
  assert.match(err.message, /multi-document/);
});

test('format refuses unloadable input (legacy, parse error)', () => {
  const legacy = readFixture('invalid', 'err-legacy_document_detected.ideamark.yaml');
  const r1 = formatDocument(legacy);
  assert.strictEqual(r1.ok, false);
  assert.ok(r1.diagnostics.some((d) => d.code === 'legacy_document_detected'));

  const r2 = formatDocument('meta: [unclosed\n');
  assert.strictEqual(r2.ok, false);
  assert.ok(r2.diagnostics.some((d) => d.code === 'yaml_parse_error'));
});
