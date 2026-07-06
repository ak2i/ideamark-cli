# v1.2.0 Fixture Corpus

Conformance fixtures for IdeaMark Core v1.2.0 (Part 4) validation.

## Layout

```
valid/                     Positive corpus — copies of Part 4 normative samples
                           (docs/specs/V1.2.0/part4-core-specification/samples/).
                           Expected: 0 errors, 0 warnings in core AND strict mode.
expected-diagnostics.yaml  Expected diagnostics manifest for the corpus.
invalid/                   One fixture per checklist error rule.
warnings/                  One fixture per checklist warning rule.
migration/                 (Phase 4) v1.1.1 .ideamark.md inputs + expected v1.2.0 output.
```

Consumed by `tests/internal/core-validate.test.js`.

## Rules

- `valid/` files are **verbatim copies** of the spec samples. Do not edit them here;
  if the spec samples change, re-copy and re-baseline `expected-diagnostics.yaml`.
- Every fixture asserts against rule IDs / codes defined in
  `docs/dev/v0.3.0/validation-checklist.md` and `docs/dev/v0.3.0/diagnostic-codes.md`.
- `invalid/` and `warnings/` fixtures follow the v1.1.1 corpus convention:
  one file per rule, named `<sev>-<code>[--<variant>].ideamark.yaml`
  (e.g. `err-unresolved_reference--occ-entity.ideamark.yaml`), a minimal document
  exercising exactly that rule. The test harness derives the expected diagnostic
  code from the filename.
- `invalid/` asserts the expected code appears among errors; `warnings/` asserts the
  expected code appears among warnings AND the document has zero errors.
