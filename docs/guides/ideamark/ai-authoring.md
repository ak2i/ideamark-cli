# IdeaMark AI Authoring Guide

Use this guide when generating IdeaMark documents for humans to review and tools to process.

Principles:
- Produce valid IdeaMark YAML blocks (frontmatter and fenced `yaml` blocks).
- Keep IDs stable and unique within a document.
- Use concise, factual language and avoid speculation.
- Prefer explicit structure over prose when capturing sections, occurrences, and entities.

Do:
- Include a document header block.
- Keep references resolvable within the document.
- Use the published vocab for `anchorage.view`, `anchorage.phase`, and `status.state`.

Do not:
- Invent IDs that collide with existing ones.
- Refer to entities or occurrences that do not exist.
- Omit required fields in strict mode.

Checklist:
- Header includes `ideamark_version`, `doc_id`, `doc_type`, `status`, `created_at`, `updated_at`, `lang` (strict mode).
- Each `section_id` has `anchorage.view` and `anchorage.phase` (strict mode).
- Every `occurrence_id` references an `entity` (or uses `inline: true`).

Example:
- A section contains `section_id: SEC-001` and `anchorage.view: background`.
