---
ideamark_version: 1
doc_id: "DOC-JP-DISASTER-WP-P1-PARENT-001"
doc_type: "derived"
status:
  state: "in_progress"
created_at: "2026-03-05"
updated_at: "2026-03-05"
lang: "ja-JP"
refs:
  sources:
    - id: "SRC-P1-PDF"
      uri: "./r6_dai1bu1.pdf"
      role: "source_material"
      description: "令和6年版防災白書 第1部"
---

# part-001 Parent (Hierarchical)

親ドキュメントは論点の骨格のみを保持し、詳細は detail 文書へ分離する。

## Scope
```yaml
section_id: "SEC-P1-SCOPE"
anchorage:
  view: "background"
  phase: "plan"
  domain: ["knowledge-extraction", "whitepaper", "part-001", "parent"]
occurrences:
  - "OCC-P1-SCOPE-OBJECTIVE"
```

```yaml
occurrence_id: "OCC-P1-SCOPE-OBJECTIVE"
entity: "IE-P1-SCOPE-OBJECTIVE"
role: "observation"
status: { state: "confirmed" }
```

第1部の中から「公助限界と事前防災」「具体行動（自助・共助）」に絞って抽出する。

## Key Findings
```yaml
section_id: "SEC-P1-KEY-FINDINGS"
anchorage:
  view: "analysis"
  phase: "confirmed"
  domain: ["hazard", "preparedness", "summary", "parent"]
occurrences:
  - "OCC-P1-KEY-PUBLIC-LIMIT"
  - "OCC-P1-KEY-ACTION-SET"
```

```yaml
occurrence_id: "OCC-P1-KEY-PUBLIC-LIMIT"
entity: "IE-P1-KEY-PUBLIC-LIMIT"
role: "constraint"
status: { state: "confirmed" }
```

大規模災害時の公助限界を踏まえた平時準備の必要性が中心メッセージである。

```yaml
occurrence_id: "OCC-P1-KEY-ACTION-SET"
entity: "IE-P1-KEY-ACTION-SET"
role: "solution"
status: { state: "confirmed" }
```

ハード・ソフト対策、個人行動計画、地域連携が実践項目として示される。

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
```

```yaml
occurrence_id: "OCC-P1-CITATION"
entity: "IE-P1-CITATION"
role: "citation"
status: { state: "confirmed" }
supporting_evidence: ["IE-P1-REF-PDF"]
```

## Registry
```yaml
entities:
  IE-P1-SCOPE-OBJECTIVE:
    kind: "context"
    content: "第1部抽出の対象を公助限界・事前防災・具体行動へ限定する。"
    detail_docs:
      - uri: "./doc.part-001.detail-context.ideamark.md"
        relation: "elaborates"
        summary: "背景・公助限界・自助共助の詳細"
  IE-P1-KEY-PUBLIC-LIMIT:
    kind: "constraint"
    content: "大規模広域災害では公助単独での対応に限界がある。"
    detail_doc:
      uri: "./doc.part-001.detail-context.ideamark.md"
      relation: "evidences"
      summary: "本文根拠と周辺文脈"
  IE-P1-KEY-ACTION-SET:
    kind: "measure"
    content: "ハード/ソフト対策、マイ・タイムライン等の行動準備が必要。"
    detail_doc:
      uri: "./doc.part-001.detail-actions.ideamark.md"
      relation: "elaborates"
      summary: "行動項目の詳細"
  IE-P1-REF-PDF:
    kind: "evidence"
    content: "Source PDF: ./r6_dai1bu1.pdf"
  IE-P1-CITATION:
    kind: "context"
    content: "令和6年版防災白書 第1部（階層抽出版 親文書）。"
occurrences:
  OCC-P1-SCOPE-OBJECTIVE: { occurrence_id: "OCC-P1-SCOPE-OBJECTIVE", entity: "IE-P1-SCOPE-OBJECTIVE", role: "observation", status: { state: "confirmed" } }
  OCC-P1-KEY-PUBLIC-LIMIT: { occurrence_id: "OCC-P1-KEY-PUBLIC-LIMIT", entity: "IE-P1-KEY-PUBLIC-LIMIT", role: "constraint", status: { state: "confirmed" } }
  OCC-P1-KEY-ACTION-SET: { occurrence_id: "OCC-P1-KEY-ACTION-SET", entity: "IE-P1-KEY-ACTION-SET", role: "solution", status: { state: "confirmed" } }
  OCC-P1-REF-PDF: { occurrence_id: "OCC-P1-REF-PDF", entity: "IE-P1-REF-PDF", role: "citation", status: { state: "confirmed" } }
  OCC-P1-CITATION: { occurrence_id: "OCC-P1-CITATION", entity: "IE-P1-CITATION", role: "citation", status: { state: "confirmed" }, supporting_evidence: ["IE-P1-REF-PDF"] }
sections:
  SEC-P1-SCOPE: { anchorage: { view: "background", phase: "plan", domain: ["knowledge-extraction", "whitepaper", "part-001", "parent"] }, occurrences: ["OCC-P1-SCOPE-OBJECTIVE"] }
  SEC-P1-KEY-FINDINGS: { anchorage: { view: "analysis", phase: "confirmed", domain: ["hazard", "preparedness", "summary", "parent"] }, occurrences: ["OCC-P1-KEY-PUBLIC-LIMIT", "OCC-P1-KEY-ACTION-SET"] }
  SEC-P1-REFERENCES: { anchorage: { view: "background", phase: "confirmed", domain: ["references", "citation"] }, occurrences: ["OCC-P1-REF-PDF", "OCC-P1-CITATION"] }
structure:
  sections: ["SEC-P1-SCOPE", "SEC-P1-KEY-FINDINGS", "SEC-P1-REFERENCES"]
```
