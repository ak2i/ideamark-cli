# IdeaMark Prompt Authoring Guide

Use this topic to build LLM prompts outside ideamark-cli while keeping output quality aligned with spec v1.0.3.

Overview:
- Prompt generation remains an external responsibility (orchestrator, bridge, app).
- `ideamark describe prompt-authoring` provides reusable constraints and prompt skeleton guidance.
- Goal: avoid YAML-only outputs and keep both machine-valid structure and human-readable narrative.

Required prompt inputs:
- Source material path(s) or text.
- Target output path.
- Target spec/document version (`1.0.3`).
- Desired audience (`human`, `ai`, or mixed).

Output contract to include in prompt:
- Required YAML structure:
  - Header (`ideamark_version`, `doc_id`, `doc_type`, `status`, `created_at`, `updated_at`, `lang`)
  - Section YAML blocks
  - Occurrence YAML blocks
  - Registry YAML block (`entities`, `occurrences`, `sections`, `structure`)
- Ordering requirements:
  - Use local clustering order: `section -> that section's occurrences -> next section`.
  - Emit occurrence blocks in the same order as each section's `occurrences` list.
  - Keep Registry at the end of the document.
- Narrative requirements:
  - After each section YAML block, add 1+ paragraph of natural language summary.
  - After each occurrence YAML block, add at least one sentence explaining the claim/evidence.
  - Do not emit documents composed only of adjacent YAML blocks.

Reference and citation mapping policy:
- Core IdeaMark baseline (always apply):
  - Put machine-resolvable source links in `refs.sources[]` (`id`, `uri`, `role`, `description`).
  - Represent citation/provenance as entities (typically `kind: context` or `kind: evidence`) and attach with `occurrence.role: citation`.
  - Link claims to sources via `supporting_evidence` and optional `target`.
- Reference detection mode:
  - Use `reference_mode: auto` as default.
  - If explicit references are found in input (Reference section, URL, DOI, bibliographic lines), you MUST generate structured references.
  - If no references are found, you MAY omit `SEC-REFERENCES` and `OCC-REF-*`, and keep provenance minimal.
  - You MUST NOT invent URLs/DOIs/citations that do not exist in source materials.
- Minimum reference set (when references exist):
  - Create one `IE-REF-*` entity + one `OCC-REF-*` occurrence per key source (for example: report page, chapter PDF, DOI).
  - Add a dedicated references section (recommended id: `SEC-...-REFERENCES`) and list all `OCC-REF-*`.
  - Keep aggregate citation (`OCC-...-CITATION`) and link it to individual reference entities via `supporting_evidence`.
- Template-specific profile (optional extension):
  - If a template defines citation/reference rules, apply those additional fields.
  - Do not replace the core baseline; template rules extend it.
  - Record template usage in header `template` and optionally `refs.sources[].role: template`.

Recommended generation flow:
1. Run `ideamark describe ai-authoring --format md` and `ideamark describe checklist --format md`.
2. Build prompt with structure constraints + narrative requirements.
3. Generate draft document.
4. Run `ideamark validate --mode strict`.
5. If errors/warnings exist, fix and re-validate.

Prompt snippets (copyable):
- "For every `section_id` block, write human-readable context paragraphs immediately after the YAML block."
- "For every `occurrence_id` block, write one concise explanation sentence after YAML."
- "YAML validity is required, but prose is also required for human readers."
- "Render in this order: section, occurrences listed by that section, then the next section."
