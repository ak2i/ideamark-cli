# IdeaMark Background: ideamark CLI v0.1.1 Delta (dev v0.2)

```yaml
ideamark_version: 1
doc_id: "ideamark.cli.ideamark-cli.background"
doc_type: "background"
target_software: "ideamark-cli"
target_release: "v0.1.1"
status: "draft"
created_at: "2026-02-17"
updated_at: "2026-02-21"
lang: "ja-JP"
refs:
  sources: []
  derived_from: []
related:
    - uri: "./ideamark-cli_test-catalog_v0.8.flowmark.md"
      relation: "related"
    - uri: "./ideamark-cli_test-spec_validate_v0.8.ideamark.md"
      relation: "related"
    - uri: "./ideamark-cli_test-spec_compose_v0.8.ideamark.md"
      relation: "related"
constraints:
  - "Strict運用（YAML必須）を前提にする"
  - "外部参照（URL/FQID）は v0.1.0 では解決しない（存在検証のみ）"
```

## Purpose

This document describes the motivation for IdeaMark CLI **v0.1.1** as a **small usability upgrade** over v0.1.0.
It is intentionally limited to changes required for near-term day-to-day use.

---

## Why v0.1.1 (motivations)

### 1) Daily usability
- Users need `--help` and `--version` for practical use and for automation integration.

### 2) Promptable “fixed parts” for responder-bridge
- FlowMark succeeded by exposing **AI authoring guides** and **params normalization** via `describe`.
- IdeaMark v0.1.1 adopts the same approach by adding:
  - `ideamark describe ai-authoring`
  - `ideamark describe params`
- These are shipped as repository templates under `docs/guides/ideamark/`.

### 3) Extract requires “discoverability”
- Without an index command, users cannot know `section_id` / `occurrence_id` to pass into `extract`.
- `ideamark ls` solves this with a lightweight document index output.

---

## Compatibility expectations

- Existing v0.1.0 commands and their I/O contracts remain unchanged.
- v0.1.1 adds new flags/topics/command only; no breaking changes intended.

---

## Out of scope

- spec-driven `describe --spec` / `--pattern`
- anchorage-based arbitrary filtering in `describe`
- lint/diff
