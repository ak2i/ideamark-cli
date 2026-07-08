# IdeaMark CLI v0.3.1 — Validation Rule Checklist

**Target spec:** IdeaMark Core v1.2.0, Part 4 (`docs/specs/V1.2.0/part4-core-specification/`)  
**Status:** Phase 0 draft (frozen for v0.3.1 implementation unless a spec change forces revision)

This checklist is the single bridge between the (long) Part 4 specification and the
CLI implementation. Every validation behavior in `ideamark validate` MUST trace to a
rule ID in this file, and every rule ID maps to exactly one diagnostic code in
[`diagnostic-codes.md`](./diagnostic-codes.md). The CLI contract
([`cli-contract-v1.2.0.md`](./cli-contract-v1.2.0.md)) defines invocation and output,
not rules.

Conventions:

- **Level** — normative level in Part 4 (MUST / SHOULD / MAY).
- **Core / Strict** — severity emitted in each mode: `error`, `warn`, `info`, or `—` (no diagnostic).
- Strict mode always includes all Core-mode errors. Rows where Strict differs from Core
  implement decision D8 (strict enables the Part 4 §13.4 MAY-reject set).
- `info` diagnostics are emitted only when `--info` is passed (see CLI contract §4).
- Rows marked **[dev]** are deliberate implementation decisions where Part 4 is
  ambiguous or undecidable; each cites a decision (D5–D9, plan §8) or a feedback item
  (F1–F5, [`spec-feedback.md`](./spec-feedback.md)).

---

## 1. LOAD — parsing and document shape

| Rule | Part 4 | Level | Check | Core | Strict | Code |
| --- | --- | --- | --- | --- | --- | --- |
| LOAD-01 | §13.6 | MUST | Input parses as YAML | error | error | `yaml_parse_error` |
| LOAD-02 | §1.1, §15.2 | MUST | Exactly one top-level mapping (single document) | error | error | `top_level_not_mapping` |
| LOAD-03 | §15.10 | SHOULD/MAY | Input decodes as UTF-8 | error | error | `input_not_utf8` |
| LOAD-04 | §15.4 | SHOULD NOT | YAML anchors/aliases, custom tags, merge keys, multi-document streams | warn | error | `yaml_restricted_feature` |
| LOAD-05 | 方針B | [dev] | Input recognized as a v1.1.x `.ideamark.md` document (frontmatter / `ideamark_version`) → actionable "use `ideamark migrate`" error | error | error | `legacy_document_detected` |

## 2. NS — top-level namespaces

| Rule | Part 4 | Level | Check | Core | Strict | Code |
| --- | --- | --- | --- | --- | --- | --- |
| NS-01 | §2.1, §13.6 | MUST | `meta`, `sources`, `sections`, `occurrences`, `entities` all present | error | error | `required_namespace_missing` |
| NS-02 | §2.10 | MUST | Namespace types: `meta` mapping; the other four arrays | error | error | `required_namespace_wrong_type` |
| NS-03 | §1.10, §2.9 | SHOULD | Unknown top-level namespaces (not required, not `structure` / `relations` / `perspectives` / `provenance` / `extensions`) | warn | error | `unknown_namespace` |
| NS-04 | §13.7 | SHOULD | Empty required namespace. **[dev]** Part 4 conditions the warning on "appears intended for exchange", which is undecidable → downgraded to info in Core; Strict treats it as an incomplete structure (§13.4). See F4. | info | error | `empty_namespace` |
| NS-05 | §2.7–2.8, §12.9 | MAY | `relations` / `perspectives` / `provenance` content is preserved, never validated in v0.3.1 | — | — | — |

## 3. META — document metadata

| Rule | Part 4 | Level | Check | Core | Strict | Code |
| --- | --- | --- | --- | --- | --- | --- |
| META-01 | §4.15 | MUST | `meta.spec_version` present, non-empty string | error | error | `meta_field_missing` / `meta_field_invalid` |
| META-02 | §4.3 | SHOULD | `meta.spec_version` equals `ideamark-core-v1.2.0`. **[dev]** D7: error by default; `--allow-unsupported-spec` downgrades to warn | error | error | `spec_version_unsupported` |
| META-03 | §4.15 | MUST | `meta.document_id` present, non-empty string | error | error | `meta_field_missing` / `meta_field_invalid` |
| META-04 | §4.15 | MUST | `meta.status` present, non-empty string | error | error | `meta_field_missing` / `meta_field_invalid` |
| META-05 | §4.5 | SHOULD | Document status in recommended vocabulary (`draft generated reviewed deprecated superseded archived`) | warn | error | `unknown_status` |
| META-06 | §4.7 | SHOULD | Declared `meta.profiles` supported by this tool. v0.3.1 supports no profiles → any declaration warns "profile validation not performed" | warn | error | `profile_unsupported` |
| META-07 | §4.9, §4.15 | SHOULD | `meta.projections` items are mappings with `role` and at least one of `ref` / `inline` | warn | warn | `projection_reference_malformed` |
| META-08 | §4.10 | SHOULD | Projection `role` in recommended vocabulary (`generation reconstruction_reference comparison compatibility_hint inline_note`) | warn | error | `unknown_projection_role` |
| META-09 | §19.3.3 | [dev] | D6: `meta.projections[].inline` content is NOT semantically validated and has no size limit. Structural parseability only (covered by LOAD-01) | — | — | — |
| META-10 | §11.12 | SHOULD | Timestamps in `meta` (`created_at` etc.) look ISO 8601 when present | warn | warn | `timestamp_malformed` |

