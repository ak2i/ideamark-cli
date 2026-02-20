# Tests

## Smoke tests (v0.9.13)

1. Extract the smoke zip (already provided in `docs/dev/v0.1.0/ideamark-tests-v0.9.13-smoke.zip`).
2. Run the smoke runner:

```bash
node tests/run-smoke.js
```

This runner executes each smoke case, captures stdout/stderr/exit code, and compares against the golden files under `ideamark-tests-v0.9.13/tests/golden/`.

## Internal tests

Run internal unit tests:

```bash
npm test
```

These cover validate/format/extract/compose/publish/describe behaviors and ensure outputs change with input, errors surface correctly, and reference updates occur.
