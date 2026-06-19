# Tests

## Smoke tests (v0.9.13)

1. Extract the smoke zip (provided in `docs/dev/v0.1.0/test-materials/v0.9.13/ideamark-tests-v0.9.13-smoke.zip`).
2. Run the smoke runner:

```bash
node tests/run-smoke.js
```

This runner executes each smoke case, captures stdout/stderr/exit code, and compares against the golden files under `docs/dev/v0.1.0/test-materials/v0.9.13/ideamark-tests-v0.9.13/tests/golden/`.

## Smoke tests (v0.1.1)

Additional cases are embedded in `tests/run-smoke.js`:

1. `ideamark --version` returns exit 0 and contains the package version string.
2. `ideamark describe ai-authoring` returns the exact content of `docs/guides/ideamark/ai-authoring.md`.
3. `ideamark describe params --format json` returns JSON with required top-level keys.
4. `ideamark ls <fixture> --format json` returns expected IDs and vocab entries.

### NDJSON comparison rules

For `validate` stdout (and ops stdin validate), the runner parses NDJSON and compares a normalized subset:

- `meta`: only `type == "meta"` is required; extra fields are ignored.
- `diagnostic`: compares `severity` and `code` (required) and `location` if present; message and extra fields are ignored.
- `summary`: compares `ok`, and `error_count` if present.
- diagnostics are sorted by `(severity, code, location.path, location.id)` before comparison.

## Success-path smoke cases

- `TC-EXT-SUCCESS-001`: strict-valid input; extract `SEC-A` should succeed, output has new `doc_id`, contains `SEC-A`, and strict validate passes.
- `TC-COM-SUCCESS-001`: compose two strict-valid docs without conflicts; output is strict-valid, contains both entities, and preserves structure order (`SEC-A` then `SEC-B`).
- `TC-PUB-SUCCESS-001`: publish strict-valid working doc; output is strict-valid, canonical URIs applied, `updated_at` updated, `status.state=published`.
- `TC-FMT-CANON-001`: format `--canonical` on strict-valid doc; canonical URIs applied and output is idempotent.
- `TC-COM-CONFLICT-ENT-001`: entity ID conflict; compose renames with aliases and retargets occurrence entity reference.
- `TC-COM-CONFLICT-OCC-001`: occurrence ID conflict; compose renames with aliases and updates section occurrences[] reference.
- `TC-COM-CONFLICT-SEC-001`: section ID conflict; compose renames with aliases and preserves structure order.
- `TC-EXT-CLOSURE-001`: extract closure follows supporting_evidence and derived_from.entity; output includes referenced entities/occurrences.
- `TC-EXT-RELATIONS-001`: extract does not follow relations; output omits relation-only entities and relations array.
- `TC-PUB-STRICT-FAIL-001`: publish strict-invalid input; exit=1, stdout empty, stderr has required error diagnostic.
- `TC-PUB-CANON-COVERAGE-001`: publish canonicalizes all supported reference paths (entity/target/supporting_evidence/derived_from.entity) and strict validate passes.
- `TC-COM-CONFLICT-MIX-001`: compose simultaneous ENT+OCC+SEC conflicts; rename+aliases applied and references/structure remain consistent.

## Smoke tests (v0.2.0)

Run the v0.2.0 smoke runner:

```bash
npm run smoke:v0.2.0
```

This runner uses `tests/fixtures/v1.1.1/` and checks the current v1.1.1 baseline by invoking the core modules directly for:

- strict validate on valid and invalid payload cases
- lint on broken internal references
- extract output strict-validity
- compose output strict-validity
- describe capabilities contract version
- ls vocab output for v1.1.1-oriented fields

## Internal tests

Run internal unit tests:

```bash
npm test
```

These cover validate/format/extract/compose/publish/describe behaviors and ensure outputs change with input, errors surface correctly, and reference updates occur.

## v1.1.1 fixtures

`tests/fixtures/v1.1.1/` contains the new baseline samples for the v0.2.0 track.

- `minimal-valid.ideamark.md`: smallest strict-valid v1.1.1 sample
- `payload-body-only.ideamark.md`: entity payload via `payload.body`
- `payload-ref-only.ideamark.md`: entity payload via `payload.ref.uri`
- `payload-cache-only.ideamark.md`: entity payload via `payload.cache`
- `broken-ref.ideamark.md`: broken internal references for validation/lint error cases
- `empty-payload.ideamark.md`: invalid empty payload case

These fixtures are intended to replace old v0.1.x assumptions over time. Old smoke assets remain only as historical references and should not be used as the primary source for new v0.2.0 tests.

## LLM metrics runner (v0.1.3)

Run the v0.1.3 LLM metrics runner:

```bash
npm run llm-metrics:v0.1.3
```

Optional file output:

```bash
node tests/run-llm-metrics-v0.1.3.js --out docs/dev/v0.1.3/metrics/latest.ndjson
```

The runner emits NDJSON records (`meta`, `scenario`, `summary`) and tracks:

- YAML parse success rate
- ID uniqueness rate
- References resolvable rate
- Self-correction rate
- Retry count
- Round-trip consistency (split/extract -> refine -> compose -> validate)
