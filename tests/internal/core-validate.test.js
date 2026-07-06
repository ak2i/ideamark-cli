const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const { loadDocument } = require('../../src/core/load');
const { validateDocument } = require('../../src/core/validate');

const FIXTURES = path.join(__dirname, '..', 'fixtures', 'v1.2.0');

function validateFile(file, options) {
  const text = fs.readFileSync(file, 'utf8');
  return validateDocument(loadDocument(text), options);
}

function listFixtures(dir) {
  return fs.readdirSync(path.join(FIXTURES, dir)).filter((f) => f.endsWith('.ideamark.yaml'));
}

// Filename convention: <sev>-<code>[--<variant>].ideamark.yaml
function expectedCode(name) {
  const m = name.replace(/\.ideamark\.yaml$/, '').match(/^(err|warn)-([a-z0-9_]+)(--.+)?$/);
  assert.ok(m, `fixture name does not follow convention: ${name}`);
  return m[2];
}

test('conformance: Part 4 samples are valid in core mode (0 errors, 0 warnings)', () => {
  for (const name of listFixtures('valid')) {
    const result = validateFile(path.join(FIXTURES, 'valid', name), { mode: 'core' });
    const errors = result.diagnostics.filter((d) => d.severity === 'error');
    const warnings = result.diagnostics.filter((d) => d.severity === 'warning');
    assert.deepStrictEqual(errors, [], `${name}: unexpected errors: ${JSON.stringify(errors, null, 2)}`);
    assert.deepStrictEqual(warnings, [], `${name}: unexpected warnings: ${JSON.stringify(warnings, null, 2)}`);
    assert.strictEqual(result.ok, true);
  }
});

test('conformance: Part 4 samples info codes match expected-diagnostics manifest', () => {
  const allowed = new Set(['anchor_precision_note', 'id_prefix_unconventional', 'source_unreferenced', 'empty_namespace', 'undeclared_extension']);
  const expectedDefaults = new Set(['anchor_precision_note', 'id_prefix_unconventional']);
  for (const name of listFixtures('valid')) {
    const result = validateFile(path.join(FIXTURES, 'valid', name), { mode: 'core', info: true });
    const infoCodes = new Set(result.diagnostics.filter((d) => d.severity === 'info').map((d) => d.code));
    for (const code of infoCodes) {
      assert.ok(allowed.has(code), `${name}: unexpected info code ${code}`);
    }
    for (const code of expectedDefaults) {
      assert.ok(infoCodes.has(code), `${name}: expected info code ${code} not observed`);
    }
  }
});

test('conformance: Part 4 samples are also clean in strict mode', () => {
  for (const name of listFixtures('valid')) {
    const result = validateFile(path.join(FIXTURES, 'valid', name), { mode: 'strict' });
    const errors = result.diagnostics.filter((d) => d.severity === 'error');
    assert.deepStrictEqual(errors, [], `${name}: strict-mode errors: ${JSON.stringify(errors, null, 2)}`);
  }
});

test('minimal valid document (Part 4 §1.7) is accepted in core mode', () => {
  const text = [
    'meta:',
    '  spec_version: ideamark-core-v1.2.0',
    '  document_id: example-minimal',
    '  status: draft',
    'sources: []',
    'sections: []',
    'occurrences: []',
    'entities: []',
    '',
  ].join('\n');
  const result = validateDocument(loadDocument(text), { mode: 'core' });
  assert.strictEqual(result.ok, true);
  assert.deepStrictEqual(result.diagnostics, []);

  const withInfo = validateDocument(loadDocument(text), { mode: 'core', info: true });
  const codes = withInfo.diagnostics.map((d) => d.code);
  assert.deepStrictEqual([...new Set(codes)], ['empty_namespace']);
});

