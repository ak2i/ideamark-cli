const test = require('node:test');
const assert = require('node:assert');
const { runCli, tempDir, writeTempFile, minimalDoc } = require('./helpers');

function docWithEntity(id, content) {
  return minimalDoc().replace(/IE-1/g, id).replace('content: "test"', `content: "${content}"`);
}

function docWithSectionNarrative(docId, narrative) {
  return minimalDoc({ header: { doc_id: docId } }).replace(
    '```\n\n```yaml\noccurrence_id: "OCC-1"',
    `\`\`\`\n\n${narrative}\n\n\`\`\`yaml\noccurrence_id: "OCC-1"`
  );
}

test('compose: union of entities', () => {
  const dir = tempDir();
  const a = writeTempFile(dir, 'a.md', docWithEntity('IE-A', 'a'));
  const b = writeTempFile(dir, 'b.md', docWithEntity('IE-B', 'b'));
  const res = runCli(['compose', a, b]);
  assert.match(res.stdout, /IE-A/);
  assert.match(res.stdout, /IE-B/);
});

test('compose: conflict renames', () => {
  const dir = tempDir();
  const a = writeTempFile(dir, 'a.md', docWithEntity('IE-1', 'a'));
  const b = writeTempFile(dir, 'b.md', docWithEntity('IE-1', 'b'));
  const res = runCli(['compose', a, b]);
  assert.match(res.stdout, /aliases/);
});

test('compose: structure merges order', () => {
  const dir = tempDir();
  const a = writeTempFile(dir, 'a.md', minimalDoc());
  const b = writeTempFile(
    dir,
    'b.md',
    minimalDoc()
      .replace(/SEC-1/g, 'SEC-2')
      .replace(/OCC-1/g, 'OCC-2')
      .replace(/IE-1/g, 'IE-2')
  );
  const res = runCli(['compose', a, b]);
  assert.match(res.stdout, /sections:[\s\S]*SEC-1[\s\S]*SEC-2/);
});

test('compose: inherit doc_id', () => {
  const dir = tempDir();
  const a = writeTempFile(dir, 'a.md', minimalDoc());
  const b = writeTempFile(dir, 'b.md', minimalDoc().replace('DOC-1', 'DOC-2'));
  const res = runCli(['compose', a, b, '--inherit', 'first']);
  assert.match(res.stdout, /doc_id: DOC-1/);
});

test('compose: preserve markdown keeps section narrative near section yaml', () => {
  const dir = tempDir();
  const a = writeTempFile(dir, 'a.md', docWithSectionNarrative('DOC-1', 'Section narrative A'));
  const b = writeTempFile(dir, 'b.md', docWithSectionNarrative('DOC-2', 'Section narrative B'));
  const res = runCli(['compose', a, b, '--preserve-markdown']);
  assert.match(res.stdout, /## SEC-1[\s\S]*Section narrative A/);
  assert.match(res.stdout, /## SEC-1[\s\S]*Section narrative B/);
  assert.doesNotMatch(res.stdout, /occurrence_id:\s*"OCC-1"/);
  assert.doesNotMatch(res.stdout, /Source Narrative Appendix/);
});

test('compose: invalid input fails', () => {
  const dir = tempDir();
  const a = writeTempFile(dir, 'a.md', 'No header');
  const b = writeTempFile(dir, 'b.md', minimalDoc());
  const res = runCli(['compose', a, b]);
  assert.strictEqual(res.status, 1);
});
