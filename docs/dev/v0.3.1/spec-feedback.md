# IdeaMark Core v1.2.0 — Implementation Feedback from IdeaMark CLI v0.3.1

**Status:** living document during v0.3.1 development; intended for the IdeaMark Core
spec repository review (Part 4 `19-open-review-issues.md`).

Each item records: the spec ambiguity, what the CLI implements in the meantime, and a
suggested spec-side resolution.

## F1 — Placeholder detection is circular (§3.14, §8.12, §13.6)

§13.6 requires an error when "a **non-placeholder** Occurrence lacks `entity` / `role`",
but §8.12 defines a placeholder Occurrence as one that "lacks `entity` or `role`".
With no independent placeholder marker, the §13.6 error rows for `entity`/`role` are
unreachable: any object missing those fields qualifies as a placeholder.

**CLI interim behavior (decision D5):** placeholder status is judged by field absence
alone. Missing `entity`/`role`/reusable-material fields produce placeholder-family
*warnings* in Core mode (promoted to errors in strict mode). Warning messages
recommend `status: draft` as an intent marker.

**Suggested resolution:** either (a) define an explicit placeholder marker
(e.g. recommend `status: draft` normatively) so that Core mode can distinguish
intentional placeholders (warn) from mistakes (error), or (b) drop the
"non-placeholder … lacks entity/role" rows from §13.6 and acknowledge they are
warnings in Core mode.

## F2 — `meta.projections.inline` scope guidance (§19.4.2, open)

Unresolved in the spec. **CLI interim behavior (D6):** inline Projection data is not
inspected — no size or scope diagnostics. We will report implementation experience if
oversized inline Projections appear in practice.

## F3 — Occurrence `role` / Entity `kind` vocabulary: §8.6 vs §13.12

§8.6 says Core validators "SHOULD warn on missing or unknown roles", but §13.12's
vocabulary-warning list covers document status, object status, source type, anchor
type, anchor precision, and Projection role — **not** Occurrence role or Entity kind.
§9.8 explicitly limits kind warnings to profile-declared vocabularies.

The Part 4 samples themselves use domain-shaped roles (`ordered_cooking_step`,
`establishes_performance_boundary`, …); warning on every unlisted role would make the
normative samples noisy, contradicting §18 findings.

**CLI interim behavior:** roles and kinds are fully open in Core mode — no
unknown-value diagnostic without a declared profile (checklist OCC-07 / ENT-08).
"Unknown role" warnings apply only to *missing* roles (placeholder family, F1).

**Suggested resolution:** align §8.6 with §13.12/§9.8 — warn on missing role, stay
silent on unlisted role values in Core mode.

## F4 — Intent-conditioned warnings are undecidable (§13.7, §5.14)

Two recommended warnings are conditioned on authorial intent that a validator cannot
observe:

- "a required namespace is empty **in a document that appears intended for exchange**";
- "a Source is never referenced by any anchor **and the document appears to claim
  source traceability**".

**CLI interim behavior:** both downgraded to `info` in Core mode (`empty_namespace`,
`source_unreferenced`); strict mode treats empty required namespaces as errors
(incomplete structures, §13.4).

**Suggested resolution:** rephrase these rows without the intent condition (e.g. make
them unconditional info-level observations), and leave intent-based enforcement to
profiles (§19.5.3 already points that way).

## F5 — Part 4 samples conformance report (positive)

All six `part4-core-specification/samples/*.ideamark.yaml` files were machine-checked
against the v0.3.1 rule checklist (Phase 0, 2026-07-06):

- **0 errors, 0 warnings** under Core mode rules;
- info-level observations only: `anchor_precision_note` (all anchors are
  `approximate`/`inferred` — expected for heading-path/prose anchors) and
  `id_prefix_unconventional` (samples use upper-case `SRC-`/`SEC-`/`OCC-`/`ENT-`
  prefixes rather than the recommended lower-case `src-` etc., §1.5).

The samples are adopted unchanged as the CLI conformance corpus
(`tests/fixtures/v1.2.0/valid/`). If the spec intends the samples to model the
recommended ID prefixes, lower-casing them would remove the only observation; not a
conformance problem either way.

## v0.3.1 feedback — optional `skeletons` boundary

`skeletons` is implemented as a known optional namespace rather than an unknown namespace. This keeps Core validation additive: malformed Skeleton Graph content does not invalidate an otherwise Core-valid document in core mode, but the CLI can still surface graph-local shape and reference-resolution warnings. A future profile should clarify which skeleton roles, slots, and link types are closed vocabularies and when strict/profile mode may promote shape warnings to errors.
