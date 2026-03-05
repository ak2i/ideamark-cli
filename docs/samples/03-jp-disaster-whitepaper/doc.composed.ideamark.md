---
created_at: 2026-03-05
doc_id: d804cb2a-d34a-432b-9f4f-a597a126195e
doc_type: derived
ideamark_version: 1
lang: ja-JP
refs:
  sources:
    - description: 令和6年版防災白書 第1部第1章など
      id: SRC-P1-PDF
      role: source_material
      uri: ./r6_dai1bu1.pdf
    - description: 抽出テンプレート
      id: SRC-TEMPLATE
      role: template
      uri: ./sample-template.ideamark.template.md
    - id: src-DOC-JP-DISASTER-WP-PART-001
      role: source
      uri: DOC-JP-DISASTER-WP-PART-001
    - id: src-DOC-JP-DISASTER-WP-PART-002
      role: source
      uri: DOC-JP-DISASTER-WP-PART-002
    - id: src-DOC-JP-DISASTER-WP-PART-003
      role: source
      uri: DOC-JP-DISASTER-WP-PART-003
status:
  state: in_progress
template:
  id: imtpl.disaster.whitepaper.extraction
  name: Disaster Whitepaper Extraction Template
  version: "1.1"
updated_at: 2026-03-04
---

## SEC-P1-SCOPE
```yaml
anchorage:
  domain:
    - knowledge-extraction
    - whitepaper
    - part-001
  phase: plan
  view: background
occurrences:
  - OCC-P1-SCOPE-OBJECTIVE
section_id: SEC-P1-SCOPE
```

第1部の記述から、自助・共助・公助の整理と事前防災の要点を抽出する。


抽出対象は防災意識向上、行動計画、地域連携の論点である。

## SEC-P1-HAZARD-CONTEXT
```yaml
anchorage:
  domain:
    - hazard
    - preparedness
    - jijo-kyojo-kojo
  phase: confirmed
  view: problem
occurrences:
  - OCC-P1-CONTEXT-RISK
  - OCC-P1-CONTEXT-PUBLIC-LIMIT
section_id: SEC-P1-HAZARD-CONTEXT
```

本文は大規模災害時に公助のみでは限界があることを示し、平時の備えと住民主体の行動準備を強調する。


南海トラフ等の巨大災害リスクを背景に、被害軽減のための平時対策が必要とされる。


広域災害時の公助限界を踏まえ、自助・共助の実効性向上が必要と述べられている。

## SEC-P1-LOCAL-MEASURES
```yaml
anchorage:
  domain:
    - local-measures
    - preparedness
    - community
  phase: plan
  view: solution
occurrences:
  - OCC-P1-MEASURE-HARD-SOFT
  - OCC-P1-MEASURE-TIMELINE
section_id: SEC-P1-LOCAL-MEASURES
```

対策はハード・ソフトの両面で設計され、個人の避難行動計画や訓練参加が具体策として示される。


堤防・耐震化などのハード対策と、ハザードマップ・教育などのソフト対策の併用が整理されている。


マイ・タイムラインの作成など、個人単位での事前行動設計が推奨されている。

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

## SEC-P2-SCOPE
```yaml
anchorage:
  domain:
    - knowledge-extraction
    - whitepaper
    - part-002
  phase: plan
  view: background
occurrences:
  - OCC-P2-SCOPE-OBJECTIVE
section_id: SEC-P2-SCOPE
```

第3部の計画記述から、政策分野別の実施方針を抽出する。

## SEC-P2-NATIONAL-POLICY
```yaml
anchorage:
  domain:
    - policy
    - planning
    - national
  phase: confirmed
  view: decision
occurrences:
  - OCC-P2-POLICY-FIVE-PILLARS
  - OCC-P2-POLICY-INTERNATIONAL
section_id: SEC-P2-NATIONAL-POLICY
```

第3部は科学技術、災害予防、国土保全、復旧復興、国際協力の5本柱で計画を整理している。

