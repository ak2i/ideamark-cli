# IdeaMark Params

Overview:
This file summarizes normalization constraints for tooling.
Working mode focuses on structure and references; strict mode adds required header fields.

Required (working):
- Document header block exists.
- IDs are unique within a document.
- References resolve to existing entities/occurrences/sections.

Optional (working):
- `doc_id` format: string (strict mode requires it).
- `section_id` format: `SEC-*` (required when a section is defined).
- `occurrence_id` format: `OCC-*` (required when an occurrence is defined).
- `entity_id` format: `IE-*` (required when an entity is defined).
- `anchorage.view` and `anchorage.phase` should use the published vocab (strict mode requires them for sections).
- `status.state` should be one of the published values (strict mode requires it).
- `occurrence.role` should use the published vocab.
- `entity.kind` should use the published vocab.

Examples:
- `section_id`: `SEC-001`
- `occurrence_id`: `OCC-001`
- `entity_id`: `IE-001`
