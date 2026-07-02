// Reference-corpus regression tests for Core Constraints v1.1.1 §7.15.
// Every error class has at least one failing fixture; every warning class has
// a fixture proving it stays a warning (exit 0 without --fail-on-warn).
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { runCli } = require('./helpers');

const CORPUS = path.join('tests', 'fixtures', 'v1.1.1');

function readFixture(rel) {
  return fs.readFileSync(path.join(CORPUS, rel), 'utf8');
}

function parseNdjson(text) {
  return text
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)
    .map((line) => JSON.parse(line));
}

function run(rel, extraArgs = []) {
  const res = runCli(['validate', '--strict', ...extraArgs], readFixture(rel));
  const records = parseNdjson(res.stdout);
  return {
    status: res.status,
    diagnostics: records.filter((r) => r.type === 'diagnostic'),
    summary: records.find((r) => r.type === 'summary'),
  };
}

// ---- valid corpus -----------------------------------------------------

const VALID = fs.readdirSync(path.join(CORPUS, 'valid')).filter((f) => f.endsWith('.md'));

for (const file of VALID) {
  test(`corpus valid: ${file} passes strict validation without diagnostics`, () => {
    const { status, summary } = run(path.join('valid', file));
    assert.strictEqual(status, 0);
    assert.strictEqual(summary.error_count, 0);
    assert.strictEqual(summary.warning_count, 0);
  });
}

// ---- §7.15 errors ------------------------------------------------------

const ERROR_CASES = {
  'err-ref-occurrence-entity.ideamark.md': 'entity_ref_invalid',
  'err-ref-section-occurrence.ideamark.md': 'occurrence_ref_invalid',
  'err-ref-relation-from.ideamark.md': 'relation_from_invalid',
  'err-ref-relation-to.ideamark.md': 'relation_to_invalid',
  'err-dup-entity-id.ideamark.md': 'id_duplicate',
  'err-dup-occurrence-id.ideamark.md': 'id_duplicate',
  'err-dup-section-id.ideamark.md': 'id_duplicate',
  'err-dup-relation-id.ideamark.md': 'id_duplicate',
  'err-dup-perspective-id.ideamark.md': 'id_duplicate',
  'err-missing-occurrence-entity.ideamark.md': 'occurrence_entity_required',
  'err-missing-occurrence-role.ideamark.md': 'occurrence_role_required',
  'err-empty-section-occurrences.ideamark.md': 'section_occurrences_required',
  'err-missing-payload.ideamark.md': 'payload_required',
  'err-empty-payload.ideamark.md': 'payload_content_required',
  'err-ref-without-uri.ideamark.md': 'payload_ref_uri_required',
};

const DUP_SCOPES = {
  'err-dup-entity-id.ideamark.md': 'entity',
  'err-dup-occurrence-id.ideamark.md': 'occurrence',
  'err-dup-section-id.ideamark.md': 'section',
  'err-dup-relation-id.ideamark.md': 'relation',
  'err-dup-perspective-id.ideamark.md': 'perspective',
};

for (const [file, code] of Object.entries(ERROR_CASES)) {
  test(`corpus error: ${file} -> ${code}`, () => {
    const { status, diagnostics } = run(path.join('invalid', file));
    assert.strictEqual(status, 1);
    const hit = diagnostics.find(
      (d) => d.code === code && (!DUP_SCOPES[file] || d.location.scope === DUP_SCOPES[file])
    );
    assert.ok(hit, `expected ${code} in ${JSON.stringify(diagnostics)}`);
    assert.strictEqual(hit.severity, 'error');
  });
}

// ---- §7.15 warnings (must NOT be errors) --------------------------------

const WARNING_CASES = {
  'warn-missing-media-type.ideamark.md': 'payload_media_type_missing',
  'warn-missing-captured-at.ideamark.md': 'payload_captured_at_missing',
  'warn-unused-entity.ideamark.md': 'entity_unused',
  'warn-unused-section.ideamark.md': 'section_unused',
  'warn-ambiguous-relation-ref.ideamark.md': 'relation_ref_ambiguous',
};

for (const [file, code] of Object.entries(WARNING_CASES)) {
  test(`corpus warning: ${file} -> ${code} stays a warning`, () => {
    const { status, diagnostics, summary } = run(path.join('invalid', file));
    assert.strictEqual(status, 0, 'warnings must not fail validation');
    assert.strictEqual(summary.error_count, 0);
    const hit = diagnostics.find((d) => d.code === code);
    assert.ok(hit, `expected ${code} in ${JSON.stringify(diagnostics)}`);
    assert.strictEqual(hit.severity, 'warning');
  });

  test(`corpus warning: ${file} fails only with --fail-on-warn`, () => {
    const { status } = run(path.join('invalid', file), ['--fail-on-warn']);
    assert.strictEqual(status, 1);
  });
}
