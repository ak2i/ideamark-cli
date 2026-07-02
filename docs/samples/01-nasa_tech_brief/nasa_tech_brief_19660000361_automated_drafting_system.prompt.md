# Prompt: Convert NASA Tech Brief to IdeaMark v1.1.1 YAML-first

## Inputs
- Source file: `./nasa_tech_brief_19660000361_automated_drafting_system.md`
- Output file: `./nasa_tech_brief_19660000361_automated_drafting_system.ideamark.yaml`

## Required constraints
- Conform to IdeaMark spec `v1.1.1`.
- Include strict header fields.
- Use YAML-first output only. Do not produce Markdown-embedded IdeaMark.
- Keep IDs unique and references resolvable.
- Place `entities`, `occurrences`, `sections`, `relations`, `perspectives`, and `structure` at the top level.

## Entity / payload constraints
- Every entity must include `payload`.
- Every payload must include at least one of `body`, `ref`, or `cache`.
- If `payload.ref` is present, include `payload.ref.uri`.
- Prefer `payload.body` with `payload.format.media_type`.

## Reference constraints
- `occurrence.entity` must resolve to an existing entity.
- `section.occurrences[]` must resolve to existing occurrences.
- If no relations or perspectives are needed, emit `relations: {}` and `perspectives: {}`.
- Do not wrap namespaces under a top-level `registry:` key.

## Quality gate
- Must pass: `ideamark validate --mode working ./nasa_tech_brief_19660000361_automated_drafting_system.ideamark.yaml`
- Must pass: `ideamark validate --mode strict ./nasa_tech_brief_19660000361_automated_drafting_system.ideamark.yaml`
