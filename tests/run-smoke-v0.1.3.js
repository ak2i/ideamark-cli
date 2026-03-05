#!/usr/bin/env node
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const root = process.cwd();
const cli = path.join(root, 'bin', 'ideamark.js');

function run(args, input) {
  try {
    const stdout = execFileSync(process.execPath, [cli, ...args], {
      cwd: root,
      encoding: 'utf8',
      input: input || undefined,
    });
    return { status: 0, stdout: stdout || '', stderr: '' };
  } catch (err) {
    return {
      status: typeof err.status === 'number' ? err.status : 1,
      stdout: err.stdout ? String(err.stdout) : '',
      stderr: err.stderr ? String(err.stderr) : '',
    };
  }
}

function assert(cond, message) {
  if (!cond) throw new Error(message);
}

function parseNdjson(text) {
  return text
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)
    .map((line) => JSON.parse(line));
}

function makeDoc() {
  return [
    '---',
    'ideamark_version: 1',
    'doc_id: "DOC-SMOKE"',
    'doc_type: "derived"',
    'status:',
    '  state: "in_progress"',
    'created_at: "2026-03-04"',
    'updated_at: "2026-03-04"',
    'lang: "en-US"',
    '---',
    '',
    '## SEC-1',
    '```yaml',
    'section_id: "SEC-1"',
    'anchorage:',
    '  view: "background"',
    '  phase: "confirmed"',
    '  domain: ["smoke", "routing"]',
    'occurrences: ["OCC-1"]',
    '```',
    '',
    '## Registry',
    '```yaml',
    'entities:',
    '  IE-1:',
    '    kind: "observation"',
    '    content: "smoke"',
    'occurrences:',
    '  OCC-1:',
    '    entity: "IE-1"',
    '    role: "observation"',
    'sections:',
    '  SEC-1:',
    '    anchorage: { view: "background", phase: "confirmed", domain: ["smoke", "routing"] }',
    '    occurrences: ["OCC-1"]',
    'structure:',
    '  sections: ["SEC-1"]',
    '```',
    '',
  ].join('\n');
}

function runSmoke() {
  const okDoc = makeDoc();

  // 1) lint normal path
  const lintOk = run(['lint', '--profile', 'diagnostic'], okDoc);
  assert(lintOk.status === 0, 'lint normal should exit 0');
  const lintRows = parseNdjson(lintOk.stdout);
  const lintSummary = lintRows.find((x) => x.type === 'summary');
  assert(lintSummary, 'lint summary missing');
  assert(lintSummary.error_count === 0, 'lint normal should have 0 errors');

  // 2) lint strict with broken input
  const lintNg = run(['lint', '--strict'], '# broken');
  assert(lintNg.status === 1, 'lint --strict should exit 1 on errors');

  // 3) diff expected changes
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ideamark-smoke-v013-'));
  const fromPath = path.join(tmp, 'from.md');
  const toPath = path.join(tmp, 'to.md');
  fs.writeFileSync(fromPath, okDoc, 'utf8');
  fs.writeFileSync(
    toPath,
    okDoc
      .replace('content: "smoke"', 'content: "smoke"\n  IE-2:\n    kind: "note"\n    content: "new"')
      .replace('role: "observation"', 'role: "decision"'),
    'utf8'
  );
  const diffRes = run(['diff', fromPath, toPath, '--format', 'json']);
  assert(diffRes.status === 0, 'diff should exit 0');
  const diffRows = JSON.parse(diffRes.stdout);
  assert(diffRows.some((r) => r.op === 'add' && String(r.path).includes('#/entities/IE-2')), 'diff add not found');
  assert(
    diffRows.some((r) => r.op === 'replace' && String(r.path).includes('#/occurrences/OCC-1/role')),
    'diff replace not found'
  );

  // 4) validate NDJSON order + abnormal case
  const valOk = run(['validate'], okDoc);
  assert(valOk.status === 0, 'validate normal should exit 0');
  const valRows = parseNdjson(valOk.stdout);
  assert(valRows.length >= 2, 'validate NDJSON too short');
  assert(valRows[0].type === 'meta', 'validate first record must be meta');
  assert(valRows[valRows.length - 1].type === 'summary', 'validate last record must be summary');

  const badRefDoc = okDoc.replace('entity: "IE-1"', 'entity: "IE-404"');
  const valNg = run(['validate', '--strict'], badRefDoc);
  assert(valNg.status === 1, 'validate strict on broken refs should exit 1');
  const badRows = parseNdjson(valNg.stdout);
  assert(badRows.some((x) => x.type === 'diagnostic' && x.code === 'entity_ref_valid'), 'expected ref diagnostic missing');

  fs.rmSync(tmp, { recursive: true, force: true });
}

try {
  runSmoke();
  process.stdout.write('v0.1.3 smoke passed\n');
  process.exit(0);
} catch (err) {
  process.stderr.write(`v0.1.3 smoke failed: ${err.message}\n`);
  process.exit(1);
}
