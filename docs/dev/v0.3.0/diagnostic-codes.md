# IdeaMark CLI v0.3.0 — Diagnostic Code Registry

**Target spec:** IdeaMark Core v1.2.0 (Part 4 delegates diagnostic codes to the CLI, §19.7.1)  
**Status:** Phase 0 draft

Registry rules:

- Codes are `snake_case`, stable across v0.3.x. Removing or renaming a code is a
  breaking CLI-contract change.
- Every code maps to one or more rule IDs in
  [`validation-checklist.md`](./validation-checklist.md); severity per mode is defined
  there and summarized here.
- Diagnostic records carry the machine-readable envelope defined in
  [`cli-contract-v1.2.0.md`](./cli-contract-v1.2.0.md) §3, including the `rule` field.

Severity legend: value shown as `core / strict`.

## 1. Errors — load and document shape

| Code | Severity | Rules | Meaning |
| --- | --- | --- | --- |
| `yaml_parse_error` | error / error | LOAD-01 | Input is not parseable YAML |
| `top_level_not_mapping` | error / error | LOAD-02 | Top level is not a single mapping |
| `input_not_utf8` | error / error | LOAD-03 | Input cannot be decoded as UTF-8 |
| `legacy_document_detected` | error / error | LOAD-05 | Input looks like a v1.1.x `.ideamark.md` document; message directs to `ideamark migrate` |
| `required_namespace_missing` | error / error | NS-01 | A required top-level namespace is absent |
| `required_namespace_wrong_type` | error / error | NS-02 | Required namespace has the wrong YAML type |

## 2. Errors — meta

| Code | Severity | Rules | Meaning |
| --- | --- | --- | --- |
| `meta_field_missing` | error / error | META-01/03/04 | `spec_version` / `document_id` / `status` absent |
| `meta_field_invalid` | error / error | META-01/03/04 | Required meta field present but null / empty / non-string |
| `spec_version_unsupported` | error† / error | META-02 | `spec_version` is not `ideamark-core-v1.2.0`. † `--allow-unsupported-spec` downgrades to warning (D7) |

## 3. Errors — objects and references

| Code | Severity | Rules | Meaning |
| --- | --- | --- | --- |
| `object_not_mapping` | error / error | SRC/SEC/OCC/ENT-01, ANC-02 | Item in a Core object array (or anchor array) is not a mapping |
| `object_id_invalid` | error / error | SRC/SEC/OCC/ENT-02 | `id` missing, null, empty, or non-string |
| `duplicate_id` | error / error | SRC/SEC/OCC/ENT-03 | Duplicate `id` within one namespace |
| `field_wrong_type` | error / error | SEC-04, ENT-04/05, ANC-01, EXT-03* | A typed Core field has the wrong YAML type (*EXT-03 is warn-level; severity comes from the rule) |
| `unresolved_reference` | error / error | SEC-05, OCC-06, ANC-05 | A required Core reference does not resolve (`sections[].occurrences[]`, `occurrences[].entity`, `anchors[].source`) |
| `anchor_field_missing` | error / error | ANC-03/04 | Anchor lacks required `source` or `type` |

## 4. Warnings — placeholders and completeness

| Code | Severity | Rules | Meaning |
| --- | --- | --- | --- |
| `placeholder_object` | warn / error | SEC-06, ENT-06 | Object lacks the fields needed for reconstruction (D5: judged by field absence alone). Message appends: "if intentional, mark it with `status: draft`" |
| `occurrence_entity_missing` | warn / error | OCC-04 | Occurrence lacks `entity` (placeholder family, same message suffix) |
| `occurrence_role_missing` | warn / error | OCC-05 | Occurrence lacks `role` (placeholder family, same message suffix) |
| `source_metadata_missing` | warn / error | SRC-06 | Source has no `title` / `uri` / `description` (placeholder family) |
| `source_type_missing` | warn / warn | SRC-04 | Source has no `type` |
| `empty_namespace` | info / error | NS-04 | Required namespace is an empty collection |

## 5. Warnings — vocabulary (open in Core mode, D8 promotes in strict)

| Code | Severity | Rules | Meaning |
| --- | --- | --- | --- |
| `unknown_status` | warn / error | META-05, SEC-08, OCC-08, ENT-09 | Status outside the recommended vocabulary |
| `unknown_source_type` | warn / error | SRC-05 | Source `type` outside the recommended vocabulary |
| `unknown_anchor_type` | warn / error | ANC-06 | Anchor `type` outside the recommended vocabulary |
| `unknown_precision` | warn / error | ANC-07 | Anchor `precision` outside `exact/approximate/inferred/unknown` |
| `unknown_projection_role` | warn / error | META-08 | Projection `role` outside the recommended vocabulary |

