# IdeaMark AI Authoring Guide

Use this guide when generating IdeaMark v1.1.1 documents. The baseline representation is YAML-based.

## Principles

- Produce YAML that parses cleanly.
- Interpret source material through the specified projection before extracting structure.
- Do not produce a neutral summary unless the projection explicitly asks for summarization.
- Capture reusable knowledge units for the projection's future search, decision, or action context.
- The same source may produce different valid IdeaMark documents under different projections.
- Keep IDs stable and unique within a document.
- Use concise, factual language.
- Treat `entities`, `occurrences`, and `sections` as the minimum structural units.
- Validate early in working loops and strictly before handoff.

## Projection First

A projection is the interpretation stance used for extraction. It should describe who is reading the source, why they are reading it, and what kind of reusable knowledge they need.

Typical projection fields:

- `projection_id`
- `role`
- `domain`
- `reuse_goal`
- `primary_interests`
- `preferred_entity_kinds`
- `preferred_occurrence_roles`
- `ignore_unless_relevant`

When a projection is supplied, record it in the output `perspectives` namespace and let it guide extraction choices.

## Do

- Read the projection before reading the source material.
- Include a valid header with `ideamark_version: "1.1.1"`.
- Record the projection in top-level `perspectives` when the output depends on it.
- Create at least one entity, one occurrence, and one section.
- Give every entity a `payload` with `body`, `ref`, or `cache`.
- Make every occurrence point to an existing entity and declare a `role`.
- Make every section list at least one occurrence.
- Prefer entity kinds and occurrence roles that fit the projection's reuse goal.
- Use `relations` and `perspectives` only when all references stay resolvable.
- Use `payload.format.media_type` when format matters for routing or downstream use.

## Do Not

- Convert the source into a generic summary when a projection is supplied.
- Ignore the specified projection, role, reuse goal, or primary interests.
- Extract facts merely because they are prominent in the source; extract them because they matter under the projection.
- Invent IDs that collide with existing ones.
- Emit empty entity payloads.
- Add `payload.ref` without `payload.ref.uri`.
- Reference entities, occurrences, or sections that do not exist.
- Treat optional metadata such as `anchorage` as required structure.
- Invent external references that are not present in the source materials.

## Checklist

- Projection has been read and reflected in extraction choices.
- Header matches IdeaMark `1.1.1`.
- Registry includes `entities`, `occurrences`, and `sections`.
- Every entity has non-empty payload content.
- Every occurrence has `entity` and `role`.
- Every section has a non-empty `occurrences` array.
- All local references resolve.
- If a projection is supplied, `perspectives` records the interpretation stance.
- Run `validate` in working mode while drafting and strict mode before handoff.

## AI-small Fixed Procedure

1. Read the projection.
2. Create header.
3. Create a perspective record for the projection.
4. Create entity payloads selected for the projection's reuse goal.
5. Create occurrences that point to those entities.
6. Create sections that list those occurrences.
7. Run working validation.
8. Repair diagnostics.
9. Run strict validation.

## AI-large Framework

- PROJECT: identify the interpretation stance, reuse goal, and extraction priorities.
- PLAN: decide payload shape, relation usage, perspective usage, and strictness.
- AUTHOR: produce entities, occurrences, and sections with stable IDs.
- VALIDATE: close structural and reference diagnostics.
- TRANSFORM: apply extract / compose / publish only after validity is stable.

## Routing Hints

- Use IdeaMark first when structural knowledge stabilization is the main goal.
- Use FlowMark first when iterative task execution is the main goal.

## Example

- Minimal valid pattern: one entity with `payload.body`, one occurrence pointing to that entity, and one section listing that occurrence.
- Projection-driven pattern: a disaster white paper interpreted by a field operator may extract risks, constraints, measures, and resource requirements; the same source interpreted by a researcher may extract hypotheses, mechanisms, metrics, and evidence gaps.
