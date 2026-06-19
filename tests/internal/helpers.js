const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function runCli(args, input) {
  let finalArgs = [path.join('bin', 'ideamark.js'), ...args];
  let tempInputPath = null;
  if (input !== undefined && input !== null) {
    const command = args[0];
    const fileInputCommands = new Set(['validate', 'format', 'extract', 'publish', 'lint', 'ls']);
    if (fileInputCommands.has(command) && !args.includes('-')) {
      tempInputPath = path.join(
        process.cwd(),
        'tests',
        'internal',
        `tmp-input-${process.pid}-${Date.now()}-${Math.random().toString(16).slice(2)}.md`
      );
      fs.writeFileSync(tempInputPath, input, 'utf8');
      finalArgs = [path.join('bin', 'ideamark.js'), ...args, tempInputPath];
      input = undefined;
    }
  }
  const res = spawnSync(process.execPath, finalArgs, {
    input: input || undefined,
    encoding: 'utf8',
    cwd: process.cwd(),
  });
  if (tempInputPath && fs.existsSync(tempInputPath)) fs.unlinkSync(tempInputPath);
  return {
    stdout: res.stdout || '',
    stderr: res.stderr || '',
    status: typeof res.status === 'number' ? res.status : 1,
  };
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
    ideamark_version: '1.1.1',
    doc_id: 'DOC-1',
    doc_type: 'derived',
    status: { state: 'in_progress' },
    created_at: '2026-06-19T00:00:00Z',
    updated_at: '2026-06-19T00:00:00Z',
    lang: 'en-US',
  };
  const h = { ...header, ...(overrides && overrides.header ? overrides.header : {}) };
  return [
    '---',
    `ideamark_version: "${h.ideamark_version}"`,
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
    'occurrences: ["OCC-1"]',
    '```',
    '',
    '```yaml',
    'occurrence_id: "OCC-1"',
    'entity: "IE-1"',
    'role: "observation"',
    '```',
    '',
    '## Registry',
    '```yaml',
    'entities:',
    '  IE-1:',
    '    kind: "observation"',
    '    payload:',
    '      body: "test"',
    '      format:',
    '        media_type: "text/plain"',
    '    atomicity_basis: "interpretive"',
    'occurrences:',
    '  OCC-1:',
    '    entity: "IE-1"',
    '    role: "observation"',
    'sections:',
    '  SEC-1:',
    '    occurrences: ["OCC-1"]',
    'relations: {}',
    'perspectives: {}',
    'structure:',
    '  sections: ["SEC-1"]',
    '```',
    '',
  ].join('\n');
}

module.exports = { runCli, tempDir, writeTempFile, minimalDoc };
