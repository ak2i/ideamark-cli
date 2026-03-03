```yaml
ideamark_version: 1
doc_id: "ideamark.cli.v0.1.3.dev-spec.v0.0.2.2026-02-28"
doc_type: "spec"
status: "in_progress"
created_at: "2026-02-28T12:00:00+09:00"
updated_at: "2026-02-28T12:00:00+09:00"
lang: "ja-JP"

template:
  id: "imtpl.decision6.workcell"
  name: "Decision6 WorkCell Template"
  version: "1.0.2"
  file: "Dicision6-WorkCell.ideamark.template.md"
  description: "Decision6 WorkCell を用いて IdeaMark-CLI v0.1.3 の開発仕様を更新しながら議論するための作業仕様書"

refs:
  sources:
    - id: "TEMPLATE-DECISION6"
      uri: "./Dicision6-WorkCell.ideamark.template.md"
      role: "template"
      description: "議論の進行に使うテンプレート"
    - id: "PARAMS"
      uri: "./params.json"
      role: "source_material"
      description: "IdeaMark params (doc-cli-contract v1.0.2 / ideamark-cli v0.1.2)"
    - id: "AI-AUTHORING"
      uri: "./ai-authoring.json"
      role: "source_material"
      description: "IdeaMark ai-authoring guide (doc-cli-contract v1.0.2 / ideamark-cli v0.1.2)"
```

---

# Overview

本ドキュメントは **IdeaMark-CLI v0.1.3** の開発仕様（dev spec）であり、  
主に以下を扱う。

- `describe guides` の改修（人間向けMDの冗長化、AI向けJSONの最小化、JA/EN提供）
- 分割 Section（Section→独立文書化）の導入（copy/ref/hybrid）
- 上記を **LLMプロンプトテスト**で検証し、次段で responder-bridge 適用へ進むための“固定点”を作る

この段階では diff/lint 本体は後回しとし、ただし将来の diff/lint を壊さないために、分割・統合に関わる最小ポリシーは明文化する。

---

# Section 001 : Intent（目的と境界）

```yaml
section_id: "SEC-INTENT"
anchorage:
  view: "decision"
  phase: "plan"
  domain: ["ideamark", "doc-cli-contract", "tooling"]
```

## 目的
- guides を「運任せ」から脱し、**安定して IdeaMark 仕様に沿う生成/編集/分割/統合**が行える状態を作る
- LLM が `capabilities` を見た後に、**自走して describe を取り、正しいプロセスに入れる**ようにする
- 分割 Section を先に固め、後続の diff/lint が意味ある信号を出せる前提を作る

## 境界（今回やらない）
- diff/lint のフル実装（v0.1.3では実装しない）
- IDE統合やUI（responder-bridge対応は検証の次段）

---

# Section 002 : Hypotheses（成立仮説）

```yaml
section_id: "SEC-HYPOTHESIS"
anchorage:
  view: "problem"
  phase: "hypothesis"
```

- H1: `describe guides --format json` を **低トークン**で提供しても、必要なチェックと手順を保持すれば、LLM の validation→修正ループが減る
- H2: `describe` のオプションは **直交設計（audience/lang/model）**を正規I/Fにし、profileはエイリアスにすることで、LLMがcapabilitiesから正確に呼び出せる
- H3: Section→独立文書化（breakdown/split）で、`derived_from` 等の来歴を保持し、IDを維持してcopyするデフォルトにすると、統合時の衝突が扱いやすい

---

# Section 003 : Decision Options（選択肢比較）

```yaml
section_id: "SEC-OPTIONS"
anchorage:
  view: "comparison"
  phase: "exploration"
```

## describe の出力切り替え設計

### Option A（profile方式を正規I/Fにする）
- Pros: 実装が単純（ディレクトリ内のファイル選択に寄せやすい）
- Cons: LLMがcapabilitiesから「どの観点が変わるか」を推論しやすく、誤選択が増える

