---
ideamark_version: 1
doc_id: "DOC-JP-DISASTER-WP-PART-002"
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
    - id: "SRC-P2-PDF"
      uri: "./r6_dai3bu.pdf"
      role: "source_material"
      description: "令和6年度の防災に関する計画"
    - id: "SRC-TEMPLATE"
      uri: "./sample-template.ideamark.template.md"
      role: "template"
      description: "抽出テンプレート"
---

# part-002 第3部抽出

## Scope
```yaml
section_id: "SEC-P2-SCOPE"
anchorage:
  view: "background"
  phase: "plan"
  domain: ["knowledge-extraction", "whitepaper", "part-002"]
occurrences:
  - "OCC-P2-SCOPE-OBJECTIVE"
```

第3部の計画記述から、政策分野別の実施方針を抽出する。

```yaml
occurrence_id: "OCC-P2-SCOPE-OBJECTIVE"
entity: "IE-P2-SCOPE-OBJECTIVE"
role: "observation"
status: { state: "confirmed" }
supporting_evidence: ["IE-P2-SOURCE-TEXT"]
```

## National Planning Structure
```yaml
section_id: "SEC-P2-NATIONAL-POLICY"
anchorage:
  view: "decision"
  phase: "confirmed"
  domain: ["policy", "planning", "national"]
occurrences:
  - "OCC-P2-POLICY-FIVE-PILLARS"
  - "OCC-P2-POLICY-INTERNATIONAL"
```

第3部は科学技術、災害予防、国土保全、復旧復興、国際協力の5本柱で計画を整理している。

```yaml
occurrence_id: "OCC-P2-POLICY-FIVE-PILLARS"
entity: "IE-P2-POLICY-FIVE-PILLARS"
role: "decision"
status: { state: "confirmed" }
supporting_evidence: ["IE-P2-SOURCE-TEXT"]
```

```yaml
occurrence_id: "OCC-P2-POLICY-INTERNATIONAL"
entity: "IE-P2-POLICY-INTERNATIONAL"
role: "decision"
status: { state: "confirmed" }
supporting_evidence: ["IE-P2-SOURCE-TEXT"]
```

## Local Implementation And Infrastructure
```yaml
section_id: "SEC-P2-LOCAL-MEASURES"
anchorage:
  view: "solution"
  phase: "plan"
  domain: ["local-measures", "infrastructure", "prevention"]
occurrences:
  - "OCC-P2-MEASURE-PREVENTION"
  - "OCC-P2-MEASURE-RECOVERY"
```

計画には訓練・施設整備・耐震化・浸水対策等の予防施策と、救助体制・生活再建支援等の復旧施策が含まれる。

```yaml
occurrence_id: "OCC-P2-MEASURE-PREVENTION"
entity: "IE-P2-MEASURE-PREVENTION"
role: "solution"
status: { state: "confirmed" }
supporting_evidence: ["IE-P2-SOURCE-TEXT"]
```

```yaml
occurrence_id: "OCC-P2-MEASURE-RECOVERY"
entity: "IE-P2-MEASURE-RECOVERY"
role: "solution"
status: { state: "confirmed" }
supporting_evidence: ["IE-P2-SOURCE-TEXT"]
```

## References
```yaml
section_id: "SEC-P2-REFERENCES"
anchorage:
  view: "background"
  phase: "confirmed"
  domain: ["references", "citation"]
occurrences:
  - "OCC-P2-REF-PDF"
  - "OCC-P2-CITATION"
```

```yaml
occurrence_id: "OCC-P2-REF-PDF"
entity: "IE-P2-REF-PDF"
role: "citation"
status: { state: "confirmed" }
supporting_evidence: ["IE-P2-REF-PDF"]
```

```yaml
occurrence_id: "OCC-P2-CITATION"
entity: "IE-P2-CITATION"
role: "citation"
status: { state: "confirmed" }
target: "IE-P2-SOURCE-TEXT"
supporting_evidence: ["IE-P2-REF-PDF"]
```

