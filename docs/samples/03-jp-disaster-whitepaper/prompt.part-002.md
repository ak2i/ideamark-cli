# Prompt part-002: r6_dai3bu.pdf -> IdeaMark

## Inputs
- PDF: `./r6_dai3bu.pdf`
- Template: `./sample-template.ideamark.template.md`
- Output: `./doc.part-002.ideamark.yaml`

## Rules
- Follow IdeaMark v1.1.1 strict header requirements.
- Output YAML-first only. Do not produce Markdown-embedded IdeaMark.
- Place `entities`, `occurrences`, `sections`, `relations`, `perspectives`, and `structure` at the top level.
- Every entity must include `payload`.
- Extract planned measures and policy/program structure.
- Use reference_mode auto and include structured references.
- Do not create a top-level `registry:` wrapper.
- Keep IDs unique with prefix `P2-`.
