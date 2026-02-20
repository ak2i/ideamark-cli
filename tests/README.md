# Tests

## Smoke tests (v0.9.13)

1. Extract the smoke zip (provided in `docs/dev/v0.1.0/test-materials/v0.9.13/ideamark-tests-v0.9.13-smoke.zip`).
2. Run the smoke runner:

```bash
node tests/run-smoke.js
```

This runner executes each smoke case, captures stdout/stderr/exit code, and compares against the golden files under `docs/dev/v0.1.0/test-materials/v0.9.13/ideamark-tests-v0.9.13/tests/golden/`.

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

## Internal tests

Run internal unit tests:

```bash
npm test
```

These cover validate/format/extract/compose/publish/describe behaviors and ensure outputs change with input, errors surface correctly, and reference updates occur.
