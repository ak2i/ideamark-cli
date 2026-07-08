# IdeaMark Prompt Authoring Guide

Use this topic to build external LLM prompts that stay aligned with IdeaMark Core v1.2.0. The baseline representation is YAML-based.

## Overview

- Prompt generation itself remains outside `ideamark-cli`.
- `ideamark describe prompt-authoring` publishes reusable structural constraints.
- Primary goal: preserve YAML validity and resolvable local references.

## Required Prompt Inputs

- source material path or text
- target output path
- target spec version `ideamark-core-v1.2.0`
- desired audience

## Output Contract

Required YAML units:
- header
- top-level `entities`
- top-level `occurrences`
- top-level `sections`

Ordering and coherence requirements:
- Keep section and occurrence references easy to trace.
- If `structure.sections` is emitted, align it with real section IDs.
- Do not emit references to undefined entities, occurrences, or sections.

Payload requirements:
- Every entity must have `payload`.
- Every payload must contain at least one of `body`, `ref`, or `cache`.
- If `payload.ref` exists, include `payload.ref.uri`.

## Reference Policy

Local reference baseline:
- `occurrence.entity` must resolve to an entity ID.
- `section.occurrences[]` must resolve to occurrence IDs.
- relation endpoints may target entity or section refs.

External reference baseline:
- Use `payload.ref.uri` for explicit source-backed references.
- Do not invent URLs, citation identifiers, or bibliographic entries.
- Choose `body`, `ref`, or `cache` according to available source fidelity.

Template extension policy:
- Template rules may extend the structure.
- Template rules must not replace base payload or local reference rules.

## Recommended Generation Flow

1. Run `ideamark describe ai-authoring --format md`.
2. Run `ideamark describe params --format md`.
3. Build the prompt with structural rules.
4. Generate draft document.
5. Run `ideamark validate --mode working`.
6. Repair diagnostics.
7. Run `ideamark validate --mode strict`.

## Prompt Snippets

- "Generate IdeaMark Core v1.2.0 YAML with valid header, entities, occurrences, and sections."
- "Do not create a top-level `registry:` wrapper."
- "Every occurrence must point to an existing entity."
- "Every section must list existing occurrences."
- "Do not invent external references or unresolved local IDs."

## Recommended ChatGPT command set

If you are assembling a conversion prompt for ChatGPT, start with:

```bash
ideamark describe prompt-authoring --format json --audience ai --model large --lang ja-JP
ideamark describe ai-authoring --format json --audience ai --model large --lang ja-JP
ideamark describe params --format json --audience ai --model large --lang ja-JP
ideamark describe checklist --format md --audience ai --model large --lang ja-JP
ideamark describe vocab --format md --audience ai --model large --lang ja-JP
```

Use `json` for structural guidance and `md` for human-readable checklist / vocab review.
