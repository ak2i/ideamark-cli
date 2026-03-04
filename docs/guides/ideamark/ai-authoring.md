# IdeaMark AI Authoring Guide

Use this guide when generating IdeaMark documents for human review, automation, and routing-aware discovery.

Principles:
- Produce valid IdeaMark YAML blocks (frontmatter and fenced `yaml` blocks).
- Keep IDs stable and unique within a document.
- Use concise, factual language and avoid speculation.
- Prefer explicit structure over prose when capturing sections, occurrences, and entities.
- Use non-blocking validation in working loops and strict validation before handoff.

Do:
- Include a document header block.
- Keep references resolvable within the document.
- Use the published vocab for `anchorage.view`, `anchorage.phase`, and `status.state`.
- Tag sections with `anchorage.domain` for routing/discovery use.

Do not:
- Invent IDs that collide with existing ones.
- Refer to entities or occurrences that do not exist.
- Omit required fields in strict mode.
- Skip the `generate -> validate -> breakdown` loop for large documents.

Checklist:
- Header includes `ideamark_version`, `doc_id`, `doc_type`, `status`, `created_at`, `updated_at`, `lang` (strict mode).
- Each `section_id` has `anchorage.view` and `anchorage.phase` (strict mode).
- Every `occurrence_id` references an `entity` (or uses `inline: true`).
- Run minimal validation: `header_singleton`, `yaml_parseable`, `id_unique_within_doc`, `references_resolvable`.

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
