# IdeaMark Params

This guide describes the minimal structural inputs for IdeaMark Core v1.2.0. The baseline representation is YAML-based.

## Header

Required:
- `ideamark_version`
- `doc_type`

Strict mode additionally requires:
- `doc_id`
- `status.state`
- `created_at`
- `updated_at`
- `lang`

Notes:
- `meta.spec_version` should be `ideamark-core-v1.2.0`.
- `doc_type` should use the published vocab: `source`, `derived`, `evolving`, `pattern`.
- `status.state` should use the published vocab: `in_progress`, `paused`, `completed`, `published`.

## Registry

Required namespaces:
- `entities`
- `occurrences`
- `sections`

Optional namespaces:
- `relations`
- `perspectives`
- `structure`

Entity rules:
- Every entity must have `payload`.
- `payload` must contain at least one of `body`, `ref`, or `cache`.
- If `payload.ref` exists, `payload.ref.uri` is required.
- `kind` and `atomicity_basis` should use published vocab when present.

Occurrence rules:
- Every occurrence must have `entity`.
- Every occurrence must have `role`.
- `entity` must resolve to an existing entity ID.

Section rules:
- Every section must have a non-empty `occurrences` array.
- Each `occurrences[]` entry must resolve to an existing occurrence ID.
- Core v1.2.0 anchors and optional namespaces are metadata unless required by a profile.

## References

Supported local reference targets:
- entity refs such as `IE-1`
- occurrence refs such as `OCC-1`
- section refs such as `SEC-1`

Relation rules:
- `relations.*.from` may target an entity or section.
- `relations.*.to` may target an entity or section.

## Validation

Working mode checks:
- YAML parseability
- required top-level namespaces
- entity payload rules
- occurrence entity / role rules
- section occurrence linkage
- relation target validity

Strict mode highlights:
- stricter header enforcement
- `payload.ref.uri` enforcement
- unresolved local references fail validation

Non-blocking warnings may include:
- unreferenced entities
- unused occurrences