## 4. SRC — sources

| Rule | Part 4 | Level | Check | Core | Strict | Code |
| --- | --- | --- | --- | --- | --- | --- |
| SRC-01 | §3.2, §5.14 | MUST | Every item is a mapping | error | error | `object_not_mapping` |
| SRC-02 | §3.3, §5.3 | MUST | `id` present, non-empty string | error | error | `object_id_invalid` |
| SRC-03 | §3.4, §5.3 | MUST | `id` unique within `sources` | error | error | `duplicate_id` |
| SRC-04 | §5.14 | SHOULD | `type` present | warn | warn | `source_type_missing` |
| SRC-05 | §5.5 | SHOULD | `type` in recommended vocabulary (`document web_page code_file repository dataset image audio video stream generated_artifact composite other`) | warn | error | `unknown_source_type` |
| SRC-06 | §5.14, §13.10 | SHOULD | At least one of `title` / `uri` / `description` present. Classified as placeholder family (§13.10: "Source without identifying metadata beyond id") | warn | error | `source_metadata_missing` |
| SRC-07 | §5.14 | SHOULD | Source referenced by at least one anchor. **[dev]** Part 4 conditions this on "appears to claim source traceability", which is undecidable → info. See F4 | info | info | `source_unreferenced` |
| SRC-08 | §3.7 | SHOULD | `status`, when present, in recommended object-status vocabulary | warn | error | `unknown_status` |

## 5. SEC — sections

| Rule | Part 4 | Level | Check | Core | Strict | Code |
| --- | --- | --- | --- | --- | --- | --- |
| SEC-01 | §3.2, §7.15 | MUST | Every item is a mapping | error | error | `object_not_mapping` |
| SEC-02 | §7.3 | MUST | `id` present, non-empty string | error | error | `object_id_invalid` |
| SEC-03 | §7.3 | MUST | `id` unique within `sections` | error | error | `duplicate_id` |
| SEC-04 | §7.15 | MUST | `occurrences`, when present, is an array of strings | error | error | `field_wrong_type` |
| SEC-05 | §7.5 | MUST | Every `occurrences[]` ref resolves to an Occurrence ID | error | error | `unresolved_reference` |
| SEC-06 | §7.6, §13.10 | SHOULD | Section has a non-empty `occurrences` list. Absent or empty → placeholder. **[dev]** D5: judged by field absence alone | warn | error | `placeholder_object` |
| SEC-07 | §7.15 | SHOULD | No duplicate Occurrence refs within one Section | warn | warn | `duplicate_occurrence_reference` |
| SEC-08 | §7.9 | SHOULD | `status`, when present, in recommended object-status vocabulary (`active draft provisional deprecated superseded rejected`) | warn | error | `unknown_status` |
| SEC-09 | §7.15 | MUST | `anchors`, when present, satisfies ANC rules | (ANC) | (ANC) | — |

## 6. OCC — occurrences

