const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { tempDir, writeTempFile } = require('./helpers');
const {
  parseArgs,
  renderPrompt,
  buildPromptBundle,
} = require('../../scripts/build-chatgpt-conversion-prompt');

test('chatgpt prompt script: parseArgs reads required options', () => {
  const parsed = parseArgs([
    '--source',
    'in.txt',
    '--output',
    'out.md',
    '--lang',
    'en-US',
    '--target-file',
    'doc.ideamark.yaml',
  ]);
  assert.strictEqual(parsed.source, 'in.txt');
  assert.strictEqual(parsed.output, 'out.md');
  assert.strictEqual(parsed.lang, 'en-US');
  assert.strictEqual(parsed.targetFile, 'doc.ideamark.yaml');
});

test('chatgpt prompt script: renderPrompt replaces placeholders', () => {
  const rendered = renderPrompt('A {{x}} B {{y}}', { x: '1', y: '2' });
  assert.strictEqual(rendered, 'A 1 B 2');
});

test('chatgpt prompt script: buildPromptBundle produces prompt and artifacts', () => {
  const dir = tempDir();
  const source = writeTempFile(dir, 'source.txt', 'Sample source text');
  const bundle = buildPromptBundle({
    source,
    output: path.join(dir, 'prompt.md'),
    lang: 'ja-JP',
    targetFile: 'output.ideamark.yaml',
  });

  assert.match(bundle.prompt, /IdeaMark v1\.1\.1 YAML/);
  assert.match(bundle.prompt, /Sample source text/);
  assert.match(bundle.prompt, /output\.ideamark\.yaml/);
  assert.ok(bundle.describeOutputs['describe.prompt-authoring.json']);
  assert.ok(bundle.describeOutputs['describe.ai-authoring.json']);
  assert.ok(bundle.describeOutputs['describe.params.json']);
  assert.ok(bundle.describeOutputs['describe.checklist.md']);
  assert.ok(bundle.describeOutputs['describe.vocab.md']);
});
