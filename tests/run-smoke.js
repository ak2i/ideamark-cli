#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = process.cwd();
const base = path.join(root, 'ideamark-tests-v0.9.13', 'tests');

function readFile(p) {
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
}

function run(args, input) {
  try {
    const stdout = execFileSync(process.execPath, [path.join('bin', 'ideamark.js'), ...args], {
      input: input || undefined,
      encoding: 'utf8',
    });
    return { stdout: stdout || '', stderr: '', status: 0 };
  } catch (err) {
    return {
      stdout: err.stdout ? err.stdout.toString() : '',
      stderr: err.stderr ? err.stderr.toString() : '',
      status: typeof err.status === 'number' ? err.status : 1,
    };
  }
}

function expectEqual(actual, goldenPath) {
  const expected = readFile(goldenPath);
  if (actual !== expected) {
    throw new Error(`Mismatch: ${goldenPath}`);
  }
}

function expectExit(status, goldenPath) {
  const expected = readFile(goldenPath).trim();
  const exp = expected ? Number(expected) : 0;
  if (status !== exp) {
    throw new Error(`Exit mismatch: ${goldenPath} expected ${exp} got ${status}`);
  }
}

function runCaseValidate() {
  const inFile = path.join(base, 'fixtures', 'validate', 'TC-VAL-SMOKE-001.in.ideamark.md');
  const res = run(['validate', inFile]);
  expectEqual(res.stdout, path.join(base, 'golden', 'validate', 'TC-VAL-SMOKE-001.stdout.ndjson'));
  expectExit(res.status, path.join(base, 'golden', 'validate', 'TC-VAL-SMOKE-001.exit.txt'));
}

function runCaseFormat() {
  const inFile = path.join(base, 'fixtures', 'format', 'TC-FMT-SMOKE-001.in.ideamark.md');
  const res = run(['format', inFile]);
  expectEqual(res.stdout, path.join(base, 'golden', 'format', 'TC-FMT-SMOKE-001.stdout.ideamark.md'));
  expectEqual(res.stderr, path.join(base, 'golden', 'format', 'TC-FMT-SMOKE-001.stderr.ndjson'));
  expectExit(res.status, path.join(base, 'golden', 'format', 'TC-FMT-SMOKE-001.exit.txt'));
}

function runCaseExtract() {
  const inFile = path.join(base, 'fixtures', 'extract', 'TC-EXT-SMOKE-001.in.ideamark.md');
  const res = run(['extract', inFile, '--section', 'SEC-A']);
  expectEqual(res.stdout, path.join(base, 'golden', 'extract', 'TC-EXT-SMOKE-001.stdout.ideamark.md'));
  expectEqual(res.stderr, path.join(base, 'golden', 'extract', 'TC-EXT-SMOKE-001.stderr.ndjson'));
  expectExit(res.status, path.join(base, 'golden', 'extract', 'TC-EXT-SMOKE-001.exit.txt'));
}

function runCaseCompose() {
  const dir = path.join(base, 'fixtures', 'compose', 'TC-COM-SMOKE-001');
  const args = readFile(path.join(dir, 'args.txt')).trim().split(/\s+/);
  const res = run(args);
  expectEqual(res.stdout, path.join(base, 'golden', 'compose', 'TC-COM-SMOKE-001.stdout.ideamark.md'));
  expectEqual(res.stderr, path.join(base, 'golden', 'compose', 'TC-COM-SMOKE-001.stderr.ndjson'));
  expectExit(res.status, path.join(base, 'golden', 'compose', 'TC-COM-SMOKE-001.exit.txt'));
}

function runCasePublish() {
  const inFile = path.join(base, 'fixtures', 'publish', 'TC-PUB-SMOKE-001.in.ideamark.md');
  const res = run(['publish', inFile]);
  expectEqual(res.stdout, path.join(base, 'golden', 'publish', 'TC-PUB-SMOKE-001.stdout.ideamark.md'));
  expectEqual(res.stderr, path.join(base, 'golden', 'publish', 'TC-PUB-SMOKE-001.stderr.ndjson'));
  expectExit(res.status, path.join(base, 'golden', 'publish', 'TC-PUB-SMOKE-001.exit.txt'));
}

function runCaseDescribe() {
  const args = readFile(path.join(base, 'fixtures', 'describe', 'TC-DES-SMOKE-001.args.txt')).trim().split(/\s+/);
  const res = run(args);
  expectEqual(res.stdout, path.join(base, 'golden', 'describe', 'TC-DES-SMOKE-001.stdout.json'));
  expectExit(res.status, path.join(base, 'golden', 'describe', 'TC-DES-SMOKE-001.exit.txt'));
}

function runCaseOps() {
  const input = readFile(path.join(base, 'fixtures', 'ops', 'TC-OPS-STDIN-001.in.ideamark.md'));
  const res = run(['validate', '-'], input);
  expectEqual(res.stdout, path.join(base, 'golden', 'ops', 'TC-OPS-STDIN-001.stdout.ndjson'));
  expectEqual(res.stderr, path.join(base, 'golden', 'ops', 'TC-OPS-STDIN-001.stderr.ndjson'));
  expectExit(res.status, path.join(base, 'golden', 'ops', 'TC-OPS-STDIN-001.exit.txt'));
}

function main() {
  runCaseValidate();
  runCaseFormat();
  runCaseExtract();
  runCaseCompose();
  runCasePublish();
  runCaseDescribe();
  runCaseOps();
  console.log('smoke ok');
}

try {
  main();
} catch (err) {
  console.error(err.message || err);
  process.exit(1);
}
