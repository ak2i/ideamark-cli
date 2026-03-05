---
created_at: 2026-03-05
doc_id: f6ebdd29-7bcd-4eb1-9bdb-4d1da7eeafb7
doc_type: derived
ideamark_version: 1
lang: ja-JP
refs:
  sources:
    - description: 令和6年版防災白書 第1部
      id: SRC-P1-PDF
      role: source_material
      uri: ./r6_dai1bu1.pdf
    - id: src-DOC-JP-DISASTER-WP-P1-PARENT-001
      role: source
      uri: DOC-JP-DISASTER-WP-P1-PARENT-001
    - id: src-DOC-JP-DISASTER-WP-P1-DETAIL-CONTEXT-001
      role: source
      uri: DOC-JP-DISASTER-WP-P1-DETAIL-CONTEXT-001
    - id: src-DOC-JP-DISASTER-WP-P1-DETAIL-ACTIONS-001
      role: source
      uri: DOC-JP-DISASTER-WP-P1-DETAIL-ACTIONS-001
status:
  state: in_progress
updated_at: 2026-03-04
---

## SEC-P1-SCOPE
```yaml
anchorage:
  domain:
    - knowledge-extraction
    - whitepaper
    - part-001
    - parent
  phase: plan
  view: background
occurrences:
  - OCC-P1-SCOPE-OBJECTIVE
section_id: SEC-P1-SCOPE
```

## SEC-P1-KEY-FINDINGS
```yaml
anchorage:
  domain:
    - hazard
    - preparedness
    - summary
    - parent
  phase: confirmed
  view: analysis
occurrences:
  - OCC-P1-KEY-PUBLIC-LIMIT
  - OCC-P1-KEY-ACTION-SET
section_id: SEC-P1-KEY-FINDINGS
```

## SEC-P1-REFERENCES
```yaml
anchorage:
  domain:
    - references
    - citation
  phase: confirmed
  view: background
occurrences:
  - OCC-P1-REF-PDF
  - OCC-P1-CITATION
section_id: SEC-P1-REFERENCES
```

## SEC-P1D-CONTEXT
```yaml
anchorage:
  domain:
    - detail
    - public-assistance-limit
    - part-001
  phase: confirmed
  view: background
occurrences:
  - OCC-P1D-CONTEXT-LIMIT
  - OCC-P1D-CONTEXT-SELF-MUTUAL
  - OCC-P1D-CONTEXT-SOURCE-REF
section_id: SEC-P1D-CONTEXT
```

## SEC-P1D-CONTEXT-REFERENCES
```yaml
anchorage:
  domain:
    - detail
    - references
    - part-001
  phase: confirmed
  view: background
occurrences:
  - OCC-P1D-CONTEXT-SOURCE-REF
section_id: SEC-P1D-CONTEXT-REFERENCES
```

## SEC-P1D-ACTIONS
```yaml
anchorage:
  domain:
    - detail
    - actions
    - part-001
  phase: plan
  view: solution
occurrences:
  - OCC-P1D-ACT-HARD-SOFT
  - OCC-P1D-ACT-MYTIMELINE
  - OCC-P1D-ACT-TRAINING
  - OCC-P1D-ACT-SOURCE-REF
section_id: SEC-P1D-ACTIONS
```

## SEC-P1D-ACTIONS-REFERENCES
```yaml
anchorage:
  domain:
    - detail
    - references
    - part-001
  phase: confirmed
  view: background
occurrences:
  - OCC-P1D-ACT-SOURCE-REF
section_id: SEC-P1D-ACTIONS-REFERENCES
```