### Option B（直交方式を正規I/Fにする）※採用
- I/F: `--audience human|ai`, `--lang ja|en`, `--model small|large`
- profile はショートカット（展開して直交I/Fへ正規化）
- Pros: LLMが意図を分解して指定できる（capabilities→describe の自走が安定）
- Cons: 実装は正規化レイヤが必要

採用理由：検証の主戦場が「LLMの安定動作」であり、capabilitiesを踏まえた自己誘導を重視するため。

---

# Section 004 : Experiment / Production Scope

```yaml
section_id: "SEC-EXPERIMENT"
anchorage:
  view: "solution"
  phase: "plan"
```

## v0.1.3で追加/変更する describe I/F（案）

現状：
- `ideamark describe <topic> [--format json|yaml|md]`

v0.1.3（後方互換維持）：
- `ideamark describe <topic> [--format json|yaml|md] [--audience human|ai] [--lang ja|en] [--model small|large] [--profile <name>]`

### 正規化ルール
- `--profile` 指定時は内部で `audience/lang/model` に展開し、以後は直交I/Fで処理する
- `--model` は `--audience ai` の時のみ有効（それ以外は無視 or エラー（実装方針を後で確定））
- デフォルト：
  - `--format md` → `audience=human, lang=ja`（環境変数やロケールで切替可）
  - `--format json` → `audience=ai, model=small`

### guides の提供方針
- MD:
  - `human-ja` / `human-en` を提供（読みやすさ優先、冗長OK）
- JSON:
  - `ai-small` を基本（最短手順＋必須チェック＋禁止事項）
  - `ai-large` は判断基準・分岐を含む（copy/ref/hybrid選択など）

## 分割 Section（独立文書化）
- コマンド名は後で確定（候補：`breakdown` / `split` / `sectionize`）
- 出力は Section ごとの独立 IdeaMark 文書（ファイル群）
- モード：
  - `copy`（デフォルト）：参照される entities/occurrences を同梱。IDは保持。
  - `ref`：元文書参照を保持し同梱しない（参照解決が必要）。
  - `hybrid`：ローカルはcopy、共有はref（判定ロジックは将来拡張）。

### 来歴の最低要件（v0.1.3で必須）
- 分割文書は `refs.derived_from`（元doc_id + 元section_id）を持つ
- `DerivationOp: breakdown` 相当の情報を記録する（場所は後で確定：header拡張 or refs内メタ）
- 元から持ってきた entity/occurrence はIDを維持（copyでも維持）
- 新規に作られたものは新ID

---

# Section 005 : Metrics（観測設計）

```yaml
section_id: "SEC-METRICS"
anchorage:
  view: "observation_series"
  phase: "plan"
```

## LLMプロンプトテスト（先行）で測るもの
- M1: 生成されたIdeaMark文書が working mode の必須条件を満たす率（YAML parse / ID一意 / 参照解決）
- M2: strict mode 相当の欠落（header/anchorage vocab 等）を自己修正できる率
- M3: guides JSON を使ったときの “再試行回数” の減少
- M4: 分割→精緻化→統合の往復で、情報落ち/混線が起きない率

### 最低限の検証シナリオ（テンプレ）
1) 入力文書を生成（長め：複数Section + Entities/Occurrences）
2) 分割（copy）して複数文書へ
3) 分割後の各文書を精緻化（追記・修正）
4) 統合して一つに戻す
5) 抽出（extract）でサマリや特定viewだけを得る
6) 合成（compose）で別ドキュメントと組み合わせる（将来）

---

# Section 006 : Decision Log（正式判断）

```yaml
section_id: "SEC-DECISION"
anchorage:
  view: "decision"
  phase: "confirmed"
```

- D1: `describe` は直交I/F（audience/lang/model）を正規とし、profileはエイリアスとして併設する
- D2: guidesは3層（Quickstart/Recipes/Reference）で、MDはJA/EN、人間向け冗長、JSONはAI向け最小とする
- D3: 分割Sectionは独立文書化（案1）を採用し、copy/ref/hybrid を明示、デフォルトは copy
- D4: 検証は LLMプロンプトテストを先行し、guides品質を上げた後に responder-bridge を適用する

