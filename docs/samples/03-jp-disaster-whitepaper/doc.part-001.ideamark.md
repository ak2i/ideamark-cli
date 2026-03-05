---
ideamark_version: 1
doc_id: "DOC-JP-DISASTER-WP-PART-001"
doc_type: "derived"
status:
  state: "in_progress"
created_at: "2026-03-05"
updated_at: "2026-03-05"
lang: "ja-JP"
template:
  id: "imtpl.disaster.whitepaper.extraction"
  name: "Disaster Whitepaper Extraction Template"
  version: "1.1"
refs:
  sources:
    - id: "SRC-P1-PDF"
      uri: "./r6_dai1bu1.pdf"
      role: "source_material"
      description: "令和6年版防災白書 第1部第1章など"
    - id: "SRC-TEMPLATE"
      uri: "./sample-template.ideamark.template.md"
      role: "template"
      description: "抽出テンプレート"
---

# part-001 第1部抽出

## Scope
```yaml
section_id: "SEC-P1-SCOPE"
anchorage:
  view: "background"
  phase: "plan"
  domain: ["knowledge-extraction", "whitepaper", "part-001"]
occurrences:
  - "OCC-P1-SCOPE-OBJECTIVE"
```

第1部の記述から、自助・共助・公助の整理と事前防災の要点を抽出する。

```yaml
occurrence_id: "OCC-P1-SCOPE-OBJECTIVE"
entity: "IE-P1-SCOPE-OBJECTIVE"
role: "observation"
status: { state: "confirmed" }
supporting_evidence: ["IE-P1-SOURCE-TEXT"]
```

抽出対象は防災意識向上、行動計画、地域連携の論点である。

## Hazard And Preparedness Context
```yaml
section_id: "SEC-P1-HAZARD-CONTEXT"
anchorage:
  view: "problem"
  phase: "confirmed"
  domain: ["hazard", "preparedness", "jijo-kyojo-kojo"]
occurrences:
  - "OCC-P1-CONTEXT-RISK"
  - "OCC-P1-CONTEXT-PUBLIC-LIMIT"
```

本文は大規模災害時に公助のみでは限界があることを示し、平時の備えと住民主体の行動準備を強調する。

```yaml
occurrence_id: "OCC-P1-CONTEXT-RISK"
entity: "IE-P1-CONTEXT-RISK"
role: "observation"
status: { state: "confirmed" }
supporting_evidence: ["IE-P1-SOURCE-TEXT"]
```

南海トラフ等の巨大災害リスクを背景に、被害軽減のための平時対策が必要とされる。

```yaml
occurrence_id: "OCC-P1-CONTEXT-PUBLIC-LIMIT"
entity: "IE-P1-CONTEXT-PUBLIC-LIMIT"
role: "constraint"
status: { state: "confirmed" }
supporting_evidence: ["IE-P1-SOURCE-TEXT"]
```

広域災害時の公助限界を踏まえ、自助・共助の実効性向上が必要と述べられている。

## Community Actions
```yaml
section_id: "SEC-P1-LOCAL-MEASURES"
anchorage:
  view: "solution"
  phase: "plan"
  domain: ["local-measures", "preparedness", "community"]
occurrences:
  - "OCC-P1-MEASURE-HARD-SOFT"
  - "OCC-P1-MEASURE-TIMELINE"
```

対策はハード・ソフトの両面で設計され、個人の避難行動計画や訓練参加が具体策として示される。

```yaml
occurrence_id: "OCC-P1-MEASURE-HARD-SOFT"
entity: "IE-P1-MEASURE-HARD-SOFT"
role: "solution"
status: { state: "confirmed" }
supporting_evidence: ["IE-P1-SOURCE-TEXT"]
```

堤防・耐震化などのハード対策と、ハザードマップ・教育などのソフト対策の併用が整理されている。

```yaml
occurrence_id: "OCC-P1-MEASURE-TIMELINE"
entity: "IE-P1-MEASURE-TIMELINE"
role: "solution"
status: { state: "confirmed" }
supporting_evidence: ["IE-P1-SOURCE-TEXT"]
```

マイ・タイムラインの作成など、個人単位での事前行動設計が推奨されている。

## References
```yaml
section_id: "SEC-P1-REFERENCES"
anchorage:
  view: "background"
  phase: "confirmed"
  domain: ["references", "citation"]
occurrences:
  - "OCC-P1-REF-PDF"
  - "OCC-P1-CITATION"
```

```yaml
occurrence_id: "OCC-P1-REF-PDF"
entity: "IE-P1-REF-PDF"
role: "citation"
status: { state: "confirmed" }
supporting_evidence: ["IE-P1-REF-PDF"]
```

