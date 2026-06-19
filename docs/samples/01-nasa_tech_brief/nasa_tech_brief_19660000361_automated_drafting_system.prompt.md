# Prompt: Convert NASA Tech Brief to IdeaMark v1.1.1 (yaml-based)

## Inputs
- Source file: `./nasa_tech_brief_19660000361_automated_drafting_system.md`
- Output file: `./nasa_tech_brief_19660000361_automated_drafting_system.ideamark.yaml`

## Required constraints
- Conform to IdeaMark spec `v1.1.1`.
- Include strict header fields.
- Keep IDs unique and references resolvable.
- Include `entities`, `occurrences`, and `sections`.
- Ensure every entity has `payload.body`, `payload.ref`, or `payload.cache`.

## Structural constraints (must)
- Use whole-document YAML output.
- Each occurrence must point to an existing entity.
- Each section must list existing occurrences.
- If `structure.sections` is emitted, keep it aligned with the section IDs.

## Quality gate
- Must pass: `ideamark validate --mode strict`