test('invalid corpus: each fixture produces its expected error code', () => {
  for (const name of listFixtures('invalid')) {
    const code = expectedCode(name);
    const result = validateFile(path.join(FIXTURES, 'invalid', name), { mode: 'core' });
    const errorCodes = result.diagnostics.filter((d) => d.severity === 'error').map((d) => d.code);
    assert.ok(errorCodes.includes(code), `${name}: expected error ${code}, got ${JSON.stringify(errorCodes)}`);
    assert.strictEqual(result.ok, false, `${name}: ok should be false`);
  }
});

test('warnings corpus: each fixture produces its expected warning code and no errors', () => {
  for (const name of listFixtures('warnings')) {
    const code = expectedCode(name);
    const result = validateFile(path.join(FIXTURES, 'warnings', name), { mode: 'core' });
    const errors = result.diagnostics.filter((d) => d.severity === 'error');
    const warningCodes = result.diagnostics.filter((d) => d.severity === 'warning').map((d) => d.code);
    assert.deepStrictEqual(errors, [], `${name}: unexpected errors: ${JSON.stringify(errors, null, 2)}`);
    assert.ok(warningCodes.includes(code), `${name}: expected warning ${code}, got ${JSON.stringify(warningCodes)}`);
    assert.strictEqual(result.ok, true, `${name}: core mode ok should be true (warnings only)`);
  }
});

test('diagnostic envelope fields are present on every diagnostic', () => {
  const result = validateFile(path.join(FIXTURES, 'warnings', 'warn-placeholder_object--entity.ideamark.yaml'), { mode: 'core', info: true });
  for (const d of result.diagnostics) {
    assert.ok(['error', 'warning', 'info'].includes(d.severity));
    assert.ok(typeof d.code === 'string' && d.code.length > 0);
    assert.ok(typeof d.rule === 'string' && d.rule.length > 0, `rule missing for ${d.code}`);
    assert.ok(typeof d.message === 'string' && d.message.length > 0);
    assert.ok('path' in d && 'object_id' in d && 'field' in d);
  }
  const placeholder = result.diagnostics.find((d) => d.code === 'placeholder_object');
  assert.strictEqual(placeholder.object_id, 'ent-002');
  assert.strictEqual(placeholder.path, 'entities[1]');
  assert.match(placeholder.message, /status: draft/);
});

test('strict mode promotes the D8 set (placeholder example)', () => {
  const file = path.join(FIXTURES, 'warnings', 'warn-placeholder_object--entity.ideamark.yaml');
  const core = validateFile(file, { mode: 'core' });
  assert.strictEqual(core.ok, true);
  const strict = validateFile(file, { mode: 'strict' });
  assert.strictEqual(strict.ok, false);
  const promoted = strict.diagnostics.find((d) => d.code === 'placeholder_object');
  assert.strictEqual(promoted.severity, 'error');
  // Referential hygiene warnings stay warnings in strict (checklist §11).
  const hygiene = strict.diagnostics.find((d) => d.code === 'entity_unreferenced');
  assert.strictEqual(hygiene.severity, 'warning');
});

test('--allow-unsupported-spec downgrades spec_version_unsupported (D7)', () => {
  const file = path.join(FIXTURES, 'invalid', 'err-spec_version_unsupported.ideamark.yaml');
  const strictDefault = validateFile(file, { mode: 'core' });
  assert.strictEqual(strictDefault.ok, false);
  const allowed = validateFile(file, { mode: 'core', allowUnsupportedSpec: true });
  assert.strictEqual(allowed.ok, true);
  const diag = allowed.diagnostics.find((d) => d.code === 'spec_version_unsupported');
  assert.strictEqual(diag.severity, 'warning');
});

test('legacy v1.1.x input produces an actionable migrate error', () => {
  const result = validateFile(path.join(FIXTURES, 'invalid', 'err-legacy_document_detected.ideamark.yaml'), { mode: 'core' });
  assert.strictEqual(result.ok, false);
  const diag = result.diagnostics.find((d) => d.code === 'legacy_document_detected');
  assert.match(diag.message, /ideamark migrate/);
});