## Registry
```yaml
entities:
  IE-P1-CITATION:
    content: 令和6年版防災白書 第1部（階層抽出版 親文書）。
    kind: context
  IE-P1-KEY-ACTION-SET:
    content: ハード/ソフト対策、マイ・タイムライン等の行動準備が必要。
    detail_doc:
      relation: elaborates
      summary: 行動項目の詳細
      uri: ./doc.part-001.detail-actions.ideamark.md
    kind: measure
  IE-P1-KEY-PUBLIC-LIMIT:
    content: 大規模広域災害では公助単独での対応に限界がある。
    detail_doc:
      relation: evidences
      summary: 本文根拠と周辺文脈
      uri: ./doc.part-001.detail-context.ideamark.md
    kind: constraint
  IE-P1-REF-PDF:
    content: "Source PDF: ./r6_dai1bu1.pdf"
    kind: evidence
  IE-P1-SCOPE-OBJECTIVE:
    content: 第1部抽出の対象を公助限界・事前防災・具体行動へ限定する。
    detail_docs:
      - relation: elaborates
        summary: 背景・公助限界・自助共助の詳細
        uri: ./doc.part-001.detail-context.ideamark.md
    kind: context
  IE-P1D-ACT-HARD-SOFT:
    content: 堤防整備・耐震化と、ハザードマップ・教育等のソフト対策を併行実施。
    kind: measure
  IE-P1D-ACT-MYTIMELINE:
    content: マイ・タイムライン等の個人行動計画を準備する。
    kind: measure
  IE-P1D-ACT-TRAINING:
    content: 避難訓練、備蓄、家具固定等の平時行動を実装する。
    kind: measure
  IE-P1D-CONTEXT-LIMIT:
    content: 大規模災害時には公助のみでは十分な初動・継続支援が難しい。
    kind: constraint
  IE-P1D-CONTEXT-SELF-MUTUAL:
    content: 自助・共助を前提にした地域防災文化の構築が必要。
    kind: analysis
  IE-P1DA-SOURCE-TEXT:
    content: 第1部第1章の抽出テキスト（行動準備関連箇所）。
    kind: evidence
  IE-P1DC-SOURCE-TEXT:
    content: 第1部第1章の抽出テキスト（公助限界・自助共助関連箇所）。
    kind: evidence
occurrences:
  OCC-P1-CITATION:
    entity: IE-P1-CITATION
    occurrence_id: OCC-P1-CITATION
    role: citation
    status:
      state: confirmed
    supporting_evidence:
      - IE-P1-REF-PDF
  OCC-P1-KEY-ACTION-SET:
    entity: IE-P1-KEY-ACTION-SET
    occurrence_id: OCC-P1-KEY-ACTION-SET
    role: solution
    status:
      state: confirmed
  OCC-P1-KEY-PUBLIC-LIMIT:
    entity: IE-P1-KEY-PUBLIC-LIMIT
    occurrence_id: OCC-P1-KEY-PUBLIC-LIMIT
    role: constraint
    status:
      state: confirmed
  OCC-P1-REF-PDF:
    entity: IE-P1-REF-PDF
    occurrence_id: OCC-P1-REF-PDF
    role: citation
    status:
      state: confirmed
  OCC-P1-SCOPE-OBJECTIVE:
    entity: IE-P1-SCOPE-OBJECTIVE
    occurrence_id: OCC-P1-SCOPE-OBJECTIVE
    role: observation
    status:
      state: confirmed
  OCC-P1D-ACT-HARD-SOFT:
    entity: IE-P1D-ACT-HARD-SOFT
    occurrence_id: OCC-P1D-ACT-HARD-SOFT
    role: solution
    status:
      state: confirmed
    supporting_evidence:
      - IE-P1DA-SOURCE-TEXT
  OCC-P1D-ACT-MYTIMELINE:
    entity: IE-P1D-ACT-MYTIMELINE
    occurrence_id: OCC-P1D-ACT-MYTIMELINE
    role: solution
    status:
      state: confirmed
    supporting_evidence:
      - IE-P1DA-SOURCE-TEXT
  OCC-P1D-ACT-SOURCE-REF:
    entity: IE-P1DA-SOURCE-TEXT
    occurrence_id: OCC-P1D-ACT-SOURCE-REF
    role: citation
    status:
      state: confirmed
  OCC-P1D-ACT-TRAINING:
    entity: IE-P1D-ACT-TRAINING
    occurrence_id: OCC-P1D-ACT-TRAINING
    role: solution
    status:
      state: confirmed
    supporting_evidence:
      - IE-P1DA-SOURCE-TEXT
  OCC-P1D-CONTEXT-LIMIT:
    entity: IE-P1D-CONTEXT-LIMIT
    occurrence_id: OCC-P1D-CONTEXT-LIMIT
    role: constraint
    status:
      state: confirmed
    supporting_evidence:
      - IE-P1DC-SOURCE-TEXT
  OCC-P1D-CONTEXT-SELF-MUTUAL:
    entity: IE-P1D-CONTEXT-SELF-MUTUAL
    occurrence_id: OCC-P1D-CONTEXT-SELF-MUTUAL
    role: analysis
    status:
      state: confirmed
    supporting_evidence:
      - IE-P1DC-SOURCE-TEXT
  OCC-P1D-CONTEXT-SOURCE-REF:
    entity: IE-P1DC-SOURCE-TEXT
    occurrence_id: OCC-P1D-CONTEXT-SOURCE-REF
    role: citation
    status:
      state: confirmed
relations: []
sections:
  SEC-P1-KEY-FINDINGS:
    anchorage:
      domain:
        - hazard
        - preparedness
        - summary
        - parent
      phase: confirmed
      view: analysis
    occurrences:
      - OCC-P1-KEY-PUBLIC-LIMIT
      - OCC-P1-KEY-ACTION-SET
  SEC-P1-REFERENCES:
    anchorage:
      domain:
        - references
        - citation
      phase: confirmed
      view: background
    occurrences:
      - OCC-P1-REF-PDF
      - OCC-P1-CITATION
  SEC-P1-SCOPE:
    anchorage:
      domain:
        - knowledge-extraction
        - whitepaper
        - part-001
        - parent
      phase: plan
      view: background
    occurrences:
      - OCC-P1-SCOPE-OBJECTIVE
  SEC-P1D-ACTIONS:
    anchorage:
      domain:
        - detail
        - actions
        - part-001
      phase: plan
      view: solution
    occurrences:
      - OCC-P1D-ACT-HARD-SOFT
      - OCC-P1D-ACT-MYTIMELINE
      - OCC-P1D-ACT-TRAINING
      - OCC-P1D-ACT-SOURCE-REF
  SEC-P1D-ACTIONS-REFERENCES:
    anchorage:
      domain:
        - detail
        - references
        - part-001
      phase: confirmed
      view: background
    occurrences:
      - OCC-P1D-ACT-SOURCE-REF
  SEC-P1D-CONTEXT:
    anchorage:
      domain:
        - detail
        - public-assistance-limit
        - part-001
      phase: confirmed
      view: background
    occurrences:
      - OCC-P1D-CONTEXT-LIMIT
      - OCC-P1D-CONTEXT-SELF-MUTUAL
      - OCC-P1D-CONTEXT-SOURCE-REF
  SEC-P1D-CONTEXT-REFERENCES:
    anchorage:
      domain:
        - detail
        - references
        - part-001
      phase: confirmed
      view: background
    occurrences:
      - OCC-P1D-CONTEXT-SOURCE-REF
structure:
  sections:
    - SEC-P1-SCOPE
    - SEC-P1-KEY-FINDINGS
    - SEC-P1-REFERENCES
    - SEC-P1D-CONTEXT
    - SEC-P1D-CONTEXT-REFERENCES
    - SEC-P1D-ACTIONS
    - SEC-P1D-ACTIONS-REFERENCES
```

