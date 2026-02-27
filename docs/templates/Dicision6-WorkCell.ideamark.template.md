# Decision6 WorkCell - Software Specification Template (v1.0.2)

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
  version: "1.0.0"
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
    - "SEC-INTENT"
    - "SEC-HYPOTHESIS"
    - "SEC-OPTIONS"
    - "SEC-EXPERIMENT"
    - "SEC-METRICS"
    - "SEC-DECISION"
```

---

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