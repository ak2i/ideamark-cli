const test = require('node:test');
const assert = require('node:assert');
const { runCli, minimalDoc } = require('./helpers');

test('ls: markdown output includes parsed IDs', () => {
  const res = runCli(['ls', '--format', 'md'], minimalDoc());
  assert.strictEqual(res.status, 0);
  assert.match(res.stdout, /# sections/);
  assert.match(res.stdout, /- SEC-1/);
  assert.match(res.stdout, /# occurrences/);
  assert.match(res.stdout, /- OCC-1/);
  assert.match(res.stdout, /# entities/);
  assert.match(res.stdout, /- IE-1/);
});

test('ls: accepts fenced yaml with space after backticks', () => {
  const spacedFenceDoc = minimalDoc().replaceAll('```yaml', '``` yaml');
  const res = runCli(['ls', '--format', 'md'], spacedFenceDoc);
  assert.strictEqual(res.status, 0);
  assert.match(res.stdout, /- SEC-1/);
  assert.match(res.stdout, /- OCC-1/);
  assert.match(res.stdout, /- IE-1/);
  assert.match(res.stdout, /anchorage.view: design/);
  assert.match(res.stdout, /status.state: in_progress/);
});