Note: Occurrence `role` and Entity `kind` intentionally have **no** unknown-value code
(OCC-07, ENT-08; see spec-feedback F3).

## 6. Warnings — referential hygiene (never promoted by strict; use `--fail-on-warn`)

| Code | Severity | Rules | Meaning |
| --- | --- | --- | --- |
| `duplicate_occurrence_reference` | warn / warn | SEC-07 | Same Occurrence listed twice in one Section |
| `occurrence_unreferenced` | warn / warn | OCC-10 | Occurrence not referenced by any Section |
| `occurrence_multi_section` | warn / warn | OCC-11 | Occurrence referenced by multiple Sections |
| `entity_unreferenced` | warn / warn | ENT-10 | Entity not referenced by any Occurrence |
| `confidence_out_of_range` | warn / warn | OCC-09 | `confidence` not a number in [0, 1] |
| `anchor_range_invalid` | warn / warn | ANC-08 | Malformed `ranges` (non-integer bounds, `start > end`, non-mapping items) |
| `anchor_fields_incomplete` | warn / warn | ANC-09 | Anchor lacks its type-specific recommended fields |
| `structure_invalid` | warn / warn | STR-01 | `structure` / `structure.sections` has the wrong shape |
| `structure_section_unresolved` | warn / warn | STR-02 | `structure.sections[]` item is not an existing Section ID |
| `structure_section_omitted` | warn / warn | STR-03 | An existing Section is missing from `structure.sections` |
| `structure_section_duplicate` | warn / warn | STR-04 | Duplicate Section ID in `structure.sections` |
| `structure_reference_invalid` | warn / warn | STR-05 | `groups` / `views` reference a missing Section |
| `cross_namespace_id_reuse` | warn / warn | XID-01 | Same ID string used in multiple namespaces |
| `null_optional_field` | warn / warn | NUL-01 | Optional field serialized as explicit `null` |
| `timestamp_malformed` | warn / warn | META-10 | Timestamp field does not look like ISO 8601 |
| `projection_reference_malformed` | warn / warn | META-07 | `meta.projections` item is not a mapping or lacks `role` and `ref`/`inline` |

## 7. Warnings — unknown data and extensions

| Code | Severity | Rules | Meaning |
| --- | --- | --- | --- |
| `unknown_namespace` | warn / error | NS-03 | Unknown top-level namespace (preserved; never interpreted as Core) |
| `unknown_field` | warn / error | EXT-01 | Unknown, non-namespaced field inside a Core object |
| `undeclared_extension` | info / error | EXT-02 | Namespaced extension data (`x-*`, `extensions`) present; Core preserves silently (info under `--info`), strict rejects while profiles are unsupported |
| `yaml_restricted_feature` | warn / error | LOAD-04 | YAML anchors/aliases, custom tags, merge keys, or multi-doc stream in input |
| `profile_unsupported` | warn / error | META-06 | Declared profile not supported; profile validation was not performed |

## 8. Info (emitted only with `--info`)

| Code | Severity | Rules | Meaning |
| --- | --- | --- | --- |
| `source_unreferenced` | info / info | SRC-07 | Source not referenced by any anchor |
| `anchor_precision_note` | info / info | ANC-10 | Anchor declared `approximate` or `inferred` |
| `id_prefix_unconventional` | info / info | XID-02 | ID does not use the recommended `src-/sec-/occ-/ent-` prefix |

## 9. Command-scoped codes (non-validate)

Command-scoped codes are not produced by checklist rules; their envelope `rule` field
is the literal `CLI`.

### migrate

| Code | Severity | Meaning |
| --- | --- | --- |
| `migration_source_unrecognized` | error | Input is neither a v1.1.x document nor otherwise migratable |
| `migration_reference_unresolved` | warn† | A reference could not be resolved during migration; preserved with warning (§14.8). † error with `migrate --strict` |
| `migration_placeholder_created` | warn | Migration created an explicit placeholder object for missing material (§14.8) |
| `migration_data_preserved_as_extension` | info | Legacy data with no v1.2.0 home was preserved under an extension field (§14.10) |
| `migration_status_mapped` | info | Legacy status value was conservatively mapped (§14.7) |

### format

| Code | Severity | Meaning |
| --- | --- | --- |
| `format_noop` | info | Input already in target form |
| `canonical_reordered` | info | Canonical mode reordered namespaces/keys (explicit mode only, §15.8) |

### common

| Code | Severity | Meaning |
| --- | --- | --- |
| `unsupported_for_spec` | error | Command does not support this document's spec version in v0.3.0 (`extract` / `compose` / `publish` / `diff` / `lint` on v1.2.0 input) |
