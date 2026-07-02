const test = require('node:test');
const assert = require('node:assert');
const { minimalDoc } = require('./helpers');
const { formatDocument } = require('../../src/format');

test('format: idempotent', () => {
  const doc = minimalDoc();
  const first = formatDocument(doc, {}).output;
  const second = formatDocument(first, {}).output;
  assert.strictEqual(first, second);
});

test('format: canonical converts local refs', () => {
  const doc = [
    'ideamark_version: "1.1.1"',
    'doc_id: "DOC-1"',
    'doc_type: "derived"',
    'status:',
    '  state: "in_progress"',
    'created_at: "2026-06-19T00:00:00Z"',
    'updated_at: "2026-06-19T00:00:00Z"',
    'lang: "en-US"',
    'entities:',
    '  IE-1:',
    '    kind: "observation"',
    '    payload:',
    '      body: "test"',
    '      format:',
    '        media_type: "text/plain"',
    '    atomicity_basis: "interpretive"',
    '  IE-2:',
    '    kind: "observation"',
    '    payload:',
    '      body: "target"',
    '      format:',
    '        media_type: "text/plain"',
    '    atomicity_basis: "interpretive"',
    'occurrences:',
    '  OCC-1:',
    '    entity: "IE-1"',
    '    target: "IE-2"',
    '    role: "observation"',
    'sections:',
    '  SEC-1:',
    '    occurrences: ["OCC-1"]',
    'relations: {}',
    'perspectives: {}',
    'structure:',
    '  sections: ["SEC-1"]',
    '',
  ].join('\n');
  const res = formatDocument(doc, { canonical: true });
  assert.match(res.output, /ideamark:\/\/docs\/DOC-1#\/entities\/IE-1/);
  assert.match(res.output, /ideamark:\/\/docs\/DOC-1#\/entities\/IE-2/);
});

test('format: non-canonical keeps local refs', () => {
  const res = formatDocument(minimalDoc(), {});
  assert.match(res.output, /entity: IE-1/);
});

test('format: preserves text sections', () => {
  const doc = minimalDoc() + '\nExtra line.';
  const res = formatDocument(doc, {});
  assert.match(res.output, /Extra line\./);
});

test('format: works with frontmatter only', () => {
  const doc = ['---', 'doc_id: "X"', '---', '', '# Title'].join('\n');
  const res = formatDocument(doc, {});
  assert.match(res.output, /doc_id: X/);
});

test('format: works with whole-document yaml', () => {
  const doc = [
    'ideamark_version: "1.1.1"',
    'doc_id: "DOC-YAML"',
    'doc_type: "derived"',
    'status:',
    '  state: "in_progress"',
    'created_at: "2026-06-19T00:00:00Z"',
    'updated_at: "2026-06-19T00:00:00Z"',
    'lang: "en-US"',
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
    '',
  ].join('\n');
  const res = formatDocument(doc, {});
  assert.match(res.output, /doc_id: DOC-YAML/);
  assert.match(res.output, /sections:/);
  assert.match(res.output, /perspectives: \{\}/);
});

test('format: preserves evidence info string', () => {
  const doc = minimalDoc() + '\n```yaml ideamark:evidence\nmemo: "note"\n```\n';
  const res = formatDocument(doc, {});
  assert.match(res.output, /```yaml ideamark:evidence/);
});