| Rule | Part 4 | Level | Check | Core | Strict | Code |
| --- | --- | --- | --- | --- | --- | --- |
| OCC-01 | §3.2, §8.16 | MUST | Every item is a mapping | error | error | `object_not_mapping` |
| OCC-02 | §8.3 | MUST | `id` present, non-empty string | error | error | `object_id_invalid` |
| OCC-03 | §8.3 | MUST | `id` unique within `occurrences` | error | error | `duplicate_id` |
| OCC-04 | §8.3, §8.12, §13.10 | MUST* | `entity` present. **[dev]** D5 + §8.12: absence marks a placeholder, so Core emits a placeholder-family warning, not an error (the §13.6 "non-placeholder lacks entity" error row is unreachable under field-absence placeholder detection — see F1). Message recommends `status: draft` for intentional placeholders | warn | error | `occurrence_entity_missing` |
| OCC-05 | §8.3, §8.12 | MUST* | `role` present. Same placeholder treatment as OCC-04 | warn | error | `occurrence_role_missing` |
| OCC-06 | §8.5, §13.6 | MUST | `entity`, when present, resolves to an Entity ID | error | error | `unresolved_reference` |
| OCC-07 | §8.6–8.7, §9.8 | [dev] | `role` value vocabulary is fully open in Core mode: no diagnostic for unlisted roles (no profile support in v0.3.1). Resolves the §8.6 vs §13.12 tension in favor of §13.12 — see F3 | — | — | — |
| OCC-08 | §8.8 | SHOULD | `status`, when present, in recommended object-status vocabulary | warn | error | `unknown_status` |
| OCC-09 | §8.11 | SHOULD | `confidence`, when present, is a number in [0, 1] | warn | warn | `confidence_out_of_range` |
| OCC-10 | §8.16 | SHOULD | Occurrence referenced by at least one Section | warn | warn | `occurrence_unreferenced` |
| OCC-11 | §8.13 | SHOULD | Occurrence referenced by at most one Section | warn | warn | `occurrence_multi_section` |
| OCC-12 | §8.16 | MUST | `anchors`, when present, satisfies ANC rules | (ANC) | (ANC) | — |

\* MUST in Part 4 for non-placeholder objects; see the [dev] note.

## 7. ENT — entities

| Rule | Part 4 | Level | Check | Core | Strict | Code |
| --- | --- | --- | --- | --- | --- | --- |
| ENT-01 | §3.2, §9.18 | MUST | Every item is a mapping | error | error | `object_not_mapping` |
| ENT-02 | §9.3 | MUST | `id` present, non-empty string | error | error | `object_id_invalid` |
| ENT-03 | §9.3 | MUST | `id` unique within `entities` | error | error | `duplicate_id` |
| ENT-04 | §9.18 | MUST | `content`, when present, is a string | error | error | `field_wrong_type` |
| ENT-05 | §9.18 | MUST | `ref`, when present, is a non-empty string | error | error | `field_wrong_type` |
| ENT-06 | §9.4, §9.14 | SHOULD | At least one of `content` / `payload` / `ref` present; otherwise placeholder (D5). Message recommends `status: draft` for intentional placeholders | warn | error | `placeholder_object` |
| ENT-07 | §9.6 | [dev] | `payload` is preserved as-is; no schema validation (§9.6 MUST NOT require a universal schema) | — | — | — |
| ENT-08 | §9.8–9.9 | [dev] | `kind` vocabulary is fully open in Core mode (§9.8: warn only when a profile declares a vocabulary; no profile support in v0.3.1) | — | — | — |
| ENT-09 | §9.10 | SHOULD | `status`, when present, in recommended object-status vocabulary | warn | error | `unknown_status` |
| ENT-10 | §9.18 | SHOULD | Entity referenced by at least one Occurrence | warn | warn | `entity_unreferenced` |
| ENT-11 | §9.18 | MUST | `anchors`, when present, satisfies ANC rules | (ANC) | (ANC) | — |

## 8. ANC — anchors (common shape, on Section / Occurrence / Entity)

| Rule | Part 4 | Level | Check | Core | Strict | Code |
| --- | --- | --- | --- | --- | --- | --- |
| ANC-01 | §6.15 | MUST | `anchors` is an array | error | error | `field_wrong_type` |
| ANC-02 | §6.15 | MUST | Every anchor item is a mapping | error | error | `object_not_mapping` |
| ANC-03 | §6.15 | MUST | `source` present, non-empty string | error | error | `anchor_field_missing` |
| ANC-04 | §6.15 | MUST | `type` present, non-empty string | error | error | `anchor_field_missing` |
| ANC-05 | §6.15 | MUST | `source` resolves to a Source ID | error | error | `unresolved_reference` |
| ANC-06 | §6.13 | SHOULD | `type` in recommended vocabulary (`line_range character_range paragraph heading_path page_range media_time_range image_region dataset_rows dataset_columns dataset_cells dataset_query repository_path code_symbol composite_fragment other`) | warn | error | `unknown_anchor_type` |
| ANC-07 | §6.4 | SHOULD | `precision`, when present, in `exact approximate inferred unknown` | warn | error | `unknown_precision` |
| ANC-08 | §6.15 | SHOULD | Ranges well-formed: `ranges` is array of mappings; integer `start` / `end`; `start <= end` | warn | warn | `anchor_range_invalid` |
| ANC-09 | §6.15 | SHOULD | Type-specific recommended fields present (`line_range`/`character_range`/`page_range` → `ranges`; `heading_path` → `path`; `paragraph` → `paragraph`; `media_time_range` → `start`+`end`; `image_region` → `region`) | warn | warn | `anchor_fields_incomplete` |
| ANC-10 | §6.12, §13.8 | MAY | `precision: approximate` or `inferred` observed (never a failure — §6.12 MUST NOT reject) | info | info | `anchor_precision_note` |
| ANC-11 | §6.3.1 | [dev] | D9: anchor `role` / `purpose` are open vocabulary, passed with no diagnostic | — | — | — |

