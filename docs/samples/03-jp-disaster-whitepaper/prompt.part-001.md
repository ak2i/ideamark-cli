# Prompt part-001: r6_dai1bu1.pdf -> IdeaMark

## Inputs
- PDF: `./r6_dai1bu1.pdf`
- Template: `./sample-template.ideamark.template.md`
- Output: `./doc.part-001.ideamark.md`

## Rules
- Follow IdeaMark v1.0.3 strict header requirements.
- Apply template baseline sections with local adaptation.
- Use section-local ordering: section -> listed occurrences -> next section.
- Add human-readable text after each YAML block.
- Use reference_mode auto and include structured references because source PDF is explicit.
- Keep IDs unique with prefix `P1-`.
