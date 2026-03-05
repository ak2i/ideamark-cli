# Prompt: Convert NASA Tech Brief to IdeaMark v1.0.3 (section-local ordering)

## Inputs
- Source file: `./nasa_tech_brief_19660000361_automated_drafting_system.md`
- Output file: `./nasa_tech_brief_19660000361_automated_drafting_system.ideamark.md`

## Required constraints
- Conform to IdeaMark spec `v1.0.3`.
- Include strict header fields.
- Keep IDs unique and references resolvable.
- Include Section/Occurrence/Registry YAML blocks.

## Ordering constraints (must)
- Render in local cluster order: `section -> that section's occurrences -> next section`.
- Emit occurrence blocks in the same order as `section.occurrences`.
- Keep Registry block at the end.

## Narrative constraints (must)
- After each section YAML block, add one or more Markdown paragraphs.
- After each occurrence YAML block, add at least one Markdown sentence.
- Do not produce YAML-only output.

## Quality gate
- Must pass: `ideamark validate --mode strict`
