---
ideamark_version: 1
doc_id: "DOC-JP-DISASTER-WP-P1-DETAIL-CONTEXT-001"
doc_type: "derived"
status:
  state: "in_progress"
created_at: "2026-03-05"
updated_at: "2026-03-05"
lang: "ja-JP"
refs:
  parent:
    uri: "./doc.part-001.parent.ideamark.md"
    entity: "IE-P1-KEY-PUBLIC-LIMIT"
    relation: "evidences"
  sources:
    - id: "SRC-P1-PDF"
      uri: "./r6_dai1bu1.pdf"
      role: "source_material"
---

# part-001 Detail Context

## Public Assistance Limit Detail
```yaml
section_id: "SEC-P1D-CONTEXT"
anchorage:
  view: "background"
  phase: "confirmed"
  domain: ["detail", "public-assistance-limit", "part-001"]
occurrences:
  - "OCC-P1D-CONTEXT-LIMIT"
  - "OCC-P1D-CONTEXT-SELF-MUTUAL"
  - "OCC-P1D-CONTEXT-SOURCE-REF"
```

第1部本文では、大規模・広域災害に対して公助の供給能力に構造的制約があることを指摘している。

```yaml
occurrence_id: "OCC-P1D-CONTEXT-LIMIT"
entity: "IE-P1D-CONTEXT-LIMIT"
role: "constraint"
status: { state: "confirmed" }
supporting_evidence: ["IE-P1DC-SOURCE-TEXT"]
```

地方行政の人員制約やエリア広域化、高齢化等の社会条件が複合して、被災対応負荷が高まる。

```yaml
occurrence_id: "OCC-P1D-CONTEXT-SELF-MUTUAL"
entity: "IE-P1D-CONTEXT-SELF-MUTUAL"
role: "analysis"
status: { state: "confirmed" }
supporting_evidence: ["IE-P1DC-SOURCE-TEXT"]
```

そのため「自らの命は自ら守る」「地域で助け合う」という意識形成と準備行動が必要と整理される。

```yaml
occurrence_id: "OCC-P1D-CONTEXT-SOURCE-REF"
entity: "IE-P1DC-SOURCE-TEXT"
role: "citation"
status: { state: "confirmed" }
```

この詳細文書の根拠テキスト参照。

## References
```yaml
section_id: "SEC-P1D-CONTEXT-REFERENCES"
anchorage:
  view: "background"
  phase: "confirmed"
  domain: ["detail", "references", "part-001"]
occurrences:
  - "OCC-P1D-CONTEXT-SOURCE-REF"
```

## Registry
```yaml
entities:
  IE-P1D-CONTEXT-LIMIT:
    kind: "constraint"
    content: "大規模災害時には公助のみでは十分な初動・継続支援が難しい。"
  IE-P1D-CONTEXT-SELF-MUTUAL:
    kind: "analysis"
    content: "自助・共助を前提にした地域防災文化の構築が必要。"
  IE-P1DC-SOURCE-TEXT:
    kind: "evidence"
    content: "第1部第1章の抽出テキスト（公助限界・自助共助関連箇所）。"
occurrences:
  OCC-P1D-CONTEXT-LIMIT: { occurrence_id: "OCC-P1D-CONTEXT-LIMIT", entity: "IE-P1D-CONTEXT-LIMIT", role: "constraint", status: { state: "confirmed" }, supporting_evidence: ["IE-P1DC-SOURCE-TEXT"] }
  OCC-P1D-CONTEXT-SELF-MUTUAL: { occurrence_id: "OCC-P1D-CONTEXT-SELF-MUTUAL", entity: "IE-P1D-CONTEXT-SELF-MUTUAL", role: "analysis", status: { state: "confirmed" }, supporting_evidence: ["IE-P1DC-SOURCE-TEXT"] }
  OCC-P1D-CONTEXT-SOURCE-REF: { occurrence_id: "OCC-P1D-CONTEXT-SOURCE-REF", entity: "IE-P1DC-SOURCE-TEXT", role: "citation", status: { state: "confirmed" } }
sections:
  SEC-P1D-CONTEXT: { anchorage: { view: "background", phase: "confirmed", domain: ["detail", "public-assistance-limit", "part-001"] }, occurrences: ["OCC-P1D-CONTEXT-LIMIT", "OCC-P1D-CONTEXT-SELF-MUTUAL", "OCC-P1D-CONTEXT-SOURCE-REF"] }
  SEC-P1D-CONTEXT-REFERENCES: { anchorage: { view: "background", phase: "confirmed", domain: ["detail", "references", "part-001"] }, occurrences: ["OCC-P1D-CONTEXT-SOURCE-REF"] }
structure:
  sections: ["SEC-P1D-CONTEXT", "SEC-P1D-CONTEXT-REFERENCES"]
```
