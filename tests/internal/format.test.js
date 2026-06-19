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
  const doc = minimalDoc();
  const res = formatDocument(doc, { canonical: true });
  assert.match(res.output, /ideamark:\/\/docs\/DOC-1#\/entities\/IE-1/);
});

test('format: non-canonical keeps local refs', () => {
  const doc = minimalDoc();
  const res = formatDocument(doc, {});
  assert.match(res.output, /entity: IE-1/);
});

test('format: converts legacy markdown-shaped document into yaml output', () => {
  const doc = [
    '---',
    'ideamark_version: "1.1.1"',
    'doc_id: "DOC-1"',
    'doc_type: "derived"',
    'status:',
    '  state: "in_progress"',
    'created_at: "2026-06-19T00:00:00Z"',
    'updated_at: "2026-06-19T00:00:00Z"',
    'lang: "en-US"',
    '---',
    '',
    '## SEC-1',
    '```yaml',
    'section_id: "SEC-1"',
    'occurrences: ["OCC-1"]',
    '```',
    '',
    '## Registry',
    '```yaml',
    'entities:',
    '  IE-1:',
    '    kind: "observation"',
    '    payload:',
    '      body: "test"',
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
  ].join('\n');
  const res = formatDocument(doc, {});
  assert.doesNotMatch(res.output, /```yaml/);
  assert.match(res.output, /sections:/);
});

test('format: works with whole-document yaml input', () => {
  const doc = minimalDoc();
  const res = formatDocument(doc, {});
  assert.match(res.output, /ideamark_version:/);
  assert.doesNotMatch(res.output, /---/);
});
