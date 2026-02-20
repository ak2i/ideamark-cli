# IdeaMark Spec: ideamark CLI v0.1.1 Delta (dev v0.2)

```yaml
ideamark_version: 1
doc_id: "ideamark.cli.ideamark-cli.spec"
doc_type: "spec"
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
      description: "FlowMark形式の網羅テストカタログ（batch/refs付き）"
    - uri: "./ideamark-cli_test-spec_validate_v0.8.ideamark.md"
      relation: "related"
      description: "validateの受け入れ基準（diagnostics契約・グルーピング）"
    - uri: "./ideamark-cli_test-spec_compose_v0.8.ideamark.md"
      relation: "related"
      description: "composeの受け入れ基準（rename/参照追随）"
constraints:
  - "Strict運用（YAML必須）を前提にする"
  - "外部参照（URL/FQID）は本書では使用しない"
  - "意味解釈はしない（heuristicのみ）"
```

## Purpose

This document is a **delta spec** for IdeaMark CLI **v0.1.1**, intended to be read together with the v0.1.0 baseline CLI spec.
It only defines additions/changes required for v0.1.1.

### Baseline reference (v0.1.0)

- Use the v0.1.0 CLI spec as the source of truth for existing commands and behaviors.
- v0.1.1 must be backward compatible unless stated otherwise.

---

## Changes in v0.1.1

### 1) Global flags

#### `-h, --help`
- Available for the root command and for every subcommand.
- Prints help to stdout and exits with code `0`.

#### `--version`
- Available as `ideamark --version`.
- Prints version to stdout and exits with code `0`.

Usage errors must exit with code `2`.

---

### 2) `ideamark describe` topics

v0.1.1 adds two new topics intended to be embedded into responder-bridge prompts.
`--spec` and `--pattern` are **out of scope** in v0.1.1.

**Signature (unchanged):**
```bash
ideamark describe <topic> [--format json|yaml|md]
```

**New topics:**
- `ai-authoring`
  - Outputs an AI authoring guide (LLM-facing).
  - Default format: `md`
- `params`
  - Outputs normalization constraints (tool-facing).
  - Default format: `json`

**Template location (repository):**
- `docs/guides/ideamark/ai-authoring.md`
- `docs/guides/ideamark/params.json`
- (optional for humans) `docs/guides/ideamark/params.md`

**Behavior:**
- The CLI returns the corresponding template content verbatim (format conversion is optional; v0.1.1 may ship per-format templates).
- Unknown topic => exit `2`.

---

### 3) New command: `ideamark ls`

`ls` provides a quick index of IDs and vocab used in a document so users can pick targets for `extract`/`compose`.

```bash
ideamark ls [<infile>|-]
            [--sections] [--occurrences] [--entities] [--vocab]
            [--format json|md]
```

#### Defaults
- If none of `--sections/--occurrences/--entities/--vocab` is provided, output **all**.

#### Output (stdout)
- `--format md` (default): human-readable listing
- `--format json`: machine-readable

#### Diagnostics (stderr)
- Emits NDJSON diagnostics only when useful (e.g., parse anomalies).

#### Exit codes
- `0`: success (even if warnings)
- `1`: cannot parse the input document
- `2`: usage error

#### Required fields (JSON)
- `sections[]`: `{ id, view?, phase?, title?, occ_count? }`
- `occurrences[]`: `{ id, role?, entity?, section? }`
- `entities[]`: `{ id, kind? }`
- `vocab`: maps of unique values found (e.g., `anchorage.view`, `anchorage.phase`, `occurrence.role`, `entity.kind`, `status.state`)

Ordering is not strictly specified in v0.1.1, but should be stable (recommended: by ID).

---

## Non-goals (v0.1.1)

- `describe --spec` (extracting guides/params from IdeaMark spec documents)
- `describe --pattern` (flexible pattern-based outputs)
- arbitrary anchorage filtering inside `describe`
- lint/diff (planned for v0.2.x)
