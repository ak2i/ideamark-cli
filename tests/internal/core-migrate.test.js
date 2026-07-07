const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const YAML = require('yaml');

const { migrateDocument } = require('../../src/core/migrate');

const V111 = path.join(__dirname, '..', 'fixtures', 'v1.1.1');

function readV111(...rel) {
  return fs.readFileSync(path.join(V111, ...rel), 'utf8');
}

function v111ValidCorpus() {
  return fs.readdirSync(path.join(V111, 'valid')).filter((f) => f.endsWith('.ideamark.md'));
}

test('migration: every valid v1.1.1 fixture migrates to a Core-valid v1.2.0 document', () => {
  for (const name of v111ValidCorpus()) {
    const result = migrateDocument(readV111('valid', name));
    assert.strictEqual(result.ok, true, `${name}: ${JSON.stringify(result.diagnostics, null, 2)}`);
    const doc = YAML.parse(result.output);
    assert.strictEqual(doc.meta.spec_version, 'ideamark-core-v1.2.0', name);
    for (const ns of ['sources', 'sections', 'occurrences', 'entities']) {
      assert.ok(Array.isArray(doc[ns]), `${name}: ${ns} should be an array`);
    }
    assert.strictEqual(doc.meta.migration.from_spec_version, 'ideamark-core-v1.1.1', name);
    assert.strictEqual(doc.meta.migration.migrated_by, 'ideamark-cli', name);
  }
});

test('migration: identities, payload mapping, and extension preservation', () => {
  const result = migrateDocument(readV111('valid', 'payload-body-ref-cache.ideamark.md'));
  assert.strictEqual(result.ok, true);
  const doc = YAML.parse(result.output);

  assert.strictEqual(doc.meta.document_id, 'DOC-V111-BODY-REF-CACHE');
  assert.strictEqual(doc.meta.status, 'draft'); // in_progress -> draft (conservative)

  const ent = doc.entities.find((e) => e.id === 'E-FULL-001');
  assert.ok(ent, 'legacy map key preserved as id');
  assert.strictEqual(ent.kind, 'claim');
  assert.strictEqual(ent.content, 'Authored restatement.'); // payload.body -> content
  assert.strictEqual(ent.ref, 'https://example.org/origin.md'); // payload.ref.uri -> ref
  // cache and format are preserved, not promoted to content (§14.5)
  assert.strictEqual(ent['x-ideamark-v1'].payload.cache.body, 'Snapshot of the origin.');
  assert.strictEqual(ent['x-ideamark-v1'].payload.format.media_type, 'text/markdown');

  const occ = doc.occurrences.find((o) => o.id === 'OCC-001');
  assert.deepStrictEqual({ entity: occ.entity, role: occ.role }, { entity: 'E-FULL-001', role: 'claim' });
  const sec = doc.sections.find((s) => s.id === 'SEC-001');
  assert.deepStrictEqual(sec.occurrences, ['OCC-001']);
});

test('migration: section anchorage and header extras move to x-ideamark-v1', () => {
  const result = migrateDocument(readV111('valid', 'minimal-body.ideamark.md'));
  const doc = YAML.parse(result.output);
  const sec = doc.sections.find((s) => s.id === 'SEC-001');
  assert.deepStrictEqual(sec['x-ideamark-v1'].anchorage, { view: ['urban-drainage'], phase: ['analysis'] });
  assert.strictEqual(doc.meta['x-ideamark-v1'].doc_type, 'derived');
});

test('migration: external entity references become stub entities carrying ref', () => {
  for (const name of ['external-shorthand-ref.ideamark.md', 'external-entity-reuse.ideamark.md']) {
    const result = migrateDocument(readV111('valid', name));
    assert.strictEqual(result.ok, true, name);
    assert.ok(
      result.diagnostics.some((d) => d.code === 'migration_placeholder_created'),
      `${name}: expected stub creation warning`
    );
    const doc = YAML.parse(result.output);
    const stubs = doc.entities.filter((e) => e.kind === 'reference');
    assert.strictEqual(stubs.length, 1, name);
    assert.strictEqual(stubs[0].id, stubs[0].ref, `${name}: stub carries the external ref`);
    // every occurrence resolves after stub creation
    const ids = new Set(doc.entities.map((e) => e.id));
    for (const occ of doc.occurrences) assert.ok(ids.has(occ.entity), `${name}: ${occ.entity}`);
  }
});

test('migration: relations and perspectives are normalized to arrays and preserved', () => {
  const result = migrateDocument(readV111('valid', 'relations-perspectives.ideamark.md'));
  assert.strictEqual(result.ok, true);
  const doc = YAML.parse(result.output);
  assert.deepStrictEqual(
    doc.relations.map((r) => r.id),
    ['REL-001', 'REL-002']
  );
  assert.strictEqual(doc.relations[0].type, 'supports');
  assert.strictEqual(doc.perspectives[0].id, 'P-URBAN');
});

test('migration: unresolved local references warn (error with --strict)', () => {
  const text = readV111('invalid', 'err-ref-occurrence-entity.ideamark.md');
  const lax = migrateDocument(text);
  assert.ok(lax.diagnostics.some((d) => d.code === 'migration_reference_unresolved' && d.severity === 'warning'));
  assert.strictEqual(lax.ok, false, 'post-validation must fail on the unresolved reference');
  assert.ok(lax.output, 'output is still produced (nothing dropped)');

  const strict = migrateDocument(text, { strict: true });
  assert.strictEqual(strict.ok, false);
  assert.ok(strict.diagnostics.some((d) => d.code === 'migration_reference_unresolved' && d.severity === 'error'));
  assert.strictEqual(strict.output, null, 'strict migration fails before emitting output');
});

test('migration: non-IdeaMark input is rejected as unrecognized', () => {
  const result = migrateDocument('# just some markdown\n\nhello\n');
  assert.strictEqual(result.ok, false);
  assert.ok(result.diagnostics.some((d) => d.code === 'migration_source_unrecognized'));
});

test('migration: migrated output round-trips through the v1.2.0 formatter', () => {
  const { formatDocument } = require('../../src/core/format');
  for (const name of v111ValidCorpus()) {
    const migrated = migrateDocument(readV111('valid', name));
    const formatted = formatDocument(migrated.output);
    assert.strictEqual(formatted.ok, true, name);
    assert.deepStrictEqual(YAML.parse(formatted.output), YAML.parse(migrated.output), name);
  }
});