```yaml
occurrence_id: "OCC-P1-CITATION"
entity: "IE-P1-CITATION"
role: "citation"
status: { state: "confirmed" }
target: "IE-P1-SOURCE-TEXT"
supporting_evidence: ["IE-P1-REF-PDF"]
```

## Registry
```yaml
entities:
  IE-P1-SCOPE-OBJECTIVE:
    kind: "context"
    content: "第1部から自助・共助・公助と事前防災行動を抽出する。"
  IE-P1-CONTEXT-RISK:
    kind: "risk"
    content: "巨大地震や激甚化する気象災害を背景に被害軽減が課題。"
  IE-P1-CONTEXT-PUBLIC-LIMIT:
    kind: "constraint"
    content: "広域災害時には公助のみで十分な対応が難しい。"
  IE-P1-MEASURE-HARD-SOFT:
    kind: "measure"
    content: "ハード対策とソフト対策の両輪で防災力を高める。"
  IE-P1-MEASURE-TIMELINE:
    kind: "measure"
    content: "マイ・タイムライン等の個人行動計画を平時に準備する。"
  IE-P1-REF-PDF:
    kind: "evidence"
    content: "Source PDF: ./r6_dai1bu1.pdf"
  IE-P1-CITATION:
    kind: "context"
    content: "令和6年版防災白書 第1部第1章周辺の抽出結果。"
  IE-P1-SOURCE-TEXT:
    kind: "evidence"
    content: "pdftotextで抽出した第1部テキスト。"
occurrences:
  OCC-P1-SCOPE-OBJECTIVE: { occurrence_id: "OCC-P1-SCOPE-OBJECTIVE", entity: "IE-P1-SCOPE-OBJECTIVE", role: "observation", status: { state: "confirmed" }, supporting_evidence: ["IE-P1-SOURCE-TEXT"] }
  OCC-P1-CONTEXT-RISK: { occurrence_id: "OCC-P1-CONTEXT-RISK", entity: "IE-P1-CONTEXT-RISK", role: "observation", status: { state: "confirmed" }, supporting_evidence: ["IE-P1-SOURCE-TEXT"] }
  OCC-P1-CONTEXT-PUBLIC-LIMIT: { occurrence_id: "OCC-P1-CONTEXT-PUBLIC-LIMIT", entity: "IE-P1-CONTEXT-PUBLIC-LIMIT", role: "constraint", status: { state: "confirmed" }, supporting_evidence: ["IE-P1-SOURCE-TEXT"] }
  OCC-P1-MEASURE-HARD-SOFT: { occurrence_id: "OCC-P1-MEASURE-HARD-SOFT", entity: "IE-P1-MEASURE-HARD-SOFT", role: "solution", status: { state: "confirmed" }, supporting_evidence: ["IE-P1-SOURCE-TEXT"] }
  OCC-P1-MEASURE-TIMELINE: { occurrence_id: "OCC-P1-MEASURE-TIMELINE", entity: "IE-P1-MEASURE-TIMELINE", role: "solution", status: { state: "confirmed" }, supporting_evidence: ["IE-P1-SOURCE-TEXT"] }
  OCC-P1-REF-PDF: { occurrence_id: "OCC-P1-REF-PDF", entity: "IE-P1-REF-PDF", role: "citation", status: { state: "confirmed" }, supporting_evidence: ["IE-P1-REF-PDF"] }
  OCC-P1-CITATION: { occurrence_id: "OCC-P1-CITATION", entity: "IE-P1-CITATION", role: "citation", status: { state: "confirmed" }, target: "IE-P1-SOURCE-TEXT", supporting_evidence: ["IE-P1-REF-PDF"] }
sections:
  SEC-P1-SCOPE: { anchorage: { view: "background", phase: "plan", domain: ["knowledge-extraction", "whitepaper", "part-001"] }, occurrences: ["OCC-P1-SCOPE-OBJECTIVE"] }
  SEC-P1-HAZARD-CONTEXT: { anchorage: { view: "problem", phase: "confirmed", domain: ["hazard", "preparedness", "jijo-kyojo-kojo"] }, occurrences: ["OCC-P1-CONTEXT-RISK", "OCC-P1-CONTEXT-PUBLIC-LIMIT"] }
  SEC-P1-LOCAL-MEASURES: { anchorage: { view: "solution", phase: "plan", domain: ["local-measures", "preparedness", "community"] }, occurrences: ["OCC-P1-MEASURE-HARD-SOFT", "OCC-P1-MEASURE-TIMELINE"] }
  SEC-P1-REFERENCES: { anchorage: { view: "background", phase: "confirmed", domain: ["references", "citation"] }, occurrences: ["OCC-P1-REF-PDF", "OCC-P1-CITATION"] }
structure:
  sections: ["SEC-P1-SCOPE", "SEC-P1-HAZARD-CONTEXT", "SEC-P1-LOCAL-MEASURES", "SEC-P1-REFERENCES"]
```