## 9. STR — structure (only when present; optional namespace)

| Rule | Part 4 | Level | Check | Core | Strict | Code |
| --- | --- | --- | --- | --- | --- | --- |
| STR-01 | §10.9 | SHOULD | `structure` is a mapping; `structure.sections`, when present, is an array of strings | warn | warn | `structure_invalid` |
| STR-02 | §10.9, §13.9 | SHOULD | Every `structure.sections[]` item resolves to a Section ID | warn | warn | `structure_section_unresolved` |
| STR-03 | §10.4 | SHOULD | `structure.sections` covers every existing Section | warn | warn | `structure_section_omitted` |
| STR-04 | §10.9 | SHOULD | No duplicate IDs in `structure.sections` | warn | warn | `structure_section_duplicate` |
| STR-05 | §10.6–10.7 | SHOULD | `groups[].sections[]` / `views[].sections[]` refs, when present, resolve to Section IDs | warn | warn | `structure_reference_invalid` |

## 10. EXT / XID — extensions, unknown fields, cross-cutting

| Rule | Part 4 | Level | Check | Core | Strict | Code |
| --- | --- | --- | --- | --- | --- | --- |
| EXT-01 | §3.10–3.11, §13.7 | SHOULD | Unknown, non-namespaced fields inside Core objects (not in the per-namespace known-field set, no `x-` prefix) | warn | error | `unknown_field` |
| EXT-02 | §3.10, §12.5, §13.11 | MAY | Clearly namespaced extension fields (`x-*`) and `extensions` namespace content: preserved; no Core diagnostic. Strict: rejected as undeclared (no profile support in v0.3.1, D8) | info | error | `undeclared_extension` |
| EXT-03 | §12.4 | SHOULD | `extensions`, when present, is a mapping | warn | warn | `field_wrong_type` |
| XID-01 | §1.4, §3.4 | SHOULD | Same ID string used in more than one required namespace | warn | warn | `cross_namespace_id_reuse` |
| XID-02 | §1.5, §13.8 | MAY | ID does not use the recommended prefix (`src- sec- occ- ent-`). Never a failure (§3.6) | info | info | `id_prefix_unconventional` |
| NUL-01 | §3.12 | SHOULD | Optional field serialized as explicit `null` | warn | warn | `null_optional_field` |

---

## 11. Strict-mode promotion summary (D8)

Strict mode = Core mode plus the following changes. Nothing else differs.

Promoted to **error**: `yaml_restricted_feature`, `empty_namespace`, `unknown_namespace`,
`unknown_status`, `profile_unsupported`, `unknown_projection_role`, `unknown_source_type`,
`source_metadata_missing`, `placeholder_object`, `occurrence_entity_missing`,
`occurrence_role_missing`, `unknown_anchor_type`, `unknown_precision`, `unknown_field`,
`undeclared_extension`.

Kept as **warning** even in strict (referential hygiene, not §13.4 MAY-reject items):
`duplicate_occurrence_reference`, `occurrence_unreferenced`, `occurrence_multi_section`,
`entity_unreferenced`, `confidence_out_of_range`, `anchor_range_invalid`,
`anchor_fields_incomplete`, `structure_*`, `cross_namespace_id_reuse`,
`null_optional_field`, `timestamp_malformed`, `projection_reference_malformed`,
`source_type_missing`. Use `--fail-on-warn` to make these fail the run.

Kept as **info**: `source_unreferenced`, `anchor_precision_note`, `id_prefix_unconventional`.

## 12. What validation never does (§13.14)

No source URI dereferencing, no source content verification, no Projection semantics,
no Entity granularity judgment, no retrieval concerns, no payload schema validation.

## SKEL — optional Skeleton Graph basic checks (v0.3.1)

- SKEL-01: `skeletons` should be an array when present.
- SKEL-02: each graph should be a mapping.
- SKEL-03: each graph should have a non-empty string `id`.
- SKEL-04: graph-local node/link ids and document-level graph ids should not duplicate.
- SKEL-05/SKEL-06: `nodes` and `links` should be arrays when present.
- SKEL-07/SKEL-08: node/link ids should be non-empty strings.
- SKEL-09: `links[].from` and `links[].to` should resolve to node ids in the same graph.
- SKEL-10: local Core object refs in `nodes[].ref` should resolve in the document.
- SKEL-11: known skeleton link type hints are advisory; unknown types remain warnings.