## Registry
```yaml
entities:
  IE-P2-SCOPE-OBJECTIVE: { kind: "context", content: "第3部の計画体系と施策分野を抽出する。" }
  IE-P2-POLICY-FIVE-PILLARS: { kind: "policy", content: "科学技術、予防、国土保全、復旧、国際協力の5分野で防災計画を構成。" }
  IE-P2-POLICY-INTERNATIONAL: { kind: "policy", content: "仙台防災枠組の普及・定着と国際防災協力を推進。" }
  IE-P2-MEASURE-PREVENTION: { kind: "measure", content: "教育訓練、施設整備、耐震化、浸水対策等の予防施策。" }
  IE-P2-MEASURE-RECOVERY: { kind: "measure", content: "救助体制整備、被災者支援、公共施設復旧等の復旧復興施策。" }
  IE-P2-REF-PDF: { kind: "evidence", content: "Source PDF: ./r6_dai3bu.pdf" }
  IE-P2-CITATION: { kind: "context", content: "令和6年版防災白書 第3部抽出結果。" }
  IE-P2-SOURCE-TEXT: { kind: "evidence", content: "pdftotextで抽出した第3部テキスト。" }
occurrences:
  OCC-P2-SCOPE-OBJECTIVE: { occurrence_id: "OCC-P2-SCOPE-OBJECTIVE", entity: "IE-P2-SCOPE-OBJECTIVE", role: "observation", status: { state: "confirmed" }, supporting_evidence: ["IE-P2-SOURCE-TEXT"] }
  OCC-P2-POLICY-FIVE-PILLARS: { occurrence_id: "OCC-P2-POLICY-FIVE-PILLARS", entity: "IE-P2-POLICY-FIVE-PILLARS", role: "decision", status: { state: "confirmed" }, supporting_evidence: ["IE-P2-SOURCE-TEXT"] }
  OCC-P2-POLICY-INTERNATIONAL: { occurrence_id: "OCC-P2-POLICY-INTERNATIONAL", entity: "IE-P2-POLICY-INTERNATIONAL", role: "decision", status: { state: "confirmed" }, supporting_evidence: ["IE-P2-SOURCE-TEXT"] }
  OCC-P2-MEASURE-PREVENTION: { occurrence_id: "OCC-P2-MEASURE-PREVENTION", entity: "IE-P2-MEASURE-PREVENTION", role: "solution", status: { state: "confirmed" }, supporting_evidence: ["IE-P2-SOURCE-TEXT"] }
  OCC-P2-MEASURE-RECOVERY: { occurrence_id: "OCC-P2-MEASURE-RECOVERY", entity: "IE-P2-MEASURE-RECOVERY", role: "solution", status: { state: "confirmed" }, supporting_evidence: ["IE-P2-SOURCE-TEXT"] }
  OCC-P2-REF-PDF: { occurrence_id: "OCC-P2-REF-PDF", entity: "IE-P2-REF-PDF", role: "citation", status: { state: "confirmed" }, supporting_evidence: ["IE-P2-REF-PDF"] }
  OCC-P2-CITATION: { occurrence_id: "OCC-P2-CITATION", entity: "IE-P2-CITATION", role: "citation", status: { state: "confirmed" }, target: "IE-P2-SOURCE-TEXT", supporting_evidence: ["IE-P2-REF-PDF"] }
sections:
  SEC-P2-SCOPE: { anchorage: { view: "background", phase: "plan", domain: ["knowledge-extraction", "whitepaper", "part-002"] }, occurrences: ["OCC-P2-SCOPE-OBJECTIVE"] }
  SEC-P2-NATIONAL-POLICY: { anchorage: { view: "decision", phase: "confirmed", domain: ["policy", "planning", "national"] }, occurrences: ["OCC-P2-POLICY-FIVE-PILLARS", "OCC-P2-POLICY-INTERNATIONAL"] }
  SEC-P2-LOCAL-MEASURES: { anchorage: { view: "solution", phase: "plan", domain: ["local-measures", "infrastructure", "prevention"] }, occurrences: ["OCC-P2-MEASURE-PREVENTION", "OCC-P2-MEASURE-RECOVERY"] }
  SEC-P2-REFERENCES: { anchorage: { view: "background", phase: "confirmed", domain: ["references", "citation"] }, occurrences: ["OCC-P2-REF-PDF", "OCC-P2-CITATION"] }
structure:
  sections: ["SEC-P2-SCOPE", "SEC-P2-NATIONAL-POLICY", "SEC-P2-LOCAL-MEASURES", "SEC-P2-REFERENCES"]
```
