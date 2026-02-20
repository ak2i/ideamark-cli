# IdeaMark WorkCell: Decision6 WorkCell v0.1.1 Delta (dev v0.2)

<!---
  Document メタ情報
  機械処理はこの YAML ブロックから開始
  refs/URL は未確定のため空
--->
```yaml
ideamark_version: 1
doc_id: "ideamark.cli.ideamark-cli.workcell.decision6"
doc_type: "pattern"
status: "completed"
created_at: "2026-02-17"
updated_at: "2026-02-21"
lang: "ja-JP"

template:
  file: "Decision6-WorkCell.ideamark.template.md"
  description: "Decision6 WorkCell Template"
refs:
  sources:
    - id: "tpl.decision6.workcell"
      uri: "./Decision6-WorkCell.ideamark.template.md"
      role: "template"
      description: "Decision6 WorkCell Template"

  derived_from: []
  related:
    - uri: "./ideamark-cli_test-catalog_v0.8.flowmark.md"
      relation: "related"
      description: "FlowMark形式の網羅テストカタログ（v0.8）"
    - uri: "./ideamark-cli_test-spec_validate_v0.8.ideamark.md"
      relation: "related"
      description: "validateの受け入れ基準（v0.8）"
    - uri: "./ideamark-cli_test-spec_compose_v0.8.ideamark.md"
      relation: "related"
      description: "composeの受け入れ基準（v0.8）"
```

## WorkCell delta notes (v0.1.1)

This WorkCell note is a delta summary to help implementation and testing.

### Added capabilities
- Global flags: `--help`, `--version`
- `describe` topics: `ai-authoring`, `params` (templates under `docs/guides/ideamark/`)
- New command: `ls` for ID/vocab discoverability

### Testing guidance
- Add smoke tests that:
  - `ideamark --version` returns version and exit 0
  - `ideamark ls` returns IDs for a fixture document and exit 0
  - `ideamark describe ai-authoring` returns the shipped guide (md)
  - `ideamark describe params --format json` returns the shipped params (json)
