# Decision6 WorkCell - Software Specification Template (v1.0.3)

```yaml
ideamark_version: 1
doc_id: "decision6.workcell.<project-name>.<yyyy-mm-dd>"
doc_type: "pattern"
status: "in_progress"
created_at: "<ISO-8601>"
updated_at: "<ISO-8601>"
lang: "ja-JP"

template:
  id: "imtpl.decision6.workcell"
  name: "Decision6 WorkCell Template"
  version: "1.0.3"
  file: "Decision6-WorkCell.ideamark.template.md"
  description: "Decision6 WorkCell を IdeaMark v1.0.2 に適合させた仕様書テンプレート"

refs:
  sources:
    - id: "TEMPLATE-DECISION6"
      uri: "./Decision6-WorkCell.ideamark.template.md"
      role: "template"
      description: "元となったDecision6テンプレート"
```

---

# Overview

本ドキュメントは、  
**ソフトウェア開発・改修プロジェクトにおける判断の固定点を構造化するための WorkCell 仕様書テンプレート**である。

目的は以下：

- 要件を「機能一覧」ではなく「判断構造」として固定する
- 仮説と検証を仕様に内包する
- 実装と判断を分離しつつ追跡可能にする
- 将来の改修時に「なぜそうなっているのか」が分かる状態を作る


---

# Section 000 : Routing & Inbox Operating Model（テンプレート標準拡張 / v1.0.3）

```yaml
section_id: "SEC-ROUTING"
anchorage:
  view: "decision"
  phase: "plan"
  domain: ["workcell", "routing", "authoring"]
```

## このテンプレートを「議論しながら育てる」ための前提

この WorkCell は **Section骨格（層1）を固定し、話題は原則として Occurrence / Entity として差し込む**運用を想定する。

- Section は「章立て（スロット）」であり、頻繁には増やさない
- 新しい話題は、まず **ルーティング（層2）**で入れ先を決める
- 入れ先が不明な断片は **INBOX（層3）**に集約し、後で統合（merge）する

---

## Routing Decision（層2）

### 目的
新しい話題（断片・結論・要件・反証・TODOなど）を、既存のどの Section に追加すべきかを決める。

### 入力
- 追加したい話題（短文〜段落）
- 現在の Section 一覧（各 section の anchorage）

### 出力（推奨）
- target_section_id（追加先）
- intent: append | expand | refactor_suggest
- confidence: 0..1
- rationale（短い理由）

### ルーティング規約（最小）
1. `anchorage.view` を優先キーにする（例：decision/problem/comparison/solution/observation_series）
2. 次に `anchorage.phase` を補助キーにする（plan/hypothesis/exploration/design/confirmed）
3. `anchorage.domain` は tie-break に使う
4. 迷ったら `SEC-INBOX` に入れる（後で統合）

---

## INBOX（層3 / 受け皿）

```yaml
section_id: "SEC-INBOX"
anchorage:
  view: "analysis"
  phase: "plan"
  domain: ["workcell", "inbox"]
```

### 役割
- ルーティングが確定できない断片を一時保管する
- 後で merge/refactor の対象として抽出しやすくする

### 運用ルール
- INBOX には「未整理」ラベルの Occurrence を追加する
- 定期的に（後述の cadence）INBOX を空にする（可能なら）

---

## Merge / Refactor Cadence（統合と再編のリズム）

### Merge（統合）
- INBOX の Occurrence を適切な Section に移動する
- 重複 Entity を統合し、relations を整備する

### Refactor（再編）
- 「話が大きく変わった」場合のみ Section 構成を変更する
- Refactor は event として記録する（例：pivot entity）

### 推奨 cadence（例）
- merge: 1日1回 もしくは 変更が一定量溜まったら
- refactor: 大転換が起きたときのみ（都度）


---

# Section 001 : Intent（目的と境界）

```yaml
section_id: "SEC-INTENT"
anchorage:
  view: "decision"
  phase: "plan"
  domain: ["software-development"]
```

### 判断ポイント
- 何を達成すれば「成功」と言えるのか？
- 何はやらないのか？
- 誰の意思決定に影響するのか？

---

# Section 002 : Hypotheses（成立仮説）

```yaml
section_id: "SEC-HYPOTHESIS"
anchorage:
  view: "problem"
  phase: "hypothesis"
```

### 判断ポイント
- この設計はどの前提の上に立っているか？
- どの仮説が崩れたら再設計になるか？
- 反証可能か？

---

# Section 003 : Decision Options（選択肢比較）

```yaml
section_id: "SEC-OPTIONS"
anchorage:
  view: "comparison"
  phase: "exploration"
```

### 判断ポイント
- なぜ他案を採用しなかったのか？
- トレードオフは明示されているか？
- 将来変更可能か？

---

# Section 004 : Experiment / Production Scope

```yaml
section_id: "SEC-EXPERIMENT"
anchorage:
  view: "solution"
  phase: "plan"
```

### 判断ポイント
- 今回の実装は何を検証するためのものか？
- 何は意図的に未実装か？
- 失敗時の撤退条件は？

---

# Section 005 : Metrics（観測設計）

```yaml
section_id: "SEC-METRICS"
anchorage:
  view: "observation_series"
  phase: "plan"
```

### 判断ポイント
- 何を測れば仮説が評価できるか？
- 近接指標か？
- 定性的判断に依存していないか？

---

# Section 006 : Decision Log（正式判断）

```yaml
section_id: "SEC-DECISION"
anchorage:
  view: "decision"
  phase: "confirmed"
```

### 判断ポイント
- なぜ今決めるのか？
- 次の判断トリガーは何か？
- 何を持って再検討するか？

