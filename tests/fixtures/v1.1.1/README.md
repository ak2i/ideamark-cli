# IdeaMark v1.1.1 Reference Corpus

Fixture documents for IdeaMark Core v1.1.1 (`docs/specs/V1.1.1/`), used by
`tests/internal/validate-v111-corpus.test.js`. Every error/warning class in
Core Constraints §7.15 has at least one corresponding fixture.

## valid/

All documents here MUST pass `ideamark validate --strict` with zero
diagnostics.

| Fixture | Covers |
|---|---|
| `minimal-body.ideamark.md` | Minimal document; payload with `body` only (§7.7) |
| `payload-ref-only.ideamark.md` | `ref` only; `ref.uri` + optional `selector` (§7.7, §7.9) |
| `payload-cache-only.ideamark.md` | `cache` only (§7.7, §7.10) |
| `payload-body-ref.ideamark.md` | `body + ref` (§7.7) |
| `payload-ref-cache.ideamark.md` | `ref + cache` (§7.7) |
| `payload-body-ref-cache.ideamark.md` | `body + ref + cache` (§7.7) |
| `multi-role-entity.ideamark.md` | Same entity activated as claim / evidence / constraint (Core Model §4.1) |
| `external-entity-reuse.ideamark.md` | Occurrence referencing an entity id in ANOTHER document — the recursive usage-log case; external refs are opaque, never errors |
| `external-shorthand-ref.ideamark.md` | Shorthand external reference form `{doc_id}#{element_id}` (Core Spec §9.2 / ADR-0003) |
| `relations-perspectives.ideamark.md` | `relations` as relation_id map with entity_ref and section_ref endpoints (Core Spec §6.2); perspectives / perspective_scope |
| `normalization-single-values.ideamark.md` | Single values in multi-value fields, normalized to arrays (§7.13) |
| `unknown-fields-profile.ideamark.md` | Unknown fields ignored; unknown payload profile does not invalidate (§7.18); uncontrolled vocabulary (§7.12) |

## invalid/

`err-*` documents MUST fail validation with the listed error code.
`warn-*` documents MUST pass validation (exit 0) while emitting the listed
warning — §7.15 keeps these as warnings, never errors.

| Fixture | §7.15 class | Expected code |
|---|---|---|
| `err-ref-occurrence-entity.ideamark.md` | invalid references | `entity_ref_invalid` |
| `err-ref-section-occurrence.ideamark.md` | invalid references | `occurrence_ref_invalid` |
| `err-ref-relation-from.ideamark.md` | invalid references | `relation_from_invalid` |
| `err-ref-relation-to.ideamark.md` | invalid references | `relation_to_invalid` |
| `err-dup-entity-id.ideamark.md` | duplicate identifiers | `id_duplicate` |
| `err-dup-occurrence-id.ideamark.md` | duplicate identifiers | `id_duplicate` |
| `err-dup-section-id.ideamark.md` | duplicate identifiers | `id_duplicate` |
| `err-dup-relation-id.ideamark.md` | duplicate identifiers | `id_duplicate` |
| `err-dup-perspective-id.ideamark.md` | duplicate identifiers | `id_duplicate` |
| `err-missing-occurrence-entity.ideamark.md` | missing required fields | `occurrence_entity_required` |
| `err-missing-occurrence-role.ideamark.md` | missing required fields | `occurrence_role_required` |
| `err-empty-section-occurrences.ideamark.md` | missing required fields | `section_occurrences_required` |
| `err-missing-payload.ideamark.md` | missing payload | `payload_required` |
| `err-empty-payload.ideamark.md` | payload without body/ref/cache | `payload_content_required` |
| `err-ref-without-uri.ideamark.md` | ref without uri | `payload_ref_uri_required` |
| `warn-missing-media-type.ideamark.md` | missing media_type | `payload_media_type_missing` |
| `warn-missing-captured-at.ideamark.md` | missing captured_at | `payload_captured_at_missing` |
| `warn-unused-entity.ideamark.md` | unused entities | `entity_unused` |
| `warn-unused-section.ideamark.md` | CLI hygiene warning (§7.17 / ADR-0004; removed from Core §7.15) | `section_unused` |
| `warn-ambiguous-relation-ref.ideamark.md` | ambiguous relation references (Core Spec §6.3 / ADR-0001) | `relation_ref_ambiguous` |
| `warn-unresolved-perspective-ref.ideamark.md` | unresolved perspective references (Core Spec §2.4 / ADR-0002) | `perspective_ref_unresolved` |

Notes:

- Duplicate-id fixtures declare the same id in two registry blocks, because
  duplicate keys inside a single YAML mapping are already rejected by the YAML
  parser (`yaml_parse_error`).
- `section_unused` is a CLI hygiene warning (ADR-0004), not a Core §7.15 item:
  the v1.1.1 model has no definition of section "use", so the CLI warns only
  when an explicit `structure.sections` listing omits the section.
