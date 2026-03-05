---
ideamark_version: 1
doc_id: "DOC-JP-DISASTER-WP-PART-003"
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
    - id: "SRC-P3-PDF"
      uri: "./r6_tokushu2_1.pdf"
      role: "source_material"
      description: "特集2 令和6年能登半島地震"
    - id: "SRC-TEMPLATE"
      uri: "./sample-template.ideamark.template.md"
      role: "template"
      description: "抽出テンプレート"
---

# part-003 能登半島地震特集抽出

## Scope
```yaml
section_id: "SEC-P3-SCOPE"
anchorage:
  view: "background"
  phase: "plan"
  domain: ["knowledge-extraction", "whitepaper", "part-003"]
occurrences:
  - "OCC-P3-SCOPE-OBJECTIVE"
```

特集2から、被害概要・初動対応・今後の防災課題を抽出する。

```yaml
occurrence_id: "OCC-P3-SCOPE-OBJECTIVE"
entity: "IE-P3-SCOPE-OBJECTIVE"
role: "observation"
status: { state: "confirmed" }
supporting_evidence: ["IE-P3-SOURCE-TEXT"]
```

## Hazard Context
```yaml
section_id: "SEC-P3-HAZARD"
anchorage:
  view: "problem"
  phase: "confirmed"
  domain: ["hazard", "earthquake", "noto"]
occurrences:
  - "OCC-P3-HAZARD-EVENT"
  - "OCC-P3-HAZARD-DAMAGE"
```

令和6年能登半島地震は震度7を観測し、人的・住家・ライフラインへ甚大な被害をもたらしたと整理される。

```yaml
occurrence_id: "OCC-P3-HAZARD-EVENT"
entity: "IE-P3-HAZARD-EVENT"
role: "observation"
status: { state: "confirmed" }
supporting_evidence: ["IE-P3-SOURCE-TEXT"]
```

```yaml
occurrence_id: "OCC-P3-HAZARD-DAMAGE"
entity: "IE-P3-HAZARD-DAMAGE"
role: "observation"
status: { state: "confirmed" }
supporting_evidence: ["IE-P3-SOURCE-TEXT"]
```

## Response And Guidance
```yaml
section_id: "SEC-P3-GUIDANCE"
anchorage:
  view: "decision"
  phase: "confirmed"
  domain: ["response", "recovery", "guidance"]
occurrences:
  - "OCC-P3-RESPONSE-EMERGENCY"
  - "OCC-P3-RESPONSE-RECOVERY"
  - "OCC-P3-GUIDANCE-NEXT"
```

本文は非常災害対策本部と復旧・復興支援本部による対応継続を示し、検証・教訓抽出を通じた次期防災対応を示唆する。

```yaml
occurrence_id: "OCC-P3-RESPONSE-EMERGENCY"
entity: "IE-P3-RESPONSE-EMERGENCY"
role: "solution"
status: { state: "confirmed" }
supporting_evidence: ["IE-P3-SOURCE-TEXT"]
```

```yaml
occurrence_id: "OCC-P3-RESPONSE-RECOVERY"
entity: "IE-P3-RESPONSE-RECOVERY"
role: "solution"
status: { state: "confirmed" }
supporting_evidence: ["IE-P3-SOURCE-TEXT"]
```

```yaml
occurrence_id: "OCC-P3-GUIDANCE-NEXT"
entity: "IE-P3-GUIDANCE-NEXT"
role: "decision"
status: { state: "confirmed" }
supporting_evidence: ["IE-P3-SOURCE-TEXT"]
```

## References
```yaml
section_id: "SEC-P3-REFERENCES"
anchorage:
  view: "background"
  phase: "confirmed"
  domain: ["references", "citation"]
occurrences:
  - "OCC-P3-REF-PDF"
  - "OCC-P3-CITATION"
```

```yaml
occurrence_id: "OCC-P3-REF-PDF"
entity: "IE-P3-REF-PDF"
role: "citation"
status: { state: "confirmed" }
supporting_evidence: ["IE-P3-REF-PDF"]
```

```yaml
occurrence_id: "OCC-P3-CITATION"
entity: "IE-P3-CITATION"
role: "citation"
status: { state: "confirmed" }
target: "IE-P3-SOURCE-TEXT"
supporting_evidence: ["IE-P3-REF-PDF"]
```

