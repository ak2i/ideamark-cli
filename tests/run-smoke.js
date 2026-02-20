#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { parseDocument } = require('../src/parser');
const { validateDocument } = require('../src/validate');

const root = process.cwd();
const base = path.join(root, 'docs', 'dev', 'v0.1.0', 'test-materials', 'v0.9.13', 'ideamark-tests-v0.9.13', 'tests');

function readFile(p) {
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
}

function parseNdjson(text) {
  return text
    .split(/\r?\n/)
    .filter((l) => l.trim().length > 0)
    .map((l) => JSON.parse(l));
}

function sortDiagnostics(diags) {
  const get = (d, k) => (d && d.location && d.location[k] ? String(d.location[k]) : '');
  return diags.slice().sort((a, b) => {
    const keys = [
      String(a.severity || '').localeCompare(String(b.severity || '')),
      String(a.code || '').localeCompare(String(b.code || '')),
      get(a, 'path').localeCompare(get(b, 'path')),
      get(a, 'id').localeCompare(get(b, 'id')),
    ];
    return keys.find((k) => k !== 0) || 0;
  });
}

function normalizeDiagnostic(d) {
  const out = {
    severity: d.severity,
    code: d.code,
  };
  if (d.location && (d.location.path || d.location.id)) {
    out.location = {};
    if (d.location.path) out.location.path = d.location.path;
    if (d.location.id) out.location.id = d.location.id;
  }
  return out;
}

function compareNdjson(actual, golden) {
  const a = parseNdjson(actual);
  const g = parseNdjson(golden);

  const group = (arr, type) => arr.filter((x) => x.type === type);
  const aMeta = group(a, 'meta');
  const gMeta = group(g, 'meta');
  if (gMeta.length > 0 && aMeta.length === 0) throw new Error('NDJSON meta missing');

  const aDiag = sortDiagnostics(group(a, 'diagnostic').map(normalizeDiagnostic));
  const gDiag = sortDiagnostics(group(g, 'diagnostic').map(normalizeDiagnostic));
  if (JSON.stringify(aDiag) !== JSON.stringify(gDiag)) {
    throw new Error('NDJSON diagnostics mismatch');
  }

  const aSum = group(a, 'summary');
  const gSum = group(g, 'summary');
  if (gSum.length > 0) {
    const ga = gSum[0];
    const aa = aSum[0];
    if (!aa) throw new Error('NDJSON summary missing');
    if (ga.ok !== undefined && aa.ok !== ga.ok) throw new Error('NDJSON summary ok mismatch');
    if (ga.error_count !== undefined && aa.error_count !== ga.error_count) {
      throw new Error('NDJSON summary error_count mismatch');
    }
  }
}

