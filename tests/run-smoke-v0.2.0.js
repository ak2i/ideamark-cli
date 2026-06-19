#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { parseDocument } = require('../src/parser');
const { validateDocument } = require('../src/validate');
const { lintDocument } = require('../src/lint');
const { extractDocument } = require('../src/extract');
const { composeDocuments } = require('../src/compose');
const { buildDescribeContext, describe } = require('../src/describe');
const { listDocument } = require('../src/ls');
const { publishDocument } = require('../src/publish');

const root = process.cwd();
const fixtures = path.join(root, 'tests', 'fixtures', 'v1.1.1');

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function readFixture(name) {
  return fs.readFileSync(path.join(fixtures, name), 'utf8');
}

function parseFixture(name) {
  return parseDocument(readFixture(name));
}

function runValidateCases() {
  const valid = validateDocument(parseFixture('minimal-valid.ideamark.yaml'), { mode: 'strict' });
  assert(valid.ok === true, 'minimal-valid should strict-validate');

  const invalid = validateDocument(parseFixture('empty-payload.ideamark.yaml'), { mode: 'strict' });
  assert(invalid.ok === false, 'empty-payload should fail strict validate');
  assert(
    invalid.diagnostics.some((x) => x.code === 'entity_payload_content_required'),
    'empty-payload diagnostic missing'
  );
}

function runLintCase() {
  const result = lintDocument(parseFixture('broken-ref.ideamark.yaml'), { profile: 'diagnostic', strict: false });
  assert(
    result.diagnostics.some((x) => x.code === 'IM-LINT-004'),
    'lint broken-ref diagnostic missing'
  );
}

function runExtractCase() {
  const input = parseFixture('minimal-valid.ideamark.yaml');
  const result = extractDocument(input, { sectionId: 'SEC-1' });
  assert(result.ok === true, 'extract should succeed');
  const outDoc = parseDocument(result.output);
  const validated = validateDocument(outDoc, { mode: 'strict' });
  assert(validated.ok === true, 'extract output should strict-validate');
}

function runComposeCase() {
  const a = parseFixture('minimal-valid.ideamark.yaml');
  const b = parseFixture('payload-ref-only.ideamark.yaml');
  const result = composeDocuments([a, b], {});
  assert(result.ok === true, 'compose should succeed');
  const outDoc = parseDocument(result.output);
  const validated = validateDocument(outDoc, { mode: 'strict' });
  assert(validated.ok === true, 'compose output should strict-validate');
  assert(outDoc.registry.relations && !Array.isArray(outDoc.registry.relations), 'relations should be a mapping');
  assert(outDoc.registry.perspectives && !Array.isArray(outDoc.registry.perspectives), 'perspectives should be a mapping');

  const noStructureA = parseDocument(readFixture('minimal-valid.ideamark.yaml').replace('structure:\n  sections: ["SEC-1"]\n', ''));
  const noStructureB = parseDocument(
    readFixture('payload-ref-only.ideamark.yaml')
      .replace('structure:\n  sections: ["SEC-1"]\n', '')
      .replace(/SEC-1/g, 'SEC-2')
      .replace(/OCC-1/g, 'OCC-2')
      .replace(/IE-1/g, 'IE-2')
      .replace('doc_id: "DOC-V111-REF"', 'doc_id: "DOC-V111-REF-2"')
  );
  const fallbackResult = composeDocuments([noStructureA, noStructureB], {});
  assert(fallbackResult.ok === true, 'compose fallback without structure should succeed');
  assert(fallbackResult.output.includes('SEC-2'), 'compose fallback should include registry-only section');
}

function runDescribeCase() {
  const contextResult = buildDescribeContext('json', {});
  assert(contextResult.ok === true, 'describe context should build');
  const result = describe('capabilities', 'json', {});
  assert(result.ok === true, 'describe capabilities should succeed');
  const payload = JSON.parse(result.output);
  assert(payload.contract.version === '1.1.1', 'capabilities contract version should be 1.1.1');
}

function runLsCase() {
  const doc = parseFixture('minimal-valid.ideamark.yaml');
  const result = listDocument(doc, {
    format: 'json',
    include: { sections: true, occurrences: true, entities: true, vocab: true },
  });
  assert(result.ok === true, 'ls should succeed');
  const payload = JSON.parse(result.output);
  assert(Array.isArray(payload.vocab['occurrence.role']), 'ls occurrence.role vocab missing');
  assert(Array.isArray(payload.vocab['entity.atomicity_basis']), 'ls entity.atomicity_basis vocab missing');
  assert(Array.isArray(payload.vocab['payload.format.media_type']), 'ls payload.format.media_type vocab missing');
}

function runPublishCase() {
  const result = publishDocument(readFixture('minimal-valid.ideamark.yaml'));
  assert(result.ok === true, 'publish should succeed');
  assert(/updated_at: \d{4}-\d{2}-\d{2}T/.test(result.output), 'publish should emit timestamp updated_at');
  assert(result.output.includes('state: published'), 'publish should set published state');
}

function main() {
  runValidateCases();
  runLintCase();
  runExtractCase();
  runComposeCase();
  runDescribeCase();
  runLsCase();
  runPublishCase();
  process.stdout.write('v0.2.0 smoke passed\n');
}

main();