---

# Entities Registry

```yaml
entities:

  IE-INTENT:
    kind: "decision_package"
    content: "IdeaMark-CLI v0.1.3 で guides改修と分割Sectionを先に完成させ、LLM運用で安定した生成/分割/精緻化/統合を検証できる状態にする"
    atomic_state: false

  IE-H1:
    kind: "hypothesis"
    content: "guides JSON を最小化しても、必須チェックと手順を保持すれば LLM の修正ループが減る"

  IE-H2:
    kind: "hypothesis"
    content: "describe は直交I/F（audience/lang/model）を正規とし、profileはエイリアスにすると LLM が capabilities から正確に呼べる"

  IE-H3:
    kind: "hypothesis"
    content: "Section→独立文書化で derived_from 等の来歴を保持し、ID維持copyをデフォルトにすると統合時の衝突が扱いやすい"

  IE-DECISION-001:
    kind: "decision"
    content: "v0.1.3 の describe I/F と guides / 分割Section 方針を確定し、LLMプロンプトテストを先行させる"

  IE-METRIC-001:
    kind: "metric"
    content: "LLMテストでの合格率（YAML parse / ID一意 / 参照解決 / 自己修正率 / 再試行回数）"
    measure_type: "quality"

occurrences:

  OCC-INTENT:
    entity: "IE-INTENT"
    role: "problem_core"
    status:
      state: "confirmed"

  OCC-H1:
    entity: "IE-H1"
    role: "hypothesis"
    status:
      state: "provisional"

  OCC-H2:
    entity: "IE-H2"
    role: "hypothesis"
    status:
      state: "provisional"

  OCC-H3:
    entity: "IE-H3"
    role: "hypothesis"
    status:
      state: "provisional"

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
    occurrences: ["OCC-H1", "OCC-H2", "OCC-H3"]

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
  - type: "supports"
    from: "IE-H2"
    to: "IE-DECISION-001"
  - type: "supports"
    from: "IE-H3"
    to: "IE-DECISION-001"
  - type: "measures"
    from: "IE-METRIC-001"
    to: "IE-H1"

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

# Section 007 : Guides Gap Analysis & Redesign（v0.0.2 追加）

```yaml
section_id: "SEC-GUIDES-REDESIGN"
anchorage:
  view: "analysis"
  phase: "exploration"
```

## 現状課題（ai-authoring / params ベース）

以下の点において「運任せ」になりやすい構造が確認された：

1. 手順が“説明中心”であり、**実行順序の強制力が弱い**
2. working / strict モードの違いはあるが、**生成→検証→修正のループが明示的でない**
3. ai-authoring と params の関係が「参照前提」で、
   LLM が一度に把握すべき最小セットが明示されていない
4. Section分割・統合などの操作が guides に統合されていないため、
   CLIの操作フローが一貫していない

---

## v0.1.3 Guides 再設計方針

### 1. guides JSON（ai-small）の必須構造

- version
- goal
- preconditions
- steps[]
  - command
  - args
  - required_checks[]
- minimal_validation[]
- forbidden_patterns[]
- followup_topics[]

### 2. ai-small の原則

- 選択肢を減らす（copyをデフォルト明示）
- strict相当チェックを簡潔に含める
- 必要なら describe params / ai-authoring を追加取得させる

### 3. ai-large の原則

- copy/ref/hybrid の判断基準を含める
- merge衝突ポリシーの選択肢を提示
- 将来diff/lintとの接続を示唆

### 4. MD（human向け）

- JA/EN 両対応
- Why（設計思想）を明示
- 手順＋背景＋判断基準を冗長に記述

---

## describe I/F 再確認（固定仕様）

- 正規I/F：--audience / --lang / --model
- profile はエイリアス
- format=json のデフォルト：audience=ai, model=small
- format=md のデフォルト：audience=human, lang=ja

---

## 次段タスク（v0.0.3予定）

- ai-small 用 guides JSON サンプル生成
- Section分割コマンド仕様（I/O明文化）
- LLMプロンプトテストスクリプト設計
