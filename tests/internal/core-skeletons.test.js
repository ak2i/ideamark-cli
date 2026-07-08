const test = require('node:test');
const assert = require('node:assert');
const { readFileSync } = require('node:fs');
const { loadDocument } = require('../../src/core/load');
const { validateDocument } = require('../../src/core/validate');
const { listDocument } = require('../../src/core/ls');

function loadFixture(path) {
  return loadDocument(readFileSync(path, 'utf8'));
}

test('skeletons: valid fixture has no warnings and ls summary is stable', () => {
  const loaded = loadFixture('tests/fixtures/v1.2.0/skeletons/valid/recipe-substitution.ideamark.yaml');
  const result = validateDocument(loaded);
  assert.strictEqual(result.summary.warnings, 0);
  const listed = JSON.parse(listDocument(loaded.data, { format: 'json', include: { skeletons: true } }).output);
  assert.deepStrictEqual(listed.skeletons, [{
    id: 'skel-recipe',
    role: 'retrieval',
    projection: 'projection://example/recipe-substitution/v1',
    nodes: 2,
    links: 1,
    unresolved_refs: 0,
    unresolved_link_endpoints: 0,
  }]);
});

test('skeletons: malformed fixture reports optional warnings', () => {
  const loaded = loadFixture('tests/fixtures/v1.2.0/skeletons/warnings/unresolved-endpoint.ideamark.yaml');
  const result = validateDocument(loaded);
  const codes = result.diagnostics.map((d) => d.code);
  assert.ok(codes.includes('skeleton_ref_unresolved'));
  assert.ok(codes.includes('skeleton_link_endpoint_unresolved'));
  assert.ok(codes.includes('skeleton_unknown_link_type'));
  assert.strictEqual(result.summary.errors, 0);
});