## Registry
```yaml
entities:
  IE-P3-SCOPE-OBJECTIVE: { kind: "context", content: "特集2から被害と対応を抽出する。" }
  IE-P3-HAZARD-EVENT: { kind: "risk", content: "令和6年能登半島地震は震度7観測を含む広域地震。" }
  IE-P3-HAZARD-DAMAGE: { kind: "risk", content: "人的・住家・ライフライン等に甚大な被害が発生。" }
  IE-P3-RESPONSE-EMERGENCY: { kind: "measure", content: "非常災害対策本部の下で被災者支援を継続。" }
  IE-P3-RESPONSE-RECOVERY: { kind: "measure", content: "復旧・復興支援本部による再生対応を推進。" }
  IE-P3-GUIDANCE-NEXT: { kind: "decision", content: "検証と教訓抽出を踏まえ今後の防災対策へ反映。" }
  IE-P3-REF-PDF: { kind: "evidence", content: "Source PDF: ./r6_tokushu2_1.pdf" }
  IE-P3-CITATION: { kind: "context", content: "令和6年版防災白書 特集2抽出結果。" }
  IE-P3-SOURCE-TEXT: { kind: "evidence", content: "pdftotextで抽出した特集2テキスト。" }
occurrences:
  OCC-P3-SCOPE-OBJECTIVE: { occurrence_id: "OCC-P3-SCOPE-OBJECTIVE", entity: "IE-P3-SCOPE-OBJECTIVE", role: "observation", status: { state: "confirmed" }, supporting_evidence: ["IE-P3-SOURCE-TEXT"] }
  OCC-P3-HAZARD-EVENT: { occurrence_id: "OCC-P3-HAZARD-EVENT", entity: "IE-P3-HAZARD-EVENT", role: "observation", status: { state: "confirmed" }, supporting_evidence: ["IE-P3-SOURCE-TEXT"] }
  OCC-P3-HAZARD-DAMAGE: { occurrence_id: "OCC-P3-HAZARD-DAMAGE", entity: "IE-P3-HAZARD-DAMAGE", role: "observation", status: { state: "confirmed" }, supporting_evidence: ["IE-P3-SOURCE-TEXT"] }
  OCC-P3-RESPONSE-EMERGENCY: { occurrence_id: "OCC-P3-RESPONSE-EMERGENCY", entity: "IE-P3-RESPONSE-EMERGENCY", role: "solution", status: { state: "confirmed" }, supporting_evidence: ["IE-P3-SOURCE-TEXT"] }
  OCC-P3-RESPONSE-RECOVERY: { occurrence_id: "OCC-P3-RESPONSE-RECOVERY", entity: "IE-P3-RESPONSE-RECOVERY", role: "solution", status: { state: "confirmed" }, supporting_evidence: ["IE-P3-SOURCE-TEXT"] }
  OCC-P3-GUIDANCE-NEXT: { occurrence_id: "OCC-P3-GUIDANCE-NEXT", entity: "IE-P3-GUIDANCE-NEXT", role: "decision", status: { state: "confirmed" }, supporting_evidence: ["IE-P3-SOURCE-TEXT"] }
  OCC-P3-REF-PDF: { occurrence_id: "OCC-P3-REF-PDF", entity: "IE-P3-REF-PDF", role: "citation", status: { state: "confirmed" }, supporting_evidence: ["IE-P3-REF-PDF"] }
  OCC-P3-CITATION: { occurrence_id: "OCC-P3-CITATION", entity: "IE-P3-CITATION", role: "citation", status: { state: "confirmed" }, target: "IE-P3-SOURCE-TEXT", supporting_evidence: ["IE-P3-REF-PDF"] }
sections:
  SEC-P3-SCOPE: { anchorage: { view: "background", phase: "plan", domain: ["knowledge-extraction", "whitepaper", "part-003"] }, occurrences: ["OCC-P3-SCOPE-OBJECTIVE"] }
  SEC-P3-HAZARD: { anchorage: { view: "problem", phase: "confirmed", domain: ["hazard", "earthquake", "noto"] }, occurrences: ["OCC-P3-HAZARD-EVENT", "OCC-P3-HAZARD-DAMAGE"] }
  SEC-P3-GUIDANCE: { anchorage: { view: "decision", phase: "confirmed", domain: ["response", "recovery", "guidance"] }, occurrences: ["OCC-P3-RESPONSE-EMERGENCY", "OCC-P3-RESPONSE-RECOVERY", "OCC-P3-GUIDANCE-NEXT"] }
  SEC-P3-REFERENCES: { anchorage: { view: "background", phase: "confirmed", domain: ["references", "citation"] }, occurrences: ["OCC-P3-REF-PDF", "OCC-P3-CITATION"] }
structure:
  sections: ["SEC-P3-SCOPE", "SEC-P3-HAZARD", "SEC-P3-GUIDANCE", "SEC-P3-REFERENCES"]
```
