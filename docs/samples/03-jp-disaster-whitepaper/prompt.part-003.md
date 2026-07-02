# Prompt part-003: r6_tokushu2_1.pdf -> IdeaMark

## Inputs
- PDF: `./r6_tokushu2_1.pdf`
- Template: `./sample-template.ideamark.template.md`
- Output: `./doc.part-003.ideamark.yaml`

## Rules
- Follow IdeaMark v1.1.1 strict header requirements.
- Output YAML-first only. Do not produce Markdown-embedded IdeaMark.
- Place `entities`, `occurrences`, `sections`, `relations`, `perspectives`, and `structure` at the top level.
- Every entity must include `payload`.
- Extract earthquake impact, response, and forward policy actions.
- Use reference_mode auto and include structured references.
- Do not create a top-level `registry:` wrapper.
- Keep IDs unique with prefix `P3-`.