## SEC-P2-LOCAL-MEASURES
```yaml
anchorage:
  domain:
    - local-measures
    - infrastructure
    - prevention
  phase: plan
  view: solution
occurrences:
  - OCC-P2-MEASURE-PREVENTION
  - OCC-P2-MEASURE-RECOVERY
section_id: SEC-P2-LOCAL-MEASURES
```

計画には訓練・施設整備・耐震化・浸水対策等の予防施策と、救助体制・生活再建支援等の復旧施策が含まれる。

## SEC-P2-REFERENCES
```yaml
anchorage:
  domain:
    - references
    - citation
  phase: confirmed
  view: background
occurrences:
  - OCC-P2-REF-PDF
  - OCC-P2-CITATION
section_id: SEC-P2-REFERENCES
```

## SEC-P3-SCOPE
```yaml
anchorage:
  domain:
    - knowledge-extraction
    - whitepaper
    - part-003
  phase: plan
  view: background
occurrences:
  - OCC-P3-SCOPE-OBJECTIVE
section_id: SEC-P3-SCOPE
```

特集2から、被害概要・初動対応・今後の防災課題を抽出する。

## SEC-P3-HAZARD
```yaml
anchorage:
  domain:
    - hazard
    - earthquake
    - noto
  phase: confirmed
  view: problem
occurrences:
  - OCC-P3-HAZARD-EVENT
  - OCC-P3-HAZARD-DAMAGE
section_id: SEC-P3-HAZARD
```

令和6年能登半島地震は震度7を観測し、人的・住家・ライフラインへ甚大な被害をもたらしたと整理される。

## SEC-P3-GUIDANCE
```yaml
anchorage:
  domain:
    - response
    - recovery
    - guidance
  phase: confirmed
  view: decision
occurrences:
  - OCC-P3-RESPONSE-EMERGENCY
  - OCC-P3-RESPONSE-RECOVERY
  - OCC-P3-GUIDANCE-NEXT
section_id: SEC-P3-GUIDANCE
```

本文は非常災害対策本部と復旧・復興支援本部による対応継続を示し、検証・教訓抽出を通じた次期防災対応を示唆する。

## SEC-P3-REFERENCES
```yaml
anchorage:
  domain:
    - references
    - citation
  phase: confirmed
  view: background
occurrences:
  - OCC-P3-REF-PDF
  - OCC-P3-CITATION
section_id: SEC-P3-REFERENCES
```

