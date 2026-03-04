#!/usr/bin/env node
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const root = process.cwd();
const cli = path.join(root, 'bin', 'ideamark.js');

function runCli(args, input) {
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

function parseNdjson(text) {
  return text
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)
    .map((line) => JSON.parse(line));
}

function makeLongDoc(docId, withBrokenRef) {
  const refEntity = withBrokenRef ? 'IE-404' : 'IE-2';
  return [
    '---',
    'ideamark_version: 1',
    `doc_id: "${docId}"`,
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
    '  domain: ["llm", "scenario"]',
    'occurrences: ["OCC-1"]',
    '```',
    '',
    '## SEC-2',
    '```yaml',
    'section_id: "SEC-2"',
    'anchorage:',
    '  view: "solution"',
    '  phase: "confirmed"',
    '  domain: ["llm", "scenario"]',
    'occurrences: ["OCC-2"]',
    '```',
    '',
    '## Registry',
    '```yaml',
    'entities:',
    '  IE-1:',
    '    kind: "observation"',
    '    content: "Background context"',
    '  IE-2:',
    '    kind: "plan"',
    '    content: "Solution plan"',
    'occurrences:',
    '  OCC-1:',
    '    entity: "IE-1"',
    '    role: "observation"',
    '  OCC-2:',
    `    entity: "${refEntity}"`,
    '    role: "decision"',
    'sections:',
    '  SEC-1:',
    '    anchorage: { view: "background", phase: "confirmed", domain: ["llm", "scenario"] }',
    '    occurrences: ["OCC-1"]',
    '  SEC-2:',
    '    anchorage: { view: "solution", phase: "confirmed", domain: ["llm", "scenario"] }',
    '    occurrences: ["OCC-2"]',
    'structure:',
    '  sections: ["SEC-1", "SEC-2"]',
    '```',
    '',
  ].join('\n');
}

function collectAttemptMetrics(docText) {
  const lintRes = runCli(['lint', '--profile', 'diagnostic'], docText);
  const lintRows = parseNdjson(lintRes.stdout);
  const lintSummary = lintRows.find((x) => x.type === 'summary') || {
    error_count: 999,
    warning_count: 999,
  };

  const validateRes = runCli(['validate', '--strict'], docText);
  const validateRows = parseNdjson(validateRes.stdout);
  const validateSummary = validateRows.find((x) => x.type === 'summary') || {
    ok: false,
    error_count: 999,
  };

  const hasLintCode = (code) => lintRows.some((x) => x.type === 'diagnostic' && x.code === code);

  return {
    lint_exit: lintRes.status,
    validate_exit: validateRes.status,
    lint_error_count: lintSummary.error_count,
    lint_warning_count: lintSummary.warning_count,
    validate_ok: !!validateSummary.ok,
    yaml_parse_ok: !hasLintCode('IM-LINT-002'),
    id_unique_ok: !hasLintCode('IM-LINT-003'),
    refs_resolvable_ok: !hasLintCode('IM-LINT-004'),
  };
}

function runRoundTripScenario(docText, tmp) {
  const srcPath = path.join(tmp, 'source.md');
  fs.writeFileSync(srcPath, docText, 'utf8');

  const sec1 = path.join(tmp, 'sec1.md');
  const sec2 = path.join(tmp, 'sec2.md');

  // split
  const ex1 = runCli(['extract', srcPath, '--section', 'SEC-1']);
  const ex2 = runCli(['extract', srcPath, '--section', 'SEC-2']);
  if (ex1.status !== 0 || ex2.status !== 0) return { round_trip_ok: false, extract_ok: false };
  fs.writeFileSync(sec1, ex1.stdout, 'utf8');
  fs.writeFileSync(sec2, ex2.stdout, 'utf8');

  // refine
  const refined1 = ex1.stdout.replace('Background context', 'Background context (refined)');
  const refined2 = ex2.stdout.replace('Solution plan', 'Solution plan (refined)');
  fs.writeFileSync(sec1, refined1, 'utf8');
  fs.writeFileSync(sec2, refined2, 'utf8');

  // integrate
  const compose = runCli(['compose', sec1, sec2]);
  if (compose.status !== 0) return { round_trip_ok: false, extract_ok: false };
  const mergedPath = path.join(tmp, 'merged.md');
  fs.writeFileSync(mergedPath, compose.stdout, 'utf8');

  // final extract as smoke
  const exMerged = runCli(['extract', mergedPath, '--section', 'SEC-1']);
  if (exMerged.status !== 0) return { round_trip_ok: false, extract_ok: false };

  // consistency check via strict validate
  const valMerged = runCli(['validate', '--strict'], compose.stdout);
  const valRows = parseNdjson(valMerged.stdout);
  const summary = valRows.find((x) => x.type === 'summary');
  const roundTripOk = valMerged.status === 0 && summary && summary.ok === true;

  return {
    round_trip_ok: !!roundTripOk,
    extract_ok: true,
  };
}

