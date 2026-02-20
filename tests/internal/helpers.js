const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

function runCli(args, input) {
  const result = { stdout: '', stderr: '', status: 0 };
  try {
    const out = execFileSync(process.execPath, [path.join('bin', 'ideamark.js'), ...args], {
      input: input || undefined,
      encoding: 'utf8',
    });
    result.stdout = out || '';
  } catch (err) {
    result.stdout = err.stdout ? err.stdout.toString() : '';
    result.stderr = err.stderr ? err.stderr.toString() : '';
    result.status = typeof err.status === 'number' ? err.status : 1;
    return result;
  }
  return result;
}

function tempDir() {
  const dir = fs.mkdtempSync(path.join(process.cwd(), 'tests', 'internal', 'tmp-'));
  return dir;
}

function writeTempFile(dir, name, content) {
  const p = path.join(dir, name);
  fs.writeFileSync(p, content, 'utf8');
  return p;
}

function minimalDoc(overrides) {
  const header = {
    ideamark_version: 1,
    doc_id: 'DOC-1',
    doc_type: 'derived',
    status: { state: 'in_progress' },
    created_at: '2026-02-20',
    updated_at: '2026-02-20',
    lang: 'en',
  };
  const h = { ...header, ...(overrides && overrides.header ? overrides.header : {}) };
  return [
    '---',
    `ideamark_version: ${h.ideamark_version}`,
    `doc_id: "${h.doc_id}"`,
    `doc_type: "${h.doc_type}"`,
    'status:',
    `  state: "${h.status.state}"`,
    `created_at: "${h.created_at}"`,
    `updated_at: "${h.updated_at}"`,
    `lang: "${h.lang}"`,
    '---',
    '',
    '## SEC-1',
    '```yaml',
    'section_id: "SEC-1"',
    'anchorage:',
    '  view: "design"',
    '  phase: "implementation"',
    'occurrences: ["OCC-1"]',
    '```',
    '',
    '```yaml',
    'occurrence_id: "OCC-1"',
    'entity: "IE-1"',
    'role: "observation"',
    'status: { state: "confirmed" }',
    '```',
    '',
    '## Registry',
    '```yaml',
    'entities:',
    '  IE-1:',
    '    kind: "observation"',
    '    content: "test"',
    'occurrences:',
    '  OCC-1:',
    '    entity: "IE-1"',
    '    role: "observation"',
    '    status: { state: "confirmed" }',
    'sections:',
    '  SEC-1:',
    '    anchorage: { view: "design", phase: "implementation" }',
    '    occurrences: ["OCC-1"]',
    'structure:',
    '  sections: ["SEC-1"]',
    '```',
    '',
  ].join('\n');
}

module.exports = { runCli, tempDir, writeTempFile, minimalDoc };