## Registry
```yaml
entities:
  IE-P1-CITATION:
    content: 令和6年版防災白書 第1部第1章周辺の抽出結果。
    kind: context
  IE-P1-CONTEXT-PUBLIC-LIMIT:
    content: 広域災害時には公助のみで十分な対応が難しい。
    kind: constraint
  IE-P1-CONTEXT-RISK:
    content: 巨大地震や激甚化する気象災害を背景に被害軽減が課題。
    kind: risk
  IE-P1-MEASURE-HARD-SOFT:
    content: ハード対策とソフト対策の両輪で防災力を高める。
    kind: measure
  IE-P1-MEASURE-TIMELINE:
    content: マイ・タイムライン等の個人行動計画を平時に準備する。
    kind: measure
  IE-P1-REF-PDF:
    content: "Source PDF: ./r6_dai1bu1.pdf"
    kind: evidence
  IE-P1-SCOPE-OBJECTIVE:
    content: 第1部から自助・共助・公助と事前防災行動を抽出する。
    kind: context
  IE-P1-SOURCE-TEXT:
    content: pdftotextで抽出した第1部テキスト。
    kind: evidence
  IE-P2-CITATION:
    content: 令和6年版防災白書 第3部抽出結果。
    kind: context
  IE-P2-MEASURE-PREVENTION:
    content: 教育訓練、施設整備、耐震化、浸水対策等の予防施策。
    kind: measure
  IE-P2-MEASURE-RECOVERY:
    content: 救助体制整備、被災者支援、公共施設復旧等の復旧復興施策。
    kind: measure
  IE-P2-POLICY-FIVE-PILLARS:
    content: 科学技術、予防、国土保全、復旧、国際協力の5分野で防災計画を構成。
    kind: policy
  IE-P2-POLICY-INTERNATIONAL:
    content: 仙台防災枠組の普及・定着と国際防災協力を推進。
    kind: policy
  IE-P2-REF-PDF:
    content: "Source PDF: ./r6_dai3bu.pdf"
    kind: evidence
  IE-P2-SCOPE-OBJECTIVE:
    content: 第3部の計画体系と施策分野を抽出する。
    kind: context
  IE-P2-SOURCE-TEXT:
    content: pdftotextで抽出した第3部テキスト。
    kind: evidence
  IE-P3-CITATION:
    content: 令和6年版防災白書 特集2抽出結果。
    kind: context
  IE-P3-GUIDANCE-NEXT:
    content: 検証と教訓抽出を踏まえ今後の防災対策へ反映。
    kind: decision
  IE-P3-HAZARD-DAMAGE:
    content: 人的・住家・ライフライン等に甚大な被害が発生。
    kind: risk
  IE-P3-HAZARD-EVENT:
    content: 令和6年能登半島地震は震度7観測を含む広域地震。
    kind: risk
  IE-P3-REF-PDF:
    content: "Source PDF: ./r6_tokushu2_1.pdf"
    kind: evidence
  IE-P3-RESPONSE-EMERGENCY:
    content: 非常災害対策本部の下で被災者支援を継続。
    kind: measure
  IE-P3-RESPONSE-RECOVERY:
    content: 復旧・復興支援本部による再生対応を推進。
    kind: measure
  IE-P3-SCOPE-OBJECTIVE:
    content: 特集2から被害と対応を抽出する。
    kind: context
  IE-P3-SOURCE-TEXT:
    content: pdftotextで抽出した特集2テキスト。
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
    target: IE-P1-SOURCE-TEXT
  OCC-P1-CONTEXT-PUBLIC-LIMIT:
    entity: IE-P1-CONTEXT-PUBLIC-LIMIT
    occurrence_id: OCC-P1-CONTEXT-PUBLIC-LIMIT
    role: constraint
    status:
      state: confirmed
    supporting_evidence:
      - IE-P1-SOURCE-TEXT
  OCC-P1-CONTEXT-RISK:
    entity: IE-P1-CONTEXT-RISK
    occurrence_id: OCC-P1-CONTEXT-RISK
    role: observation
    status:
      state: confirmed
    supporting_evidence:
      - IE-P1-SOURCE-TEXT
  OCC-P1-MEASURE-HARD-SOFT:
    entity: IE-P1-MEASURE-HARD-SOFT
    occurrence_id: OCC-P1-MEASURE-HARD-SOFT
    role: solution
    status:
      state: confirmed
    supporting_evidence:
      - IE-P1-SOURCE-TEXT
  OCC-P1-MEASURE-TIMELINE:
    entity: IE-P1-MEASURE-TIMELINE
    occurrence_id: OCC-P1-MEASURE-TIMELINE
    role: solution
    status:
      state: confirmed
    supporting_evidence:
      - IE-P1-SOURCE-TEXT
  OCC-P1-REF-PDF:
    entity: IE-P1-REF-PDF
    occurrence_id: OCC-P1-REF-PDF
    role: citation
    status:
      state: confirmed
    supporting_evidence:
      - IE-P1-REF-PDF
  OCC-P1-SCOPE-OBJECTIVE:
    entity: IE-P1-SCOPE-OBJECTIVE
    occurrence_id: OCC-P1-SCOPE-OBJECTIVE
    role: observation
    status:
      state: confirmed
    supporting_evidence:
      - IE-P1-SOURCE-TEXT
  OCC-P2-CITATION:
    entity: IE-P2-CITATION
    occurrence_id: OCC-P2-CITATION
    role: citation
    status:
      state: confirmed
    supporting_evidence:
      - IE-P2-REF-PDF
    target: IE-P2-SOURCE-TEXT
  OCC-P2-MEASURE-PREVENTION:
    entity: IE-P2-MEASURE-PREVENTION
    occurrence_id: OCC-P2-MEASURE-PREVENTION
    role: solution
    status:
      state: confirmed
    supporting_evidence:
      - IE-P2-SOURCE-TEXT
  OCC-P2-MEASURE-RECOVERY:
    entity: IE-P2-MEASURE-RECOVERY
    occurrence_id: OCC-P2-MEASURE-RECOVERY
    role: solution
    status:
      state: confirmed
    supporting_evidence:
      - IE-P2-SOURCE-TEXT
  OCC-P2-POLICY-FIVE-PILLARS:
    entity: IE-P2-POLICY-FIVE-PILLARS
    occurrence_id: OCC-P2-POLICY-FIVE-PILLARS
    role: decision
    status:
      state: confirmed
    supporting_evidence:
      - IE-P2-SOURCE-TEXT
  OCC-P2-POLICY-INTERNATIONAL:
    entity: IE-P2-POLICY-INTERNATIONAL
    occurrence_id: OCC-P2-POLICY-INTERNATIONAL
    role: decision
    status:
      state: confirmed
    supporting_evidence:
      - IE-P2-SOURCE-TEXT
  OCC-P2-REF-PDF:
    entity: IE-P2-REF-PDF
    occurrence_id: OCC-P2-REF-PDF
    role: citation
    status:
      state: confirmed
    supporting_evidence:
      - IE-P2-REF-PDF
  OCC-P2-SCOPE-OBJECTIVE:
    entity: IE-P2-SCOPE-OBJECTIVE
    occurrence_id: OCC-P2-SCOPE-OBJECTIVE
    role: observation
    status:
      state: confirmed
    supporting_evidence:
      - IE-P2-SOURCE-TEXT
  OCC-P3-CITATION:
    entity: IE-P3-CITATION
    occurrence_id: OCC-P3-CITATION
    role: citation
    status:
      state: confirmed
    supporting_evidence:
      - IE-P3-REF-PDF
    target: IE-P3-SOURCE-TEXT
  OCC-P3-GUIDANCE-NEXT:
    entity: IE-P3-GUIDANCE-NEXT
    occurrence_id: OCC-P3-GUIDANCE-NEXT
    role: decision
    status:
      state: confirmed
    supporting_evidence:
      - IE-P3-SOURCE-TEXT
  OCC-P3-HAZARD-DAMAGE:
    entity: IE-P3-HAZARD-DAMAGE
    occurrence_id: OCC-P3-HAZARD-DAMAGE
    role: observation
    status:
      state: confirmed
    supporting_evidence:
      - IE-P3-SOURCE-TEXT
  OCC-P3-HAZARD-EVENT:
    entity: IE-P3-HAZARD-EVENT
    occurrence_id: OCC-P3-HAZARD-EVENT
    role: observation
    status:
      state: confirmed
    supporting_evidence:
      - IE-P3-SOURCE-TEXT
  OCC-P3-REF-PDF:
    entity: IE-P3-REF-PDF
    occurrence_id: OCC-P3-REF-PDF
    role: citation
    status:
      state: confirmed
    supporting_evidence:
      - IE-P3-REF-PDF
  OCC-P3-RESPONSE-EMERGENCY:
    entity: IE-P3-RESPONSE-EMERGENCY
    occurrence_id: OCC-P3-RESPONSE-EMERGENCY
    role: solution
    status:
      state: confirmed
    supporting_evidence:
      - IE-P3-SOURCE-TEXT
  OCC-P3-RESPONSE-RECOVERY:
    entity: IE-P3-RESPONSE-RECOVERY
    occurrence_id: OCC-P3-RESPONSE-RECOVERY
    role: solution
    status:
      state: confirmed
    supporting_evidence:
      - IE-P3-SOURCE-TEXT
  OCC-P3-SCOPE-OBJECTIVE:
    entity: IE-P3-SCOPE-OBJECTIVE
    occurrence_id: OCC-P3-SCOPE-OBJECTIVE
    role: observation
    status:
      state: confirmed
    supporting_evidence:
      - IE-P3-SOURCE-TEXT
relations: []
sections:
  SEC-P1-HAZARD-CONTEXT:
    anchorage:
      domain:
        - hazard
        - preparedness
        - jijo-kyojo-kojo
      phase: confirmed
      view: problem
    occurrences:
      - OCC-P1-CONTEXT-RISK
      - OCC-P1-CONTEXT-PUBLIC-LIMIT
  SEC-P1-LOCAL-MEASURES:
    anchorage:
      domain:
        - local-measures
        - preparedness
        - community
      phase: plan
      view: solution
    occurrences:
      - OCC-P1-MEASURE-HARD-SOFT
      - OCC-P1-MEASURE-TIMELINE
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
      phase: plan
      view: background
    occurrences:
      - OCC-P1-SCOPE-OBJECTIVE
  SEC-P2-LOCAL-MEASURES:
    anchorage:
      domain:
        - local-measures
        - infrastructure
        - prevention
      phase: plan
      view: solution
    occurrences:
      - OCC-P2-MEASURE-PREVENTION
      - OCC-P2-MEASURE-RECOVERY
  SEC-P2-NATIONAL-POLICY:
    anchorage:
      domain:
        - policy
        - planning
        - national
      phase: confirmed
      view: decision
    occurrences:
      - OCC-P2-POLICY-FIVE-PILLARS
      - OCC-P2-POLICY-INTERNATIONAL
  SEC-P2-REFERENCES:
    anchorage:
      domain:
        - references
        - citation
      phase: confirmed
      view: background
    occurrences:
      - OCC-P2-REF-PDF
      - OCC-P2-CITATION
  SEC-P2-SCOPE:
    anchorage:
      domain:
        - knowledge-extraction
        - whitepaper
        - part-002
      phase: plan
      view: background
    occurrences:
      - OCC-P2-SCOPE-OBJECTIVE
  SEC-P3-GUIDANCE:
    anchorage:
      domain:
        - response
        - recovery
        - guidance
      phase: confirmed
      view: decision
    occurrences:
      - OCC-P3-RESPONSE-EMERGENCY
      - OCC-P3-RESPONSE-RECOVERY
      - OCC-P3-GUIDANCE-NEXT
  SEC-P3-HAZARD:
    anchorage:
      domain:
        - hazard
        - earthquake
        - noto
      phase: confirmed
      view: problem
    occurrences:
      - OCC-P3-HAZARD-EVENT
      - OCC-P3-HAZARD-DAMAGE
  SEC-P3-REFERENCES:
    anchorage:
      domain:
        - references
        - citation
      phase: confirmed
      view: background
    occurrences:
      - OCC-P3-REF-PDF
      - OCC-P3-CITATION
  SEC-P3-SCOPE:
    anchorage:
      domain:
        - knowledge-extraction
        - whitepaper
        - part-003
      phase: plan
      view: background
    occurrences:
      - OCC-P3-SCOPE-OBJECTIVE
structure:
  sections:
    - SEC-P1-SCOPE
    - SEC-P1-HAZARD-CONTEXT
    - SEC-P1-LOCAL-MEASURES
    - SEC-P1-REFERENCES
    - SEC-P2-SCOPE
    - SEC-P2-NATIONAL-POLICY
    - SEC-P2-LOCAL-MEASURES
    - SEC-P2-REFERENCES
    - SEC-P3-SCOPE
    - SEC-P3-HAZARD
    - SEC-P3-GUIDANCE
    - SEC-P3-REFERENCES
```
