# IdeaMark AI Authoring Guide

Use this guide when generating IdeaMark v1.1.1 documents. The baseline representation is YAML-based.

## Principles

- Produce YAML that parses cleanly.
- Keep IDs stable and unique within a document.
- Use concise, factual language.
- Treat `entities`, `occurrences`, and `sections` as the minimum structural units.
- Validate early in working loops and strictly before handoff.

## Do

- Include a valid header with `ideamark_version: "1.1.1"`.
- Create at least one entity, one occurrence, and one section.
- Give every entity a `payload` with `body`, `ref`, or `cache`.
- Make every occurrence point to an existing entity and declare a `role`.
- Make every section list at least one occurrence.
- Use `relations` and `perspectives` only when all references stay resolvable.
- Use `payload.format.media_type` when format matters for routing or downstream use.

## Do Not

- Invent IDs that collide with existing ones.
- Emit empty entity payloads.
- Add `payload.ref` without `payload.ref.uri`.
- Reference entities, occurrences, or sections that do not exist.
- Treat optional metadata such as `anchorage` as required structure.
- Invent external references that are not present in the source materials.

## Checklist

- Header matches IdeaMark `1.1.1`.
- Registry includes `entities`, `occurrences`, and `sections`.
- Every entity has non-empty payload content.
- Every occurrence has `entity` and `role`.
- Every section has a non-empty `occurrences` array.
- All local references resolve.
- Run `validate` in working mode while drafting and strict mode before handoff.

## AI-small Fixed Procedure

1. Create header.
2. Create entity payloads.
3. Create occurrences that point to those entities.
4. Create sections that list those occurrences.
5. Run working validation.
6. Repair diagnostics.
7. Run strict validation.

## AI-large Framework

- PLAN: decide payload shape, relation usage, and strictness.
- AUTHOR: produce entities, occurrences, and sections with stable IDs.
- VALIDATE: close structural and reference diagnostics.
- TRANSFORM: apply extract / compose / publish only after validity is stable.

## Routing Hints

- Use IdeaMark first when structural knowledge stabilization is the main goal.
- Use FlowMark first when iterative task execution is the main goal.

## Example

- Minimal valid pattern: one entity with `payload.body`, one occurrence pointing to that entity, and one section listing that occurrence.