function evaluateScenario(modelProfile, attempts) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ideamark-llm-v013-'));
  try {
    const metrics = attempts.map((text) => collectAttemptMetrics(text));
    const successIndex = metrics.findIndex((m) => m.validate_ok);
    const successDoc = successIndex >= 0 ? attempts[successIndex] : attempts[attempts.length - 1];

    const roundTrip = runRoundTripScenario(successDoc, tmp);

    const attemptCount = attempts.length;
    const retryCount = Math.max(0, attemptCount - 1);
    const selfCorrected = successIndex > 0;

    const avg = (arr) => arr.filter(Boolean).length / arr.length;
    const yamlParseRate = avg(metrics.map((m) => m.yaml_parse_ok));
    const idUniqueRate = avg(metrics.map((m) => m.id_unique_ok));
    const refsResolvableRate = avg(metrics.map((m) => m.refs_resolvable_ok));

    return {
      model_profile: modelProfile,
      attempts: attemptCount,
      retry_count: retryCount,
      self_corrected: selfCorrected,
      yaml_parse_success_rate: Number(yamlParseRate.toFixed(3)),
      id_unique_rate: Number(idUniqueRate.toFixed(3)),
      references_resolvable_rate: Number(refsResolvableRate.toFixed(3)),
      final_validation_passed: successIndex >= 0,
      round_trip_consistency: !!roundTrip.round_trip_ok,
      extract_smoke_passed: !!roundTrip.extract_ok,
    };
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

function buildReport() {
  const smallAttempts = [makeLongDoc('DOC-LLM-SMALL-001', true), makeLongDoc('DOC-LLM-SMALL-001', false)];
  const largeAttempts = [makeLongDoc('DOC-LLM-LARGE-001', false)];

  const scenarioSmall = evaluateScenario('small', smallAttempts);
  const scenarioLarge = evaluateScenario('large', largeAttempts);

  const scenarios = [scenarioSmall, scenarioLarge];
  const summary = {
    type: 'summary',
    scenario_count: scenarios.length,
    avg_yaml_parse_success_rate: Number(
      (scenarios.reduce((sum, s) => sum + s.yaml_parse_success_rate, 0) / scenarios.length).toFixed(3)
    ),
    avg_id_unique_rate: Number(
      (scenarios.reduce((sum, s) => sum + s.id_unique_rate, 0) / scenarios.length).toFixed(3)
    ),
    avg_references_resolvable_rate: Number(
      (scenarios.reduce((sum, s) => sum + s.references_resolvable_rate, 0) / scenarios.length).toFixed(3)
    ),
    round_trip_consistency_rate: Number(
      (
        scenarios.filter((s) => s.round_trip_consistency).length /
        scenarios.length
      ).toFixed(3)
    ),
    self_correction_rate: Number(
      (
        scenarios.filter((s) => s.self_corrected).length /
        scenarios.length
      ).toFixed(3)
    ),
    avg_retry_count: Number(
      (scenarios.reduce((sum, s) => sum + s.retry_count, 0) / scenarios.length).toFixed(3)
    ),
  };

  return {
    generated_at: new Date().toISOString(),
    schema_version: 'v0.1.3-llm-metrics.1',
    scenarios,
    summary,
  };
}

function toNdjson(report) {
  const rows = [];
  rows.push({ type: 'meta', generated_at: report.generated_at, schema_version: report.schema_version });
  for (const s of report.scenarios) {
    rows.push({ type: 'scenario', ...s });
  }
  rows.push(report.summary);
  return rows.map((r) => JSON.stringify(r)).join('\n') + '\n';
}

function main() {
  const args = process.argv.slice(2);
  let outPath = null;
  for (let i = 0; i < args.length; i += 1) {
    const a = args[i];
    if (a === '--out') {
      outPath = args[i + 1];
      i += 1;
      continue;
    }
    process.stderr.write('usage: node tests/run-llm-metrics-v0.1.3.js [--out <path>]\n');
    process.exit(2);
  }

  const report = buildReport();
  const ndjson = toNdjson(report);

  process.stdout.write(ndjson);
  if (outPath) {
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, ndjson, 'utf8');
  }
}

main();
