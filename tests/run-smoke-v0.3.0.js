#!/usr/bin/env node
const assert = require('node:assert');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const cli = path.join(root, 'bin', 'ideamark.js');
const valid = path.join(root, 'tests', 'fixtures', 'v1.2.0', 'valid', 'heapq-api-design.ideamark.yaml');
const legacy = path.join(root, 'tests', 'fixtures', 'v1.1.1', 'valid', 'minimal-body.ideamark.md');

function run(args, input) {
  return spawnSync(process.execPath, [cli, ...args], {
    cwd: root,
    input,
    encoding: 'utf8',
  });
}

let res = run(['--version', '--format', 'json']);
assert.strictEqual(res.status, 0, res.stderr);
assert.strictEqual(JSON.parse(res.stdout).document_spec.version, 'ideamark-core-v1.2.0');

res = run(['validate', valid]);
assert.strictEqual(res.status, 0, res.stdout + res.stderr);
assert.match(res.stdout, /"type":"summary"/);

res = run(['format', valid]);
assert.strictEqual(res.status, 0, res.stderr);
assert.match(res.stdout, /spec_version: ideamark-core-v1.2.0/);

res = run(['ls', valid, '--sources', '--vocab', '--format', 'json']);
assert.strictEqual(res.status, 0, res.stderr);
const listed = JSON.parse(res.stdout);
assert.ok(Array.isArray(listed.sources));
assert.ok(listed.vocab['source.type'].includes('code_file'));

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ideamark-v030-'));
const migrated = path.join(tmp, 'migrated.ideamark.yaml');
res = run(['migrate', legacy, '-o', migrated]);
assert.strictEqual(res.status, 0, res.stderr);
res = run(['validate', migrated]);
assert.strictEqual(res.status, 0, res.stdout + res.stderr);

res = run(['describe', 'capabilities', '--format', 'json']);
assert.strictEqual(res.status, 0, res.stderr);
assert.strictEqual(JSON.parse(res.stdout).document.version, 'ideamark-core-v1.2.0');

console.log('v0.3.0 smoke ok');
