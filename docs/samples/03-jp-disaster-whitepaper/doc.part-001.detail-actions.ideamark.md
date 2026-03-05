---
ideamark_version: 1
doc_id: "DOC-JP-DISASTER-WP-P1-DETAIL-ACTIONS-001"
doc_type: "derived"
status:
  state: "in_progress"
created_at: "2026-03-05"
updated_at: "2026-03-05"
lang: "ja-JP"
refs:
  parent:
    uri: "./doc.part-001.parent.ideamark.md"
    entity: "IE-P1-KEY-ACTION-SET"
    relation: "elaborates"
  sources:
    - id: "SRC-P1-PDF"
      uri: "./r6_dai1bu1.pdf"
      role: "source_material"
---

# part-001 Detail Actions

## Action Set Detail
```yaml
section_id: "SEC-P1D-ACTIONS"
anchorage:
  view: "solution"
  phase: "plan"
  domain: ["detail", "actions", "part-001"]
occurrences:
  - "OCC-P1D-ACT-HARD-SOFT"
  - "OCC-P1D-ACT-MYTIMELINE"
  - "OCC-P1D-ACT-TRAINING"
  - "OCC-P1D-ACT-SOURCE-REF"
```

本文では、インフラ整備等のハード対策と教育・計画等のソフト対策を同時に進める必要が示される。

```yaml
occurrence_id: "OCC-P1D-ACT-HARD-SOFT"
entity: "IE-P1D-ACT-HARD-SOFT"
role: "solution"
status: { state: "confirmed" }
supporting_evidence: ["IE-P1DA-SOURCE-TEXT"]
```

```yaml
occurrence_id: "OCC-P1D-ACT-MYTIMELINE"
entity: "IE-P1D-ACT-MYTIMELINE"
role: "solution"
status: { state: "confirmed" }
supporting_evidence: ["IE-P1DA-SOURCE-TEXT"]
```

台風接近時の時系列行動計画（マイ・タイムライン）等、個人別行動設計が具体策として記載される。

```yaml
occurrence_id: "OCC-P1D-ACT-TRAINING"
entity: "IE-P1D-ACT-TRAINING"
role: "solution"
status: { state: "confirmed" }
supporting_evidence: ["IE-P1DA-SOURCE-TEXT"]
```

避難訓練参加や備蓄・家具固定といった平時行動が、防災実効性の基盤として提示される。

```yaml
occurrence_id: "OCC-P1D-ACT-SOURCE-REF"
entity: "IE-P1DA-SOURCE-TEXT"
role: "citation"
status: { state: "confirmed" }
```

この詳細文書の根拠テキスト参照。

## References
```yaml
section_id: "SEC-P1D-ACTIONS-REFERENCES"
anchorage:
  view: "background"
  phase: "confirmed"
  domain: ["detail", "references", "part-001"]
occurrences:
  - "OCC-P1D-ACT-SOURCE-REF"
```

## Registry
```yaml
entities:
  IE-P1D-ACT-HARD-SOFT:
    kind: "measure"
    content: "堤防整備・耐震化と、ハザードマップ・教育等のソフト対策を併行実施。"
  IE-P1D-ACT-MYTIMELINE:
    kind: "measure"
    content: "マイ・タイムライン等の個人行動計画を準備する。"
  IE-P1D-ACT-TRAINING:
    kind: "measure"
    content: "避難訓練、備蓄、家具固定等の平時行動を実装する。"
  IE-P1DA-SOURCE-TEXT:
    kind: "evidence"
    content: "第1部第1章の抽出テキスト（行動準備関連箇所）。"
occurrences:
  OCC-P1D-ACT-HARD-SOFT: { occurrence_id: "OCC-P1D-ACT-HARD-SOFT", entity: "IE-P1D-ACT-HARD-SOFT", role: "solution", status: { state: "confirmed" }, supporting_evidence: ["IE-P1DA-SOURCE-TEXT"] }
  OCC-P1D-ACT-MYTIMELINE: { occurrence_id: "OCC-P1D-ACT-MYTIMELINE", entity: "IE-P1D-ACT-MYTIMELINE", role: "solution", status: { state: "confirmed" }, supporting_evidence: ["IE-P1DA-SOURCE-TEXT"] }
  OCC-P1D-ACT-TRAINING: { occurrence_id: "OCC-P1D-ACT-TRAINING", entity: "IE-P1D-ACT-TRAINING", role: "solution", status: { state: "confirmed" }, supporting_evidence: ["IE-P1DA-SOURCE-TEXT"] }
  OCC-P1D-ACT-SOURCE-REF: { occurrence_id: "OCC-P1D-ACT-SOURCE-REF", entity: "IE-P1DA-SOURCE-TEXT", role: "citation", status: { state: "confirmed" } }
sections:
  SEC-P1D-ACTIONS: { anchorage: { view: "solution", phase: "plan", domain: ["detail", "actions", "part-001"] }, occurrences: ["OCC-P1D-ACT-HARD-SOFT", "OCC-P1D-ACT-MYTIMELINE", "OCC-P1D-ACT-TRAINING", "OCC-P1D-ACT-SOURCE-REF"] }
  SEC-P1D-ACTIONS-REFERENCES: { anchorage: { view: "background", phase: "confirmed", domain: ["detail", "references", "part-001"] }, occurrences: ["OCC-P1D-ACT-SOURCE-REF"] }
structure:
  sections: ["SEC-P1D-ACTIONS", "SEC-P1D-ACTIONS-REFERENCES"]
```
