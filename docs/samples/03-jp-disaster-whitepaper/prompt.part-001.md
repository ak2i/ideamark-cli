# Prompt part-001: r6_dai1bu1.pdf -> IdeaMark

## Inputs
- PDF: `./r6_dai1bu1.pdf`
- Template: `./sample-template.ideamark.template.md`
- Output: `./doc.part-001.ideamark.yaml`

## Rules
- Follow IdeaMark v1.1.1 strict header requirements.
- Output YAML-first only. Do not produce Markdown-embedded IdeaMark.
- Place `entities`, `occurrences`, `sections`, `relations`, `perspectives`, and `structure` at the top level.
- Every entity must include `payload`.
- Use reference_mode auto and include structured references because source PDF is explicit.
- Do not create a top-level `registry:` wrapper.
- Keep IDs unique with prefix `P1-`.
