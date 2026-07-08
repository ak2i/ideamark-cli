const test = require('node:test');
const assert = require('node:assert');
const { describe } = require('../../src/describe');

test('describe: capabilities json', () => {
  const res = describe('capabilities', 'json', {});
  const payload = JSON.parse(res.output);
  assert.strictEqual(payload.contract.version, '1.2.0-draft.2');
  assert.strictEqual(payload.document.version, 'ideamark-core-v1.2.0');
  assert.strictEqual(payload.document.representation, 'single-yaml-mapping');
  assert.ok(payload.commands.describe.topics.includes('ls'));
  assert.ok(payload.commands.describe.topics.includes('routing'));
  assert.ok(payload.commands.describe.topics.includes('prompt-authoring'));
  assert.strictEqual(payload.features.routing.supported, true);
  assert.strictEqual(payload.features.skeletons.basic_validation, true);
  assert.ok(payload.commands.lint);
  assert.ok(payload.commands.diff);
});

test('describe: checklist yaml', () => {
  const res = describe('checklist', 'yaml', {});
  assert.match(res.output, /header_required/);
});

test('describe: vocab md', () => {
  const res = describe('vocab', 'md', {});
  assert.match(res.output, /atomicity_basis/);
});

test('describe: unknown topic returns error', () => {
  const res = describe('unknown', 'md', {});
  assert.strictEqual(res.ok, false);
  assert.strictEqual(res.error, 'unknown_topic');
});

test('describe: default md for checklist', () => {
  const res = describe('checklist', 'md', {});
  assert.match(res.output, /strict checklist/);
});

test('describe: routing json', () => {
  const res = describe('routing', 'json', {});
  const payload = JSON.parse(res.output);
  assert.strictEqual(payload.topic, 'routing');
  assert.ok(Array.isArray(payload.source.section_ids));
  assert.ok(payload.source.section_ids.length > 0);
});

test('describe: ls guides with sections', () => {
  const res = describe('ls', 'json', { target: 'guides', sections: true, lang: 'en-US' });
  const payload = JSON.parse(res.output);
  assert.strictEqual(payload.target, 'guides');
  assert.ok(Array.isArray(payload.guides[0].sections));
  assert.ok(payload.guides[0].sections.some((s) => String(s.id).includes('SEC-IMK-SCOPE-BACKGROUND')));
});

test('describe: model requires ai audience', () => {
  const res = describe('capabilities', 'md', { audience: 'human', model: 'small' });
  assert.strictEqual(res.ok, false);
  assert.strictEqual(res.error, 'model_requires_ai');
});

test('describe: prompt-authoring md', () => {
  const res = describe('prompt-authoring', 'md', {});
  assert.match(res.output, /Prompt Authoring Guide/);
  assert.match(res.output, /Every occurrence must point to an existing entity/);
});

test('describe: prompt-authoring json includes reference mapping rules', () => {
  const res = describe('prompt-authoring', 'json', {});
  const payload = JSON.parse(res.output);
  assert.ok(payload.prompt_authoring.reference_mapping_rules);
  assert.ok(payload.prompt_authoring.reference_mapping_rules.local_reference_baseline);
  assert.ok(payload.prompt_authoring.reference_mapping_rules.template_extensions);
  assert.ok(payload.prompt_authoring.reference_mapping_rules.external_reference_baseline);
});