## Source Narrative Appendix

### DOC-JP-DISASTER-WP-P1-PARENT-001
```markdown
# part-001 Parent (Hierarchical)

親ドキュメントは論点の骨格のみを保持し、詳細は detail 文書へ分離する。

## Scope

第1部の中から「公助限界と事前防災」「具体行動（自助・共助）」に絞って抽出する。

## Key Findings

大規模災害時の公助限界を踏まえた平時準備の必要性が中心メッセージである。

ハード・ソフト対策、個人行動計画、地域連携が実践項目として示される。

## References

## Registry
```

### DOC-JP-DISASTER-WP-P1-DETAIL-CONTEXT-001
```markdown
# part-001 Detail Context

## Public Assistance Limit Detail

第1部本文では、大規模・広域災害に対して公助の供給能力に構造的制約があることを指摘している。

地方行政の人員制約やエリア広域化、高齢化等の社会条件が複合して、被災対応負荷が高まる。

そのため「自らの命は自ら守る」「地域で助け合う」という意識形成と準備行動が必要と整理される。

この詳細文書の根拠テキスト参照。

## References

## Registry
```

### DOC-JP-DISASTER-WP-P1-DETAIL-ACTIONS-001
```markdown
# part-001 Detail Actions

## Action Set Detail

本文では、インフラ整備等のハード対策と教育・計画等のソフト対策を同時に進める必要が示される。

台風接近時の時系列行動計画（マイ・タイムライン）等、個人別行動設計が具体策として記載される。

避難訓練参加や備蓄・家具固定といった平時行動が、防災実効性の基盤として提示される。

この詳細文書の根拠テキスト参照。

## References

## Registry
```