function run(args, input, opts) {
  try {
    const stdout = execFileSync(process.execPath, [path.join('bin', 'ideamark.js'), ...args], {
      input: input || undefined,
      encoding: 'utf8',
      cwd: opts && opts.cwd ? opts.cwd : undefined,
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

function expectNdjson(actual, goldenPath) {
  const expected = readFile(goldenPath);
  if (!expected.trim()) {
    if (actual !== expected) throw new Error(`Mismatch: ${goldenPath}`);
    return;
  }
  compareNdjson(actual, expected);
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
  compareNdjson(res.stdout, readFile(path.join(base, 'golden', 'validate', 'TC-VAL-SMOKE-001.stdout.ndjson')));
  expectExit(res.status, path.join(base, 'golden', 'validate', 'TC-VAL-SMOKE-001.exit.txt'));
}

function runCaseFormat() {
  const inFile = path.join(base, 'fixtures', 'format', 'TC-FMT-SMOKE-001.in.ideamark.md');
  const res = run(['format', inFile]);
  expectEqual(res.stdout, path.join(base, 'golden', 'format', 'TC-FMT-SMOKE-001.stdout.ideamark.md'));
  expectNdjson(res.stderr, path.join(base, 'golden', 'format', 'TC-FMT-SMOKE-001.stderr.ndjson'));
  expectExit(res.status, path.join(base, 'golden', 'format', 'TC-FMT-SMOKE-001.exit.txt'));
}

function runCaseExtract() {
  const inFile = path.join(base, 'fixtures', 'extract', 'TC-EXT-SMOKE-001.in.ideamark.md');
  const res = run(['extract', inFile, '--section', 'SEC-A']);
  expectEqual(res.stdout, path.join(base, 'golden', 'extract', 'TC-EXT-SMOKE-001.stdout.ideamark.md'));
  expectNdjson(res.stderr, path.join(base, 'golden', 'extract', 'TC-EXT-SMOKE-001.stderr.ndjson'));
  expectExit(res.status, path.join(base, 'golden', 'extract', 'TC-EXT-SMOKE-001.exit.txt'));
}

function runCaseCompose() {
  const dir = path.join(base, 'fixtures', 'compose', 'TC-COM-SMOKE-001');
  const args = readFile(path.join(dir, 'args.txt')).trim().split(/\s+/).map((a) => {
    if (a.endsWith('.ideamark.md') && !path.isAbsolute(a)) return path.join(dir, a);
    return a;
  });
  const res = run(args);
  expectEqual(res.stdout, path.join(base, 'golden', 'compose', 'TC-COM-SMOKE-001.stdout.ideamark.md'));
  expectNdjson(res.stderr, path.join(base, 'golden', 'compose', 'TC-COM-SMOKE-001.stderr.ndjson'));
  expectExit(res.status, path.join(base, 'golden', 'compose', 'TC-COM-SMOKE-001.exit.txt'));
}

function runCasePublish() {
  const inFile = path.join(base, 'fixtures', 'publish', 'TC-PUB-SMOKE-001.in.ideamark.md');
  const res = run(['publish', inFile]);
  expectEqual(res.stdout, path.join(base, 'golden', 'publish', 'TC-PUB-SMOKE-001.stdout.ideamark.md'));
  expectNdjson(res.stderr, path.join(base, 'golden', 'publish', 'TC-PUB-SMOKE-001.stderr.ndjson'));
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
  compareNdjson(res.stdout, readFile(path.join(base, 'golden', 'ops', 'TC-OPS-STDIN-001.stdout.ndjson')));
  expectNdjson(res.stderr, path.join(base, 'golden', 'ops', 'TC-OPS-STDIN-001.stderr.ndjson'));
  expectExit(res.status, path.join(base, 'golden', 'ops', 'TC-OPS-STDIN-001.exit.txt'));
}

function assertStrictValid(text) {
  const doc = parseDocument(text);
  const result = validateDocument(doc, { mode: 'strict' });
  if (!result.ok) throw new Error('strict validation failed');
  return doc;
}

function loadGoldenJson(relPath) {
  return JSON.parse(readFile(path.join(base, relPath)));
}

function findRenamedIdByAlias(map, alias) {
  for (const [id, def] of Object.entries(map || {})) {
    if (id !== alias && def && Array.isArray(def.aliases) && def.aliases.includes(alias)) return id;
  }
  return null;
}

function requireDiagnostics(actualNdjson, required) {
  const diags = parseNdjson(actualNdjson).filter((d) => d.type === 'diagnostic');
  const set = new Set(diags.map((d) => `${d.severity}:${d.code}`));
  for (const item of required) {
    if (!set.has(`${item.severity}:${item.code}`)) throw new Error(`missing diagnostic ${item.severity}:${item.code}`);
  }
}

function runCaseExtractSuccess() {
  const inFile = path.join(base, 'fixtures', 'extract', 'TC-EXT-SUCCESS-001.in.ideamark.md');
  const golden = loadGoldenJson('golden/extract/TC-EXT-SUCCESS-001.expect.json');
  const res = run(['extract', inFile, '--section', 'SEC-A']);
  if (res.status !== 0) throw new Error('extract success exit mismatch');
  if (res.stderr.trim()) throw new Error('extract success stderr not empty');
  const outDoc = assertStrictValid(res.stdout);
  const inDoc = parseDocument(readFile(inFile));
  if (outDoc.header.doc_id === inDoc.header.doc_id) throw new Error('extract doc_id not updated');
  if (!outDoc.registry.sections[golden.section_id]) throw new Error('extract missing section');
}

function runCaseComposeSuccess() {
  const dir = path.join(base, 'fixtures', 'compose', 'TC-COM-SUCCESS-001');
  const a = path.join(dir, 'A.ideamark.md');
  const b = path.join(dir, 'B.ideamark.md');
  const golden = loadGoldenJson('golden/compose/TC-COM-SUCCESS-001.expect.json');
  const res = run(['compose', a, b]);
  if (res.status !== 0) throw new Error('compose success exit mismatch');
  if (res.stderr.trim()) throw new Error('compose success stderr not empty');
  const outDoc = assertStrictValid(res.stdout);
  for (const id of golden.must_have_entities) {
    if (!outDoc.registry.entities[id]) throw new Error(`compose missing entity ${id}`);
  }
  const order = outDoc.registry.structure.sections || [];
  const first = order.indexOf(golden.structure_order[0]);
  const second = order.indexOf(golden.structure_order[1]);
  if (first === -1 || second === -1 || first > second) throw new Error('compose structure order mismatch');
}

function runCaseComposeConflictEnt() {
  const dir = path.join(base, 'fixtures', 'compose', 'TC-COM-CONFLICT-ENT-001');
  const a = path.join(dir, 'A.ideamark.md');
  const b = path.join(dir, 'B.ideamark.md');
  const golden = loadGoldenJson('golden/compose/TC-COM-CONFLICT-ENT-001.expect.json');
  const res = run(['compose', a, b]);
  if (res.status !== 0) throw new Error('compose conflict ent exit mismatch');
  if (res.stderr.trim()) throw new Error('compose conflict ent stderr not empty');
  const outDoc = assertStrictValid(res.stdout);
  const renamed = findRenamedIdByAlias(outDoc.registry.entities, golden.conflict_id);
  if (!renamed) throw new Error('entity rename alias missing');
  const occ = outDoc.registry.occurrences[golden.occurrence_id];
  if (!occ || occ.entity !== renamed) throw new Error('occurrence entity not retargeted');
}

function runCaseComposeConflictOcc() {
  const dir = path.join(base, 'fixtures', 'compose', 'TC-COM-CONFLICT-OCC-001');
  const a = path.join(dir, 'A.ideamark.md');
  const b = path.join(dir, 'B.ideamark.md');
  const golden = loadGoldenJson('golden/compose/TC-COM-CONFLICT-OCC-001.expect.json');
  const res = run(['compose', a, b]);
  if (res.status !== 0) throw new Error('compose conflict occ exit mismatch');
  if (res.stderr.trim()) throw new Error('compose conflict occ stderr not empty');
  const outDoc = assertStrictValid(res.stdout);
  const renamed = findRenamedIdByAlias(outDoc.registry.occurrences, golden.conflict_id);
  if (!renamed) throw new Error('occurrence rename alias missing');
  const sec = outDoc.registry.sections[golden.section_id];
  if (!sec || !Array.isArray(sec.occurrences) || !sec.occurrences.includes(renamed)) {
    throw new Error('section occurrences not retargeted');
  }
}

function runCaseComposeConflictSec() {
  const dir = path.join(base, 'fixtures', 'compose', 'TC-COM-CONFLICT-SEC-001');
  const a = path.join(dir, 'A.ideamark.md');
  const b = path.join(dir, 'B.ideamark.md');
  const golden = loadGoldenJson('golden/compose/TC-COM-CONFLICT-SEC-001.expect.json');
  const res = run(['compose', a, b]);
  if (res.status !== 0) throw new Error('compose conflict sec exit mismatch');
  if (res.stderr.trim()) throw new Error('compose conflict sec stderr not empty');
  const outDoc = assertStrictValid(res.stdout);
  const renamed = findRenamedIdByAlias(outDoc.registry.sections, golden.conflict_id);
  if (!renamed) throw new Error('section rename alias missing');
  const order = outDoc.registry.structure.sections || [];
  const first = order.indexOf(golden.conflict_id);
  const second = order.indexOf(renamed);
  if (first === -1 || second === -1 || first > second) throw new Error('structure order not preserved');
}

function runCasePublishSuccess() {
  const inFile = path.join(base, 'fixtures', 'publish', 'TC-PUB-SUCCESS-001.in.ideamark.md');
  const golden = loadGoldenJson('golden/publish/TC-PUB-SUCCESS-001.expect.json');
  const res = run(['publish', inFile]);
  if (res.status !== 0) throw new Error('publish success exit mismatch');
  if (res.stderr.trim()) throw new Error('publish success stderr not empty');
  const outDoc = assertStrictValid(res.stdout);
  if (!outDoc.header.status || outDoc.header.status.state !== 'published') throw new Error('publish status not updated');
  if (outDoc.header.updated_at === golden.original_updated_at) throw new Error('publish updated_at not changed');
  const ent = outDoc.registry.occurrences[golden.occurrence_id];
  if (!ent || typeof ent.entity !== 'string' || !ent.entity.startsWith('ideamark://')) {
    throw new Error('publish did not canonicalize entity ref');
  }
}

function runCaseFormatCanonSuccess() {
  const inFile = path.join(base, 'fixtures', 'format', 'TC-FMT-CANON-001.in.ideamark.md');
  const golden = loadGoldenJson('golden/format/TC-FMT-CANON-001.expect.json');
  const res = run(['format', inFile, '--canonical']);
  if (res.status !== 0) throw new Error('format canonical exit mismatch');
  if (res.stderr.trim()) throw new Error('format canonical stderr not empty');
  if (!res.stdout.includes(`ideamark://docs/${golden.doc_id}`)) throw new Error('format did not canonicalize refs');
  const res2 = run(['format', '-', '--canonical'], res.stdout);
  if (res.stdout !== res2.stdout) throw new Error('format canonical not idempotent');
}

function runCasePublishCanonCoverage() {
  const inFile = path.join(base, 'fixtures', 'publish', 'TC-PUB-CANON-COVERAGE-001.in.ideamark.md');
  const golden = loadGoldenJson('golden/publish/TC-PUB-CANON-COVERAGE-001.expect.json');
  const res = run(['publish', inFile]);
  if (res.status !== 0) throw new Error('publish canon coverage exit mismatch');
  if (res.stderr.trim()) throw new Error('publish canon coverage stderr not empty');
  const outDoc = assertStrictValid(res.stdout);
  const occ = outDoc.registry.occurrences[golden.occurrence_id];
  if (!occ) throw new Error('publish canon coverage missing occurrence');
  const prefix = `ideamark://docs/${outDoc.header.doc_id}#/`;
  const checks = [
    occ.entity,
    occ.target,
    Array.isArray(occ.supporting_evidence) ? occ.supporting_evidence[0] : null,
    occ.derived_from && occ.derived_from[0] ? occ.derived_from[0].entity : null,
  ].filter(Boolean);
  for (const ref of checks) {
    if (typeof ref !== 'string' || !ref.startsWith(prefix)) {
      throw new Error('publish canon coverage reference not canonicalized');
    }
  }
}

function runCaseComposeConflictMix() {
  const dir = path.join(base, 'fixtures', 'compose', 'TC-COM-CONFLICT-MIX-001');
  const a = path.join(dir, 'A.ideamark.md');
  const b = path.join(dir, 'B.ideamark.md');
  const golden = loadGoldenJson('golden/compose/TC-COM-CONFLICT-MIX-001.expect.json');
  const res = run(['compose', a, b]);
  if (res.status !== 0) throw new Error('compose conflict mix exit mismatch');
  if (res.stderr.trim()) throw new Error('compose conflict mix stderr not empty');
  const outDoc = assertStrictValid(res.stdout);
  const entRenamed = findRenamedIdByAlias(outDoc.registry.entities, golden.entity_id);
  const occRenamed = findRenamedIdByAlias(outDoc.registry.occurrences, golden.occurrence_id);
  const secRenamed = findRenamedIdByAlias(outDoc.registry.sections, golden.section_id);
  if (!entRenamed || !occRenamed || !secRenamed) throw new Error('mix rename alias missing');
  const occ = outDoc.registry.occurrences[occRenamed];
  if (!occ || occ.entity !== entRenamed) throw new Error('mix retarget entity failed');
  const sec = outDoc.registry.sections[secRenamed];
  if (!sec || !Array.isArray(sec.occurrences) || !sec.occurrences.includes(occRenamed)) {
    throw new Error('mix section occurrences not retargeted');
  }
  const order = outDoc.registry.structure.sections || [];
  if (!order.includes(golden.section_id) || !order.includes(secRenamed)) {
    throw new Error('mix structure missing sections');
  }
}

function runCaseExtractClosure() {
  const inFile = path.join(base, 'fixtures', 'extract', 'TC-EXT-CLOSURE-001.in.ideamark.md');
  const golden = loadGoldenJson('golden/extract/TC-EXT-CLOSURE-001.expect.json');
  const res = run(['extract', inFile, '--section', golden.section_id]);
  if (res.status !== 0) throw new Error('extract closure exit mismatch');
  if (res.stderr.trim()) throw new Error('extract closure stderr not empty');
  const outDoc = assertStrictValid(res.stdout);
  for (const id of golden.entities) {
    if (!outDoc.registry.entities[id]) throw new Error(`closure missing entity ${id}`);
  }
  for (const id of golden.occurrences) {
    if (!outDoc.registry.occurrences[id]) throw new Error(`closure missing occurrence ${id}`);
  }
}

function runCaseExtractRelations() {
  const inFile = path.join(base, 'fixtures', 'extract', 'TC-EXT-RELATIONS-001.in.ideamark.md');
  const golden = loadGoldenJson('golden/extract/TC-EXT-RELATIONS-001.expect.json');
  const res = run(['extract', inFile, '--section', golden.section_id]);
  if (res.status !== 0) throw new Error('extract relations exit mismatch');
  if (res.stderr.trim()) throw new Error('extract relations stderr not empty');
  const outDoc = assertStrictValid(res.stdout);
  if (Array.isArray(outDoc.registry.relations) && outDoc.registry.relations.length > 0) {
    throw new Error('relations should not be included');
  }
  for (const id of golden.forbidden_entities) {
    if (outDoc.registry.entities[id]) throw new Error(`unexpected entity ${id}`);
  }
}

function runCasePublishStrictFail() {
  const inFile = path.join(base, 'fixtures', 'publish', 'TC-PUB-STRICT-FAIL-001.in.ideamark.md');
  const golden = loadGoldenJson('golden/publish/TC-PUB-STRICT-FAIL-001.expect.json');
  const res = run(['publish', inFile]);
  if (res.status !== 1) throw new Error('publish strict fail exit mismatch');
  if (res.stdout.trim()) throw new Error('publish strict fail stdout not empty');
  requireDiagnostics(res.stderr, golden.required_diagnostics);
}

function main() {
  runCaseValidate();
  runCaseFormat();
  runCaseExtract();
  runCaseCompose();
  runCasePublish();
  runCaseDescribe();
  runCaseOps();
  runCaseExtractSuccess();
  runCaseComposeSuccess();
  runCasePublishSuccess();
  runCaseFormatCanonSuccess();
  runCasePublishCanonCoverage();
  runCaseComposeConflictEnt();
  runCaseComposeConflictOcc();
  runCaseComposeConflictSec();
  runCaseComposeConflictMix();
  runCaseExtractClosure();
  runCaseExtractRelations();
  runCasePublishStrictFail();
  console.log('smoke ok');
}

try {
  main();
} catch (err) {
  console.error(err.message || err);
  process.exit(1);
}
