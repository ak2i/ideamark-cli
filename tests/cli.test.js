const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const binPath = path.join(repoRoot, 'bin', 'ideamark.js');
const fixturesDir = path.join(repoRoot, 'docs', 'dev', 'v0.1.0', 'examples', 'fixtures');
const expectedDir = path.join(__dirname, 'expected');

function runCli(args, options = {}) {
  const result = spawnSync('node', [binPath, ...args], {
    encoding: 'utf8',
    input: options.stdin || null
  });
  return result;
}

function readExpected(name) {
  return fs.readFileSync(path.join(expectedDir, name), 'utf8');
}

test('extract sections md', () => {
  const fixture = path.join(fixturesDir, 'fixture.min.ideamark.md');
  const result = runCli([
    'extract',
    'sections',
    '--input',
    fixture,
    '--select',
    'view=rules domain~=flowmark,guides',
    '--format',
    'md'
  ]);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, readExpected('extract.rules.md'));
});

test('extract sections json', () => {
  const fixture = path.join(fixturesDir, 'fixture.min.ideamark.md');
  const result = runCli([
    'extract',
    'sections',
    '--input',
    fixture,
    '--select',
    'view=rules domain~=flowmark,guides',
    '--format',
    'json'
  ]);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, readExpected('extract.rules.json'));
});

test('compose md with provenance', () => {
  const fixture = path.join(fixturesDir, 'fixture.min.ideamark.md');
  const result = runCli([
    'compose',
    '--inputs',
    fixture,
    '--select',
    'view=background view=rules',
    '--with-provenance',
    '--provenance-style',
    'frontmatter',
    '--format',
    'md'
  ]);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, readExpected('compose.provenance.md'));
});

test('compose json', () => {
  const fixture = path.join(fixturesDir, 'fixture.min.ideamark.md');
  const result = runCli([
    'compose',
    '--inputs',
    fixture,
    '--select',
    'view=background view=rules',
    '--with-provenance',
    '--provenance-style',
    'frontmatter',
    '--format',
    'json'
  ]);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, readExpected('compose.provenance.json'));
});

test('describe md', () => {
  const fixture = path.join(fixturesDir, 'fixture.min.ideamark.md');
  const result = runCli([
    'describe',
    '--inputs',
    fixture,
    '--select',
    'view=background view=rules',
    '--goal',
    'guides.flowmark',
    '--format',
    'md'
  ]);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, readExpected('describe.guides.flowmark.md'));
});

test('describe json', () => {
  const fixture = path.join(fixturesDir, 'fixture.min.ideamark.md');
  const result = runCli([
    'describe',
    '--inputs',
    fixture,
    '--select',
    'view=background view=rules',
    '--goal',
    'guides.flowmark',
    '--format',
    'json'
  ]);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, readExpected('describe.guides.flowmark.json'));
});

test('validate broken yaml fails', () => {
  const fixture = path.join(fixturesDir, 'fixture.broken_yaml.ideamark.md');
  const result = runCli(['validate', '--input', fixture]);
  assert.equal(result.status, 2);
  const parsed = JSON.parse(result.stdout);
  assert.ok(parsed.errors.length > 0);
});
