# IdeaMark AI Authoring Guide

Use this guide when generating IdeaMark documents for humans to review and tools to process.

Principles:
- Produce valid IdeaMark YAML blocks (frontmatter and fenced `yaml` blocks).
- Keep IDs stable and unique within a document.
- Use concise, factual language and avoid speculation.
- Prefer explicit structure over prose when capturing sections, occurrences, and entities.

Checklist:
- Header includes `ideamark_version`, `doc_id`, `doc_type`, `status`, `created_at`, `updated_at`, `lang`.
- Each `section_id` has `anchorage.view` and `anchorage.phase`.
- Every `occurrence_id` references an `entity` (or uses `inline: true`).
