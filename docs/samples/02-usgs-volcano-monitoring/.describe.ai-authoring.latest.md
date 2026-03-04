# IdeaMark AI Authoring Guide

Use this guide when generating IdeaMark documents for human review, automation, and routing-aware discovery.

Principles:
- Produce valid IdeaMark YAML blocks (frontmatter and fenced `yaml` blocks).
- Keep IDs stable and unique within a document.
- Use concise, factual language and avoid speculation.
- Prefer explicit structure, and pair core YAML blocks with concise Markdown narrative for human readability.
- Use non-blocking validation in working loops and strict validation before handoff.

Do:
- Include a document header block.
- Keep references resolvable within the document.
- Use the published vocab for `anchorage.view`, `anchorage.phase`, and `status.state`.
- Tag sections with `anchorage.domain` for routing/discovery use.
- Add natural-language summaries after section and occurrence YAML blocks.
- Arrange body blocks in local cluster order: section first, then occurrences listed by that section.
- Apply baseline reference mapping: `refs.sources[]` + citation occurrence linkage for provenance.
- If `template` is present, apply template-specific citation/reference extensions in addition to baseline.
- Use `reference_mode: auto`: generate structured references only when explicit references are present in source input.

Do not:
- Invent IDs that collide with existing ones.
- Refer to entities or occurrences that do not exist.
- Omit required fields in strict mode.
- Skip the `generate -> validate -> breakdown` loop for large documents.
- Output YAML-only documents when the audience includes humans.
- Invent references (URLs/DOIs/citations) that are not present in source materials.

Checklist:
- Header includes `ideamark_version`, `doc_id`, `doc_type`, `status`, `created_at`, `updated_at`, `lang` (strict mode).
- Each `section_id` has `anchorage.view` and `anchorage.phase` (strict mode).
- Every `occurrence_id` references an `entity` (or uses `inline: true`).
- Run minimal validation: `header_singleton`, `yaml_parseable`, `id_unique_within_doc`, `references_resolvable`.
- Each section has 1+ paragraph of Markdown narrative linked to its YAML intent.
- Each occurrence has at least one human-readable explanation sentence.
- Each section is immediately followed by its declared occurrences in `section.occurrences` order.
- Source links are present in `refs.sources[]` and citation occurrences link to source evidence.
- Template-specific reference fields (if any) are added without breaking baseline mapping.
- When explicit references exist, individual `IE-REF-*` and `OCC-REF-*` items are generated and grouped under a references section.
- When explicit references do not exist, references section may be omitted without adding fabricated citations.

AI-small fixed procedure:
1. Generate a draft with stable IDs.
2. Run validate in working mode.
3. Run breakdown in `copy` mode if document size exceeds model context.
4. Re-run validate.

AI-large framework:
- PLAN: choose split mode (`copy/ref/hybrid`) and strictness (`working/strict`).
- AUTHOR: produce sections/entities with explicit anchors and references.
- VALIDATE: run validation and close all error diagnostics.
- TRANSFORM: apply breakdown/extract/compose while preserving lineage.

Routing hints:
- If the task is iterative work-item management, route to FlowMark first.
- If the task is knowledge stabilization and structural validation, route to IdeaMark.

Example:
- A section contains `section_id: SEC-001` and `anchorage.view: background`.