---

# Entities Registry

```yaml
entities:

  IE-INTENT:
    kind: "decision_package"
    content: "<このWorkCellの目的定義>"
    atomic_state: false

  IE-ROUTING-POLICY:
    kind: "policy"
    content: "新しい話題を既存Sectionへ割り当てるためのRouting Decision規約（view/phase/domain、迷ったらINBOX）"

  IE-INBOX-POLICY:
    kind: "policy"
    content: "ルーティング不確実な断片をSEC-INBOXへ集約し、定期的にmergeする"

  IE-CADENCE:
    kind: "policy"
    content: "merge/refactor の頻度と手順（mergeは定期、refactorは大転換時のみ）"

  IE-PIVOT-EVENT:
    kind: "event"
    content: "話の大転換（Section再編のトリガー）"

  IE-SUCCESS:
    kind: "metric"
    content: "<成功定義>"
    measure_type: "quality"

  IE-CONSTRAINT:
    kind: "constraint"
    content: "<制約条件>"

  IE-HYP-001:
    kind: "hypothesis"
    content: "<成立仮説>"

  IE-OPTION-001:
    kind: "measure"
    content: "<採用案>"

  IE-METRIC-001:
    kind: "metric"
    content: "<観測指標>"
    measure_type: "flow"

  IE-DECISION-001:
    kind: "decision"
    content: "<正式判断内容>"

occurrences:

  OCC-INTENT:
    entity: "IE-INTENT"
    role: "problem_core"
    status:
      state: "confirmed"

  OCC-ROUTING-POLICY:
    entity: "IE-ROUTING-POLICY"
    role: "policy"
    status:
      state: "confirmed"

  OCC-INBOX-POLICY:
    entity: "IE-INBOX-POLICY"
    role: "policy"
    status:
      state: "confirmed"

  OCC-CADENCE:
    entity: "IE-CADENCE"
    role: "policy"
    status:
      state: "confirmed"

  OCC-PIVOT-EVENT:
    entity: "IE-PIVOT-EVENT"
    role: "event"
    status:
      state: "provisional"

  OCC-HYP-001:
    entity: "IE-HYP-001"
    role: "precondition"
    status:
      state: "provisional"

  OCC-OPTION-001:
    entity: "IE-OPTION-001"
    role: "operationalizes"
    status:
      state: "confirmed"

  OCC-METRIC-001:
    entity: "IE-METRIC-001"
    role: "measures"
    status:
      state: "confirmed"

  OCC-DECISION-001:
    entity: "IE-DECISION-001"
    role: "conclusion"
    status:
      state: "confirmed"

sections:

  SEC-INTENT:
    anchorage:
      view: "decision"
      phase: "plan"
    occurrences: ["OCC-INTENT"]

  SEC-ROUTING:
    anchorage:
      view: "decision"
      phase: "plan"
    occurrences: ["OCC-ROUTING-POLICY", "OCC-INBOX-POLICY", "OCC-CADENCE", "OCC-PIVOT-EVENT"]

  SEC-INBOX:
    anchorage:
      view: "analysis"
      phase: "plan"
    occurrences: ["OCC-INBOX-POLICY"]

  SEC-HYPOTHESIS:
    anchorage:
      view: "problem"
      phase: "hypothesis"
    occurrences: ["OCC-HYP-001"]

  SEC-OPTIONS:
    anchorage:
      view: "comparison"
      phase: "exploration"
    occurrences: ["OCC-OPTION-001"]

  SEC-METRICS:
    anchorage:
      view: "observation_series"
      phase: "plan"
    occurrences: ["OCC-METRIC-001"]

  SEC-DECISION:
    anchorage:
      view: "decision"
      phase: "confirmed"
    occurrences: ["OCC-DECISION-001"]

relations:
  - type: "requires"
    from: "IE-OPTION-001"
    to: "IE-HYP-001"

  - type: "measures"
    from: "IE-METRIC-001"
    to: "IE-HYP-001"

  - type: "operationalizes"
    from: "IE-OPTION-001"
    to: "IE-INTENT"

structure:
  sections:
    - "SEC-ROUTING"
    - "SEC-INBOX"
    - "SEC-INTENT"
    - "SEC-HYPOTHESIS"
    - "SEC-OPTIONS"
    - "SEC-EXPERIMENT"
    - "SEC-METRICS"
    - "SEC-DECISION"
```

---


---

# Section INBOX : Inbox（未整理の断片）

```yaml
section_id: "SEC-INBOX"
anchorage:
  view: "analysis"
  phase: "plan"
  domain: ["workcell", "inbox"]
```

ここには、まだどの Section に入れるべきか確定していない断片（アイディア、懸念、TODO、引用、検証メモなど）を追加する。

- 後で merge する前提で、**文脈と出典**をできるだけ添える
- 可能なら「どの Section 候補か」をメモしておく（確信がなくてもよい）


# Evidence Example (v1.0.2)

```yaml ideamark:evidence
id: "EVID-001"
target: "IE-METRIC-001"
source: "analytics-log-2026-03"
memo: "初期データは想定より20%低い"
```

---

# このテンプレートの設計思想

1. **Intent が最上流**
2. Hypothesis が崩れれば設計変更
3. Option は常に比較可能
4. 実装は Experiment
5. Metric が判断の質を保証
6. DecisionLog が最終成果物

---

# 改修プロジェクト向け拡張ポイント

- 既存仕様は `refs.sources role: source_material`
- 既存判断は `derived_from`
- 変更理由は `supersedes`
- 技術的負債は `risk`
- 移行計画は `state_transition`

---