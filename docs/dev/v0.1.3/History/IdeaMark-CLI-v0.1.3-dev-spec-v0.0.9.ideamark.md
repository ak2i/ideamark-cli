---
ideamark_version: 1
doc_id: "ideamark.cli.v0.1.3.dev-spec.v0.0.9.2026-02-28"
doc_type: "spec"
status: "in_progress"
created_at: "2026-02-28T12:00:00+09:00"
updated_at: "2026-02-28T08:56:56.355998+09:00"
lang: "ja-JP"

template:
  id: "imtpl.decision6.workcell"
  name: "Decision6 WorkCell Template"
  version: "1.0.3"
  file: "Decision6-WorkCell.ideamark.template.v1.0.3.md"
  description: "v0.0.6内容を情報損失ゼロでDecision6骨格へ投影したv0.0.9（Occurrence網羅＋Projection強化）"

---

# Overview

本書は v0.0.6 の内容（Section 001〜011、設計原則、JSON例、用語、互換性）を **情報損失ゼロ**で保持しつつ、Decision6 WorkCell の運用（Section骨格固定＋Routing＋INBOX＋merge/refactor cadence）に合わせて再配置した v0.0.9 である。

この版のルール：
- **正（canonical）は Entities/Occurrences**（実装・検証・差分の対象）
- Markdown本文は **Projection View**（読みやすさのための投影）。原則として Occurrence から生成・更新できる形にする
- 迷い・未確定は SEC-INBOX に貯め、定期 merge で解消する

---

# Section 000 : Routing & Inbox Operating Model（投影ビュー）
```yaml
section_id: "SEC-ROUTING"
anchorage:
  view: "decision"
  phase: "design"
  domain: ["workcell", "routing", "authoring"]
```

## Section Summary
本specは「議論しながら育てる」前提で、Section増殖を避け、話題は Occurrence として差し込む運用に移行する。

## Normative Points
- 新しい話題は原則として **Occurrence追加**（既存Sectionへルーティング）
- ルーティングが確定できない断片は **SEC-INBOX** へ
- merge は定期実施、refactor は pivot（大転換）時のみ
- Markdown本文は投影であり、詳細は Entities/Occurrences を参照する

---

# SEC-INTENT（投影ビュー）
```yaml
section_id: "SEC-INTENT"
anchorage:
  view: "decision"
  phase: "plan"
  domain: ["ideamark", "doc-cli-contract", "tooling"]
```

## Section Summary
IdeaMark-CLI v0.1.3 の開発仕様の目的と境界。guides改修／describe直交I/F／分割Section（独立文書化）を先に固め、LLMプロンプトテストで検証する。

## Detailed Notes (verbatim from v0.0.6)
以下は情報損失を防ぐため、v0.0.6 の該当ブロックをそのまま保持する。

# Overview

本ドキュメントは **IdeaMark-CLI v0.1.3** の開発仕様（dev spec）であり、\
主に以下を扱う。

-   `describe guides`
    の改修（人間向けMDの冗長化、AI向けJSONの最小化、JA/EN提供）
-   分割 Section（Section→独立文書化）の導入（copy/ref/hybrid）
-   上記を **LLMプロンプトテスト**で検証し、次段で responder-bridge
    適用へ進むための"固定点"を作る

この段階では diff/lint 本体は後回しとし、ただし将来の diff/lint
を壊さないために、分割・統合に関わる最小ポリシーは明文化する。

------------------------------------------------------------------------

# Section 001 : Intent（目的と境界）

``` yaml
section_id: "SEC-INTENT"
anchorage:
  view: "decision"
  phase: "plan"
  domain: ["ideamark", "doc-cli-contract", "tooling"]
```

## 目的

-   guides を「運任せ」から脱し、**安定して IdeaMark
    仕様に沿う生成/編集/分割/統合**が行える状態を作る
-   LLM が `capabilities` を見た後に、**自走して describe
    を取り、正しいプロセスに入れる**ようにする
-   分割 Section を先に固め、後続の diff/lint
    が意味ある信号を出せる前提を作る

## 境界（今回やらない）

-   diff/lint のフル実装（v0.1.3では実装しない）
-   IDE統合やUI（responder-bridge対応は検証の次段）

------------------------------------------------------------------------

---

# SEC-HYPOTHESIS（投影ビュー）
```yaml
section_id: "SEC-HYPOTHESIS"
anchorage:
  view: "problem"
  phase: "hypothesis"
  domain: ["guides", "describe", "breakdown", "llm"]
```

## Section Summary
成立仮説（H1〜H3）を保持し、後続の検証（Metrics）と紐づける。

## Detailed Notes (verbatim from v0.0.6)
以下は情報損失を防ぐため、v0.0.6 の該当ブロックをそのまま保持する。

# Section 002 : Hypotheses（成立仮説）

``` yaml
section_id: "SEC-HYPOTHESIS"
anchorage:
  view: "problem"
  phase: "hypothesis"
```

-   H1: `describe guides --format json` を
    **低トークン**で提供しても、必要なチェックと手順を保持すれば、LLM の
    validation→修正ループが減る
-   H2: `describe` のオプションは
    **直交設計（audience/lang/model）**を正規I/Fにし、profileはエイリアスにすることで、LLMがcapabilitiesから正確に呼び出せる
-   H3: Section→独立文書化（breakdown/split）で、`derived_from`
    等の来歴を保持し、IDを維持してcopyするデフォルトにすると、統合時の衝突が扱いやすい

------------------------------------------------------------------------

---

# SEC-OPTIONS（投影ビュー）
```yaml
section_id: "SEC-OPTIONS"
anchorage:
  view: "comparison"
  phase: "exploration"
  domain: ["cli-design", "interfaces"]
```

## Section Summary
describe の出力切り替え設計（profile方式 vs 直交方式）を比較し、直交方式（Option B）採用を明文化する。

## Detailed Notes (verbatim from v0.0.6)
以下は情報損失を防ぐため、v0.0.6 の該当ブロックをそのまま保持する。

# Section 003 : Decision Options（選択肢比較）

``` yaml
section_id: "SEC-OPTIONS"
anchorage:
  view: "comparison"
  phase: "exploration"
```

## describe の出力切り替え設計

### Option A（profile方式を正規I/Fにする）

-   Pros: 実装が単純（ディレクトリ内のファイル選択に寄せやすい）
-   Cons:
    LLMがcapabilitiesから「どの観点が変わるか」を推論しやすく、誤選択が増える

### Option B（直交方式を正規I/Fにする）※採用

-   I/F: `--audience human|ai`, `--lang ja|en`, `--model small|large`
-   profile はショートカット（展開して直交I/Fへ正規化）
-   Pros: LLMが意図を分解して指定できる（capabilities→describe
    の自走が安定）
-   Cons: 実装は正規化レイヤが必要

採用理由：検証の主戦場が「LLMの安定動作」であり、capabilitiesを踏まえた自己誘導を重視するため。

------------------------------------------------------------------------

---

# SEC-DESIGN-DESCRIBE_BREAKDOWN（投影ビュー）
```yaml
section_id: "SEC-DESIGN-DESCRIBE_BREAKDOWN"
anchorage:
  view: "solution"
  phase: "plan"
  domain: ["describe", "guides", "breakdown", "split", "lineage"]
```

## Section Summary
v0.1.3で追加/変更する describe I/F、正規化ルール、guides提供方針、分割Section（独立文書化）と来歴最低要件を仕様として保持する。

## Detailed Notes (verbatim from v0.0.6)
以下は情報損失を防ぐため、v0.0.6 の該当ブロックをそのまま保持する。

# Section 004 : Experiment / Production Scope

``` yaml
section_id: "SEC-EXPERIMENT"
anchorage:
  view: "solution"
  phase: "plan"
```

## v0.1.3で追加/変更する describe I/F（案）

現状： - `ideamark describe <topic> [--format json|yaml|md]`

v0.1.3（後方互換維持）： -
`ideamark describe <topic> [--format json|yaml|md] [--audience human|ai] [--lang ja|en] [--model small|large] [--profile <name>]`

### 正規化ルール

-   `--profile` 指定時は内部で `audience/lang/model`
    に展開し、以後は直交I/Fで処理する
-   `--model` は `--audience ai` の時のみ有効（それ以外は無視 or
    エラー（実装方針を後で確定））
-   デフォルト：
    -   `--format md` →
        `audience=human, lang=ja`（環境変数やロケールで切替可）
    -   `--format json` → `audience=ai, model=small`

### guides の提供方針

-   MD:
    -   `human-ja` / `human-en` を提供（読みやすさ優先、冗長OK）
-   JSON:
    -   `ai-small` を基本（最短手順＋必須チェック＋禁止事項）
    -   `ai-large` は判断基準・分岐を含む（copy/ref/hybrid選択など）

## 分割 Section（独立文書化）

-   コマンド名は後で確定（候補：`breakdown` / `split` / `sectionize`）
-   出力は Section ごとの独立 IdeaMark 文書（ファイル群）
-   モード：
    -   `copy`（デフォルト）：参照される entities/occurrences
        を同梱。IDは保持。
    -   `ref`：元文書参照を保持し同梱しない（参照解決が必要）。
    -   `hybrid`：ローカルはcopy、共有はref（判定ロジックは将来拡張）。

### 来歴の最低要件（v0.1.3で必須）

-   分割文書は `refs.derived_from`（元doc_id + 元section_id）を持つ
-   `DerivationOp: breakdown`
    相当の情報を記録する（場所は後で確定：header拡張 or refs内メタ）
-   元から持ってきた entity/occurrence はIDを維持（copyでも維持）
-   新規に作られたものは新ID

------------------------------------------------------------------------

---

# SEC-METRICS（投影ビュー）
```yaml
section_id: "SEC-METRICS"
anchorage:
  view: "observation_series"
  phase: "plan"
  domain: ["validation", "llm-test"]
```

## Section Summary
LLMプロンプトテストで測る指標（M1〜M4）と最低限の検証シナリオ（テンプレ）を保持する。

## Detailed Notes (verbatim from v0.0.6)
以下は情報損失を防ぐため、v0.0.6 の該当ブロックをそのまま保持する。

# Section 005 : Metrics（観測設計）

``` yaml
section_id: "SEC-METRICS"
anchorage:
  view: "observation_series"
  phase: "plan"
```

## LLMプロンプトテスト（先行）で測るもの

-   M1: 生成されたIdeaMark文書が working mode の必須条件を満たす率（YAML
    parse / ID一意 / 参照解決）
-   M2: strict mode 相当の欠落（header/anchorage vocab
    等）を自己修正できる率
-   M3: guides JSON を使ったときの "再試行回数" の減少
-   M4: 分割→精緻化→統合の往復で、情報落ち/混線が起きない率

### 最低限の検証シナリオ（テンプレ）

1)  入力文書を生成（長め：複数Section + Entities/Occurrences）
2)  分割（copy）して複数文書へ
3)  分割後の各文書を精緻化（追記・修正）
4)  統合して一つに戻す
5)  抽出（extract）でサマリや特定viewだけを得る
6)  合成（compose）で別ドキュメントと組み合わせる（将来）

------------------------------------------------------------------------

---

# SEC-DECISION（投影ビュー）
```yaml
section_id: "SEC-DECISION"
anchorage:
  view: "decision"
  phase: "confirmed"
  domain: ["governance", "decisions"]
```

## Section Summary
正式判断（D1〜D4）を確定ログとして保持する。

## Detailed Notes (verbatim from v0.0.6)
以下は情報損失を防ぐため、v0.0.6 の該当ブロックをそのまま保持する。

# Section 006 : Decision Log（正式判断）

``` yaml
section_id: "SEC-DECISION"
anchorage:
  view: "decision"
  phase: "confirmed"
```

-   D1: `describe`
    は直交I/F（audience/lang/model）を正規とし、profileはエイリアスとして併設する
-   D2:
    guidesは3層（Quickstart/Recipes/Reference）で、MDはJA/EN、人間向け冗長、JSONはAI向け最小とする
-   D3: 分割Sectionは独立文書化（案1）を採用し、copy/ref/hybrid
    を明示、デフォルトは copy
-   D4: 検証は LLMプロンプトテストを先行し、guides品質を上げた後に
    responder-bridge を適用する

------------------------------------------------------------------------

# Entities Registry

``` yaml
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

------------------------------------------------------------------------

---

# SEC-GUIDES-REDESIGN（投影ビュー）
```yaml
section_id: "SEC-GUIDES-REDESIGN"
anchorage:
  view: "analysis"
  phase: "exploration"
  domain: ["guides", "ai-authoring", "params"]
```

## Section Summary
v0.0.6 時点の guides課題と再設計方針、describe I/F再確認、次段タスクを保持する。

## Detailed Notes (verbatim from v0.0.6)
以下は情報損失を防ぐため、v0.0.6 の該当ブロックをそのまま保持する。

# Section 007 : Guides Gap Analysis & Redesign（v0.0.5 追加）

``` yaml
section_id: "SEC-GUIDES-REDESIGN"
anchorage:
  view: "analysis"
  phase: "exploration"
```

## 現状課題（ai-authoring / params ベース）

以下の点において「運任せ」になりやすい構造が確認された：

1.  手順が"説明中心"であり、**実行順序の強制力が弱い**
2.  working / strict
    モードの違いはあるが、**生成→検証→修正のループが明示的でない**
3.  ai-authoring と params の関係が「参照前提」で、 LLM
    が一度に把握すべき最小セットが明示されていない
4.  Section分割・統合などの操作が guides に統合されていないため、
    CLIの操作フローが一貫していない

------------------------------------------------------------------------

## v0.1.3 Guides 再設計方針

### 1. guides JSON（ai-small）の必須構造

-   version
-   goal
-   preconditions
-   steps\[\]
    -   command
    -   args
    -   required_checks\[\]
-   minimal_validation\[\]
-   forbidden_patterns\[\]
-   followup_topics\[\]

### 2. ai-small の原則

-   選択肢を減らす（copyをデフォルト明示）
-   strict相当チェックを簡潔に含める
-   必要なら describe params / ai-authoring を追加取得させる

### 3. ai-large の原則

-   copy/ref/hybrid の判断基準を含める
-   merge衝突ポリシーの選択肢を提示
-   将来diff/lintとの接続を示唆

### 4. MD（human向け）

-   JA/EN 両対応
-   Why（設計思想）を明示
-   手順＋背景＋判断基準を冗長に記述

------------------------------------------------------------------------

## describe I/F 再確認（固定仕様）

-   正規I/F：--audience / --lang / --model
-   profile はエイリアス
-   format=json のデフォルト：audience=ai, model=small
-   format=md のデフォルト：audience=human, lang=ja

------------------------------------------------------------------------

## 次段タスク（v0.0.5予定）

-   ai-small 用 guides JSON サンプル生成
-   Section分割コマンド仕様（I/O明文化）
-   LLMプロンプトテストスクリプト設計

------------------------------------------------------------------------

---

# SEC-GUIDES-AI-SMALL（投影ビュー）
```yaml
section_id: "SEC-GUIDES-AI-SMALL"
anchorage:
  view: "solution"
  phase: "design"
  domain: ["guides", "ai-small", "json-schema"]
```

## Section Summary
ai-small guides JSON の目的と最小スキーマ案、設計原則、strict拡張方針、次段を保持する。

## Detailed Notes (verbatim from v0.0.6)
以下は情報損失を防ぐため、v0.0.6 の該当ブロックをそのまま保持する。

# Section 008 : ai-small Guides JSON Concrete Spec（v0.0.5 追加）

``` yaml
section_id: "SEC-AI-SMALL-GUIDES"
anchorage:
  view: "solution"
  phase: "design"
```

## 目的

LLM（small想定）が最小トークンで安全に IdeaMark
文書を生成・分割・統合できるよう、 "迷わない最短成功パス" を JSON
で提供する。

本仕様は `describe guides --format json --audience ai --model small`
の出力を定義する。

------------------------------------------------------------------------

## JSON 最小スキーマ（確定案）

``` json
{
  "version": "0.1.3",
  "profile": "ai-small",
  "goal": "Generate and manipulate IdeaMark documents safely",
  "preconditions": [
    "Call `ideamark describe capabilities --format json` first",
    "Ensure working mode unless strict is explicitly required"
  ],
  "steps": [
    {
      "id": "STEP-1",
      "action": "generate_document",
      "command": "ideamark generate",
      "required_checks": [
        "YAML parseable",
        "Unique IDs within document",
        "Header exists"
      ]
    },
    {
      "id": "STEP-2",
      "action": "validate_document",
      "command": "ideamark validate",
      "required_checks": [
        "No duplicate entity IDs",
        "All occurrences reference existing entities"
      ]
    },
    {
      "id": "STEP-3",
      "action": "split_section",
      "command": "ideamark breakdown --mode copy",
      "required_checks": [
        "derived_from recorded",
        "Entity IDs preserved"
      ]
    }
  ],
  "minimal_validation": [
    "YAML parseable",
    "IDs unique",
    "References resolvable"
  ],
  "forbidden_patterns": [
    "Regenerating entire document when only section edit is required",
    "Changing entity IDs during copy-mode split"
  ],
  "followup_topics": [
    "describe params",
    "describe ai-authoring"
  ]
}
```

------------------------------------------------------------------------

## 設計原則

1.  選択肢を極小化（copyを明示デフォルト）
2.  実行順序を固定（generate → validate → breakdown）
3.  修正ループを短縮するため、required_checks を明示
4.  詳細仕様は followup_topics で取得させる（トークン節約）

------------------------------------------------------------------------

## strict モードへの拡張（将来）

ai-small では strict を直接扱わず、 必要時のみ `describe params`
を追加取得させる。

------------------------------------------------------------------------

## 次段（v0.0.5）

-   ai-large JSON 仕様策定
-   breakdown コマンド正式I/O仕様化
-   プロンプトテストシナリオ具体化

------------------------------------------------------------------------

---

# SEC-GUIDES-PROFILES（投影ビュー）
```yaml
section_id: "SEC-GUIDES-PROFILES"
anchorage:
  view: "decision"
  phase: "design"
  domain: ["guides", "profiles", "ai-large", "termination"]
```

## Section Summary
ai-small固定手順/ai-largeフレームワークの二系統、ai-large最小スキーマ案、出し分け規約（直交I/Fとprofile alias）、割り切りポイント、次段を保持する。

## Detailed Notes (verbatim from v0.0.6)
以下は情報損失を防ぐため、v0.0.6 の該当ブロックをそのまま保持する。

# Section 009 : Guides Profiles Strategy（ai-small固定手順 / ai-largeフレームワーク）（v0.0.5 追加）

``` yaml
section_id: "SEC-GUIDES-PROFILES"
anchorage:
  view: "decision"
  phase: "design"
```

## 目的

`describe guides` は
**利用者の許容量（判断の余地）**に応じて、次の2系統を提供する。

-   **ai-small / human-easy**：安全な固定的最小手順（レシピ）
-   **ai-large /
    human-advanced**：柔軟なフレームワーク（判断点＋終了条件）

これにより、small LLM・初心者は迷走せずに成果を得られ、large
LLM・上級者は状況に応じた最適化ができる。

------------------------------------------------------------------------

## 基本方針（確定）

### 1) ai-small（固定レシピ）

-   「最短成功パス」を提示する
-   分岐を避ける（原則 copy / 既定値を強制）
-   "必須チェック" と "禁止事項" をセットで提示
-   目的は **失敗を減らす**（最適化ではない）

### 2) ai-large（フレームワーク）

-   手順の"順番"よりも、**意思決定のポイント**と**終了条件**を明示する
-   分岐（copy/ref/hybrid、merge方針、strict適用）を「判断基準」として提示
-   目的は **適応性を上げる**（状況最適）

------------------------------------------------------------------------

## ai-large Guides JSON（最小スキーマ案）

ai-large は「ステップ列」ではなく、**Framework + Decision Points + Exit
Criteria** を中心にする。

``` json
{
  "version": "0.1.3",
  "profile": "ai-large",
  "framework": {
    "phases": [
      {
        "id": "PHASE-PLAN",
        "intent": "Clarify goal, constraints, and target shape",
        "exit_criteria": [
          "Goal statement is explicit",
          "Target outputs and audiences identified",
          "Constraints declared (strict/working, token budget, time)"
        ]
      },
      {
        "id": "PHASE-AUTHOR",
        "intent": "Generate or refine IdeaMark sections incrementally",
        "exit_criteria": [
          "New/changed content is localized to relevant sections",
          "Entity/Occurrence references remain consistent",
          "Evidence/Anchorage updated where relevant"
        ]
      },
      {
        "id": "PHASE-VALIDATE",
        "intent": "Validate structure and fix violations",
        "exit_criteria": [
          "YAML parseable",
          "IDs unique within doc",
          "All references resolvable"
        ]
      },
      {
        "id": "PHASE-TRANSFORM",
        "intent": "Split/merge/extract/compose as needed",
        "exit_criteria": [
          "Derived-from lineage recorded for transformed outputs",
          "No information loss in round-trip tests (split→merge)"
        ]
      }
    ]
  },
  "decision_points": [
    {
      "id": "DP-SPLIT-MODE",
      "question": "How to carry Entities/Occurrences when splitting sections?",
      "options": [
        {"value": "copy", "when": ["Need self-contained subdocs", "LLM-small or easy workflow"], "risks": ["Duplication"]},
        {"value": "ref", "when": ["Central registry exists", "Large-scale corpus management"], "risks": ["Requires ref resolution"]},
        {"value": "hybrid", "when": ["Mixed reuse and locality", "You can classify shared vs local"], "risks": ["Classification complexity"]}
      ],
      "default": "copy"
    },
    {
      "id": "DP-STRICTNESS",
      "question": "Should strict mode constraints be enforced now?",
      "options": [
        {"value": "working", "when": ["Exploration", "Early drafting"], "risks": ["Missing required fields later"]},
        {"value": "strict", "when": ["Release candidate", "Automation pipeline"], "risks": ["More fix cycles now"]}
      ],
      "default": "working"
    },
    {
      "id": "DP-MERGE-POLICY",
      "question": "How to handle conflicts during merge?",
      "options": [
        {"value": "keep_both", "when": ["Avoid losing information", "Early synthesis"], "risks": ["Later cleanup required"]},
        {"value": "prefer_primary", "when": ["Need a single canonical story"], "risks": ["Information loss risk unless tracked"]},
        {"value": "annotate_conflict", "when": ["Need auditability"], "risks": ["More metadata, complexity"]}
      ],
      "default": "keep_both"
    }
  ],
  "termination": {
    "done_definition": [
      "Requested output(s) produced",
      "Validation passes at chosen strictness",
      "If transformed: lineage recorded and round-trip sanity check performed"
    ],
    "stop_conditions": [
      "No further improvement under current constraints",
      "Iteration budget exceeded → produce best-effort output + remaining risks"
    ]
  },
  "followup_topics": ["describe params", "describe ai-authoring", "describe vocab"]
}
```

------------------------------------------------------------------------

## `describe guides` の出し分け規約（実装しやすさ優先）

### 正規I/F（直交）

-   `--audience human|ai`
-   `--lang ja|en`（humanのみ必須、aiは任意）
-   `--model small|large`（aiのみ有効）

### エイリアス（profile）

-   `--profile ai-small` → `--audience ai --model small`
-   `--profile ai-large` → `--audience ai --model large`
-   `--profile human-ja-easy` → `--audience human --lang ja`（easy版）
-   `--profile human-ja-advanced` →
    `--audience human --lang ja`（advanced版）
-   `--profile human-en-easy` / `human-en-advanced` 同様

------------------------------------------------------------------------

## 仕様としての"割り切りポイント"（明文化）

-   ai-small は
    **「固定手順＋必須チェック＋禁止事項」**以上の柔軟性を持たせない
-   ai-large は
    **「判断点＋終了条件」**を中心にし、コマンド列の固定はしない
    -   ただし *例示* として "代表的なコマンド列"
        は添付してよい（非拘束）

------------------------------------------------------------------------

## 次段（v0.0.5予定）

-   ai-small JSON の Step
    設計を「transform系（split/merge/extract/compose）」へ拡張（必要最小）
-   human-easy / human-advanced の MD アウトライン（JA/EN）を確定
-   capabilities に `describe`
    の追加オプションとプロファイル表を反映する仕様化

------------------------------------------------------------------------

---

# SEC-ABSTRACT-ACTIONS_RECIPES（投影ビュー）
```yaml
section_id: "SEC-ABSTRACT-ACTIONS_RECIPES"
anchorage:
  view: "solution"
  phase: "design"
  domain: ["abstract-actions", "recipes", "mapping"]
```

## Section Summary
抽象アクション語彙、具体コマンドへの暫定マッピング、Case Recipes、ai-small recipes対応スキーマ案、割り切り、次段を保持する。

## Detailed Notes (verbatim from v0.0.6)
以下は情報損失を防ぐため、v0.0.6 の該当ブロックをそのまま保持する。

# Section 010 : Scenario-based Steps & Abstract Actions（ケース分け手順と抽象アクション）（v0.0.5 追加）

``` yaml
section_id: "SEC-SCENARIO-ACTIONS"
anchorage:
  view: "solution"
  phase: "design"
```

## 背景（設計意図）

`ideamark describe` は「LLMが IdeaMark に沿った生成・編集を行うための
*指示プロンプト素材* を取りに行く」ための仕組みであり、\
実際に
*何をするか*（PDF変換、議論ログ変換、追記、拡張、要約...）は、上位のプロンプト（ユーザーや外部ツールが与える）で決まる。

したがって guides（特に
ai-small）は単一の固定手順ではなく、**場面（use-case）に応じた最小安全手順**を出し分ける必要がある。

------------------------------------------------------------------------

## 用語：Abstract Actions（抽象アクション）

ここでいう「抽象コマンド／戦略コマンド」は、CLIの具体コマンド名に依存しない
**意味レベルの操作**である。

-   例）`convert_material_to_sections`, `breakdown_until_fit`,
    `local_refine`, `compose_sections`, `summarize_sections`,
    `inject_new_issue`

guides
JSON（ai-small/ai-large）は、まず抽象アクション列を提示し、可能なら対応する具体コマンド（ideamark
CLI）へマッピングを添える。

------------------------------------------------------------------------

## 抽象アクションの最小語彙（v0.1.3対象）

### Ingest / Transform（入力変換）

-   `ingest.material` :
    Materialを読み取り可能なストリーム/チャンクへ正規化する（PDF/ログ/テキスト）
-   `interpret.chunk` : 1チャンクから
    IdeaMarkの部品（Entity/Occurrence/Section）を作る
-   `append.section` :
    既存ドキュメントに新Section/Occurrence/Entityを追加する
-   `expand.section` : 既存Sectionをより詳細化する（局所編集）
-   `summarize.section` : 既存Sectionを要約する（局所編集）

### Structure Operations（構造操作）

-   `validate.minimal` : YAML parse / ID一意 / 参照整合など最小検証
-   `breakdown.until_fit` : 扱えるサイズまで分割（デフォルトcopy）
-   `compose.bundle` : 部品（複数doc/section）を合成して1文書へ
-   `extract.view` : view/anchorage等で取り出し（案2相当の抽出）

------------------------------------------------------------------------

## 具体コマンドへのマッピング（暫定）

> ※ v0.1.3
> のコマンドセットに依存するため「暫定」とし、後続セクションで正式化する。\
> ただし guides はこのマッピングを *参照情報* として含めてよい。

  ---------------------------------------------------------------------------------
  Abstract Action                     Example CLI Mapping (暫定)
  ----------------------------------- ---------------------------------------------
  ingest.material                     (外部) 取り込み / もしくは `ideamark` の
                                      material サブコマンド（将来）

  interpret.chunk                     `ideamark generate`（テンプレ＋指示で生成）
                                      or `ideamark import`（将来）

  validate.minimal                    `ideamark validate`

  breakdown.until_fit                 `ideamark breakdown --mode copy`（候補名）

  compose.bundle                      `ideamark compose`

  extract.view                        `ideamark extract`

  expand.section / append.section /   `ideamark generate`（部分編集プロンプト）＋
  summarize.section                   `validate`（現状）
  ---------------------------------------------------------------------------------

------------------------------------------------------------------------

## Case Recipes（ai-small の"場合分け"をデータとして提供）

ai-small guides JSON は `recipes[]`
を持ち、上位プロンプト（use-case）に応じて選べるようにする。

### 代表ケース（現時点）

1)  **material.pdf_to_ideamark**

-   入力：PDF論文（大きい可能性）
-   出力：指定テンプレートに沿ったIdeaMark文書
-   戦略：stream/chunk → interpret → compose → validate

2)  **material.log_to_ideamark**

-   入力：議論ログ（人/AI）
-   出力：指定テンプレートに沿ったIdeaMark文書
-   戦略：時系列chunk → section生成 → compose → validate

3)  **ideamark.inject_new_issues**

-   入力：既存IdeaMark + 追加テキストMaterial
-   出力：新論点を追加したIdeaMark
-   戦略：relevant_section抽出 → append.section → validate →
    compose（必要なら）

4)  **ideamark.expand_detail**

-   入力：既存IdeaMark
-   出力：より細かい記述に拡張したIdeaMark
-   戦略：breakdown.until_fit → expand.section（局所）→ compose →
    validate

5)  **ideamark.summarize**

-   入力：既存IdeaMark
-   出力：サマリIdeaMark（またはextract結果）
-   戦略：extract.view or summarize.section（局所）→ validate

------------------------------------------------------------------------

## ai-small guides JSON（改訂スキーマ案：recipes対応）

``` json
{
  "version": "0.1.3",
  "profile": "ai-small",
  "selection": {
    "how_to_choose_recipe": [
      "If input is PDF or long material -> choose material.* recipes",
      "If input is IdeaMark + extra text -> choose ideamark.inject_new_issues",
      "If goal is detail expansion -> choose ideamark.expand_detail",
      "If goal is summary -> choose ideamark.summarize"
    ],
    "default_recipe": "ideamark.expand_detail"
  },
  "recipes": [
    {
      "id": "material.pdf_to_ideamark",
      "goal": "Convert a PDF paper into an IdeaMark document using a template",
      "steps": [
        {"action": "ingest.material", "notes": "Convert PDF into ordered chunks (pages/sections)"},
        {"action": "breakdown.until_fit", "defaults": {"mode": "copy"}, "notes": "Use when a chunk is still too large"},
        {"action": "interpret.chunk", "notes": "Create Entities/Occurrences/Section for each chunk"},
        {"action": "compose.bundle", "notes": "Compose chunk-docs into one doc; order by anchorage + original order"},
        {"action": "validate.minimal"}
      ],
      "required_checks": ["YAML parseable", "IDs unique", "Refs resolvable", "Template-required sections exist"]
    },
    {
      "id": "ideamark.expand_detail",
      "goal": "Expand an existing IdeaMark document with more detailed descriptions safely",
      "steps": [
        {"action": "breakdown.until_fit", "defaults": {"mode": "copy"}},
        {"action": "expand.section", "notes": "Edit one section at a time; keep IDs"},
        {"action": "validate.minimal"},
        {"action": "compose.bundle"},
        {"action": "validate.minimal"}
      ],
      "forbidden_patterns": [
        "Regenerate the whole doc when only a local section needs change",
        "Change IDs during copy-mode split"
      ]
    }
  ],
  "minimal_validation": ["YAML parseable", "IDs unique", "References resolvable"],
  "followup_topics": ["describe params", "describe ai-authoring", "describe vocab"]
}
```

------------------------------------------------------------------------

## 割り切り（ai-smallの狙いと限界）

-   ai-small は **戦略＝分割生成＋局所編集＋再合成**
    を固定し、広い文脈理解を求めない
-   "場面"の判定は上位プロンプトが持つ想定だが、guides側にも最低限の
    `how_to_choose_recipe` を置く
-   これにより、巨大Materialでも
    **ストリーム化→チャンク解釈→Section生成→compose** で扱える

------------------------------------------------------------------------

## 次段（v0.0.6予定）

-   recipes の標準セットを v0.1.3
    のコマンド仕様（breakdown/compose/extract）に合わせて確定
-   material ingest の取り回し（ファイル形式→ストリーム化）を guides
    にどう表現するか（CLI内包か外部手順か）を決定
-   capabilities に recipes と abstract actions
    の一覧を露出させる（LLM自走のため）

------------------------------------------------------------------------

---

# SEC-CAPABILITIES-RECIPES（投影ビュー）
```yaml
section_id: "SEC-CAPABILITIES-RECIPES"
anchorage:
  view: "solution"
  phase: "design"
  domain: ["capabilities", "recipes", "self-driving"]
```

## Section Summary
capabilitiesへの露出方針（index＋選び方＋next_step）、guidesの二段階取得、設計原則、期待シーケンス、後方互換性を保持する。

## Detailed Notes (verbatim from v0.0.6)
以下は情報損失を防ぐため、v0.0.6 の該当ブロックをそのまま保持する。

# Section 011 : Capabilities & Recipes Exposure Model（v0.0.6 追加）

``` yaml
section_id: "SEC-CAPABILITIES-RECIPES"
anchorage:
  view: "solution"
  phase: "design"
```

## 目的

LLM が

1.  describe capabilities を取得
2.  適切な recipe を選択
3.  describe guides（index → detail）を取得
4.  実行フェーズへ入る

という **自己誘導フロー** を安定させる。

------------------------------------------------------------------------

## 1. describe capabilities --format json の必須構造（確定）

capabilities には "詳細レシピ本文" を含めない。 含めるのは以下のみ：

-   abstract_actions\[\]（語彙一覧）
-   recipes_index\[\]（軽量インデックス）
-   recipe_selection（選び方ガイド）
-   next_step（次に呼ぶdescribeコマンド）

### 例（最小形）

``` json
{
  "tool": "ideamark",
  "version": "0.1.3",
  "abstract_actions": [
    {"id": "validate.minimal", "summary": "YAML parse / IDs unique / refs resolvable", "supported": true},
    {"id": "breakdown.until_fit", "summary": "Split until manageable size (default copy)", "supported": "partial"},
    {"id": "compose.bundle", "summary": "Compose multiple docs/sections into one", "supported": true}
  ],
  "recipes_index": [
    {"id": "material.pdf_to_ideamark", "goal": "Convert PDF into IdeaMark", "tags": ["material", "pdf", "ingest", "compose"]},
    {"id": "ideamark.expand_detail", "goal": "Expand sections safely", "tags": ["ideamark", "breakdown", "local_edit", "compose"]}
  ],
  "recipe_selection": {
    "how_to_choose": [
      "If input is PDF/long material -> choose material.*",
      "If goal is detail expansion -> ideamark.expand_detail",
      "If goal is summary -> ideamark.summarize"
    ],
    "default": "ideamark.expand_detail"
  },
  "next_step": "Run: ideamark describe guides --format json --audience ai --model small (optionally add --recipe <id>)"
}
```

------------------------------------------------------------------------

## 2. describe guides の二段階取得（確定）

### 2.1 Index Mode（軽量）

    ideamark describe guides --format json --audience ai --model small

返却内容：

-   recipes（軽量）
-   selectionガイド
-   minimal_validation

トークン最適化のため、詳細stepsは含めない。

------------------------------------------------------------------------

### 2.2 Recipe Detail Mode（重量）

    ideamark describe guides --format json --audience ai --model small --recipe <id>

返却内容：

-   steps\[\]
-   required_checks\[\]
-   forbidden_patterns\[\]
-   decision_points（必要時）

------------------------------------------------------------------------

## 3. 設計原則（v0.0.6で確定）

1.  capabilities は「一覧＋選び方」だけを出す
2.  guides は「index → detail」の2段階
3.  recipe_id は安定IDとする（namespace.verb_object形式）
4.  abstract_actions は語彙であり、実装詳細は含めない
5.  LLM自走を最優先に設計する（決定的 next_step を含める）

------------------------------------------------------------------------

## 4. 期待される自走シーケンス（規範）

1)  describe capabilities
2)  recipe_id 選択
3)  describe guides（index）
4)  describe guides --recipe `<id>`{=html}
5)  抽象アクション列に従い実行
6)  required_checks を満たすまで validate ループ

------------------------------------------------------------------------

## 5. 後方互換性

-   v0.0.5 の guides 構造は保持
-   recipes の index/detail 分離を v0.0.6 から正式採用

------------------------------------------------------------------------

End of v0.0.6

---

# SEC-INBOX（投影ビュー）
```yaml
section_id: "SEC-INBOX"
anchorage:
  view: "analysis"
  phase: "plan"
  domain: ["inbox"]
```

## Section Summary
ルーティング不確実な断片を一時保管する。ここに溜まった Occurrence は merge cadence に従い、適切な Section へ移動・統合する。

---

# Entities Registry（canonical / v0.0.9）
```yaml
entities:
  # Intent / Scope
  IE-INTENT:
    kind: "decision_package"
    content: "IdeaMark-CLI v0.1.3 で guides改修と分割Sectionを先に完成させ、LLM運用で安定した生成/分割/精緻化/統合を検証できる状態にする"
    atomic_state: false

  IE-SCOPE-NOT-INCLUDED:
    kind: "constraint"
    content: "v0.1.3では diff/lint のフル実装と IDE/UI統合（responder-bridge適用）は範囲外"

  # Hypotheses
  IE-H1:
    kind: "hypothesis"
    content: "describe guides --format json を低トークンで提供しても、必須チェックと手順を保持すれば、LLM の validation→修正ループが減る"
  IE-H2:
    kind: "hypothesis"
    content: "describe のオプションは直交設計（audience/lang/model）を正規I/Fにし、profileはエイリアスにすることで、LLMがcapabilitiesから正確に呼び出せる"
  IE-H3:
    kind: "hypothesis"
    content: "Section→独立文書化で derived_from 等の来歴を保持し、IDを維持してcopyするデフォルトにすると、統合時の衝突が扱いやすい"

  # Describe I/F (orthogonal + defaults)
  IE-DESCRIBE-ORTHOGONAL-IF:
    kind: "design"
    content: "describe は --audience/--lang/--model の直交I/Fを正規とし、--profile はショートカット（内部で展開）"
  IE-DESCRIBE-DEFAULTS:
    kind: "policy"
    content: "format=mdの既定：audience=human, lang=ja。format=jsonの既定：audience=ai, model=small"
  IE-DESCRIBE-MODEL-RULE:
    kind: "policy"
    content: "--model は --audience ai のときのみ有効（それ以外は無視またはエラー：実装方針は別途確定）"

  # Guides content strategy
  IE-GUIDES-MD-STRATEGY:
    kind: "design"
    content: "MDは human-ja / human-en を提供し、読みやすさ優先で冗長OK"
  IE-GUIDES-AI-SMALL-PRINCIPLES:
    kind: "design"
    content: "ai-small は最短成功パス（固定レシピ）＋必須チェック＋禁止事項。分岐を避け、copyをデフォルト明示"
  IE-GUIDES-AI-LARGE-PRINCIPLES:
    kind: "design"
    content: "ai-large は Framework + Decision Points + Exit Criteria を中心。分岐（copy/ref/hybrid、merge方針、strict適用）を判断基準として提示"
  IE-GUIDES-FOLLOWUP-TOPICS:
    kind: "design"
    content: "必要時に describe params / describe ai-authoring / describe vocab を追加取得させる（トークン節約）"

  # ai-small JSON schema (minimal)
  IE-AI-SMALL-JSON-SCHEMA:
    kind: "schema"
    content: "ai-small guides JSON 最小スキーマ（version/goal/preconditions/steps/minimal_validation/forbidden_patterns/followup_topics）"
  IE-AI-SMALL-STEP-ORDER:
    kind: "policy"
    content: "ai-small は generate → validate → breakdown（transform） の順序を固定し、修正ループを短縮する"
  IE-AI-SMALL-STRICT-EXT:
    kind: "policy"
    content: "ai-small は strict を直接扱わず、必要時のみ describe params を追加取得させる"

  # ai-large JSON framework schema
  IE-AI-LARGE-FRAMEWORK:
    kind: "schema"
    content: "ai-large guides JSON は phases（plan/author/validate/transform）＋decision_points＋termination を持つ"
  IE-AI-LARGE-DP-SPLIT-MODE:
    kind: "decision_point"
    content: "split時の Entities/Occurrences 運搬方法（copy/ref/hybrid）を判断基準＋既定copyで提示"
  IE-AI-LARGE-DP-STRICTNESS:
    kind: "decision_point"
    content: "strict vs working の適用タイミングを判断基準＋既定workingで提示"
  IE-AI-LARGE-DP-MERGE-POLICY:
    kind: "decision_point"
    content: "merge時の衝突処理（keep_both/prefer_primary/annotate_conflict）を判断基準＋既定keep_bothで提示"

  # Breakdown (section -> independent documents)
  IE-BREAKDOWN-MODES:
    kind: "design"
    content: "分割Sectionは独立文書化。modeは copy/ref/hybrid。デフォルトは copy"
  IE-BREAKDOWN-LINEAGE-MIN:
    kind: "policy"
    content: "分割文書は refs.derived_from（元doc_id + 元section_id）を持ち、DerivationOp: breakdown 相当を記録する"
  IE-BREAKDOWN-ID-PRESERVE:
    kind: "policy"
    content: "copyでも元から持ってきた entity/occurrence はIDを維持。新規生成は新ID"

  # Metrics
  IE-METRICS-M1:
    kind: "metric"
    content: "working mode 必須条件（YAML parse / ID一意 / 参照解決）を満たす率"
    measure_type: "quality"
  IE-METRICS-M2:
    kind: "metric"
    content: "strict mode 相当の欠落を自己修正できる率"
    measure_type: "quality"
  IE-METRICS-M3:
    kind: "metric"
    content: "guides JSON 使用時の再試行回数の減少"
    measure_type: "efficiency"
  IE-METRICS-M4:
    kind: "metric"
    content: "分割→精緻化→統合の往復で情報落ち/混線が起きない率"
    measure_type: "quality"

  IE-VALIDATION-SCENARIO-TEMPLATE:
    kind: "test_plan"
    content: "生成→分割(copy)→精緻化→統合→抽出→合成 の最低限検証シナリオ"

  # Abstract Actions vocab
  IE-ABSTRACT-ACTIONS-VOCAB:
    kind: "vocab"
    content: "抽象アクション（意味レベル操作）の最小語彙：ingest.material / interpret.chunk / append.section / expand.section / summarize.section / validate.minimal / breakdown.until_fit / compose.bundle / extract.view"
  IE-ABSTRACT-ACTIONS-MAPPING-TENTATIVE:
    kind: "mapping"
    content: "抽象アクション→具体コマンドの暫定マッピング（validate=ideamark validate、breakdown候補名、compose、extract等）"

  # Recipes
  IE-RECIPES-SET:
    kind: "design"
    content: "ai-small guides は recipes[] を持ち、use-caseに応じた最小安全手順をデータとして提供する"
  IE-RECIPE-PDF-TO-IDEAMARK:
    kind: "recipe"
    content: "material.pdf_to_ideamark：stream/chunk→interpret→compose→validate"
  IE-RECIPE-LOG-TO-IDEAMARK:
    kind: "recipe"
    content: "material.log_to_ideamark：時系列chunk→section生成→compose→validate"
  IE-RECIPE-INJECT-NEW-ISSUES:
    kind: "recipe"
    content: "ideamark.inject_new_issues：relevant_section抽出→append.section→validate→compose（必要なら）"
  IE-RECIPE-EXPAND-DETAIL:
    kind: "recipe"
    content: "ideamark.expand_detail：breakdown.until_fit→expand.section→compose→validate"
  IE-RECIPE-SUMMARIZE:
    kind: "recipe"
    content: "ideamark.summarize：extract.view or summarize.section→validate"

  IE-RECIPES-SELECTION-GUIDE:
    kind: "policy"
    content: "how_to_choose_recipe と default_recipe（既定 ideamark.expand_detail）を guides側にも最低限持たせる"

  # Capabilities exposure model
  IE-CAPABILITIES-INDEX-ONLY:
    kind: "design"
    content: "describe capabilities は詳細レシピ本文を含めず、abstract_actions/recipes_index/recipe_selection/next_step のみ露出する"
  IE-GUIDES-TWO-STAGE-RETRIEVAL:
    kind: "design"
    content: "describe guides は index（軽量）と --recipe 指定の detail（重量）の二段階取得とする"
  IE-RECIPE-ID-STABILITY:
    kind: "policy"
    content: "recipe_id は安定ID（namespace.verb_object形式）とする"
  IE-CAPABILITIES-NEXT-STEP-NORM:
    kind: "policy"
    content: "capabilities には次に呼ぶdescribeコマンド（next_step）を決定的に含める"
  IE-COMPATIBILITY-V005:
    kind: "policy"
    content: "v0.0.5 の guides 構造は保持しつつ、index/detail 分離を v0.0.6 から正式採用"

occurrences:
  OCC-INTENT:
    entity: "IE-INTENT"
    role: "problem_core"
    status:
      state: "confirmed"

  OCC-SCOPE-NOT-INCLUDED:
    entity: "IE-SCOPE-NOT-INCLUDED"
    role: "constraint"
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

  OCC-DESCRIBE-ORTHO-IF:
    entity: "IE-DESCRIBE-ORTHOGONAL-IF"
    role: "solution"
    status:
      state: "confirmed"
  OCC-DESCRIBE-DEFAULTS:
    entity: "IE-DESCRIBE-DEFAULTS"
    role: "policy"
    status:
      state: "confirmed"
  OCC-DESCRIBE-MODEL-RULE:
    entity: "IE-DESCRIBE-MODEL-RULE"
    role: "policy"
    status:
      state: "provisional"

  OCC-GUIDES-MD-STRATEGY:
    entity: "IE-GUIDES-MD-STRATEGY"
    role: "solution"
    status:
      state: "confirmed"
  OCC-GUIDES-AI-SMALL-PRINCIPLES:
    entity: "IE-GUIDES-AI-SMALL-PRINCIPLES"
    role: "solution"
    status:
      state: "confirmed"
  OCC-GUIDES-AI-LARGE-PRINCIPLES:
    entity: "IE-GUIDES-AI-LARGE-PRINCIPLES"
    role: "solution"
    status:
      state: "confirmed"
  OCC-GUIDES-FOLLOWUP:
    entity: "IE-GUIDES-FOLLOWUP-TOPICS"
    role: "solution"
    status:
      state: "confirmed"

  OCC-AI-SMALL-JSON-SCHEMA:
    entity: "IE-AI-SMALL-JSON-SCHEMA"
    role: "solution"
    status:
      state: "confirmed"
  OCC-AI-SMALL-STEP-ORDER:
    entity: "IE-AI-SMALL-STEP-ORDER"
    role: "policy"
    status:
      state: "confirmed"
  OCC-AI-SMALL-STRICT-EXT:
    entity: "IE-AI-SMALL-STRICT-EXT"
    role: "policy"
    status:
      state: "provisional"

  OCC-AI-LARGE-FRAMEWORK:
    entity: "IE-AI-LARGE-FRAMEWORK"
    role: "solution"
    status:
      state: "confirmed"
  OCC-AI-LARGE-DP-SPLIT-MODE:
    entity: "IE-AI-LARGE-DP-SPLIT-MODE"
    role: "decision_point"
    status:
      state: "confirmed"
  OCC-AI-LARGE-DP-STRICTNESS:
    entity: "IE-AI-LARGE-DP-STRICTNESS"
    role: "decision_point"
    status:
      state: "confirmed"
  OCC-AI-LARGE-DP-MERGE-POLICY:
    entity: "IE-AI-LARGE-DP-MERGE-POLICY"
    role: "decision_point"
    status:
      state: "confirmed"

  OCC-BREAKDOWN-MODES:
    entity: "IE-BREAKDOWN-MODES"
    role: "solution"
    status:
      state: "confirmed"
  OCC-BREAKDOWN-LINEAGE-MIN:
    entity: "IE-BREAKDOWN-LINEAGE-MIN"
    role: "policy"
    status:
      state: "confirmed"
  OCC-BREAKDOWN-ID-PRESERVE:
    entity: "IE-BREAKDOWN-ID-PRESERVE"
    role: "policy"
    status:
      state: "confirmed"

  OCC-METRICS-M1:
    entity: "IE-METRICS-M1"
    role: "measures"
    status:
      state: "confirmed"
  OCC-METRICS-M2:
    entity: "IE-METRICS-M2"
    role: "measures"
    status:
      state: "confirmed"
  OCC-METRICS-M3:
    entity: "IE-METRICS-M3"
    role: "measures"
    status:
      state: "confirmed"
  OCC-METRICS-M4:
    entity: "IE-METRICS-M4"
    role: "measures"
    status:
      state: "confirmed"

  OCC-VALIDATION-SCENARIO:
    entity: "IE-VALIDATION-SCENARIO-TEMPLATE"
    role: "test_plan"
    status:
      state: "confirmed"

  OCC-ABSTRACT-ACTIONS-VOCAB:
    entity: "IE-ABSTRACT-ACTIONS-VOCAB"
    role: "vocab"
    status:
      state: "confirmed"
  OCC-ABSTRACT-ACTIONS-MAPPING:
    entity: "IE-ABSTRACT-ACTIONS-MAPPING-TENTATIVE"
    role: "mapping"
    status:
      state: "provisional"

  OCC-RECIPES-SET:
    entity: "IE-RECIPES-SET"
    role: "solution"
    status:
      state: "confirmed"
  OCC-RECIPE-PDF:
    entity: "IE-RECIPE-PDF-TO-IDEAMARK"
    role: "recipe"
    status:
      state: "provisional"
  OCC-RECIPE-LOG:
    entity: "IE-RECIPE-LOG-TO-IDEAMARK"
    role: "recipe"
    status:
      state: "provisional"
  OCC-RECIPE-INJECT:
    entity: "IE-RECIPE-INJECT-NEW-ISSUES"
    role: "recipe"
    status:
      state: "provisional"
  OCC-RECIPE-EXPAND:
    entity: "IE-RECIPE-EXPAND-DETAIL"
    role: "recipe"
    status:
      state: "confirmed"
  OCC-RECIPE-SUMMARIZE:
    entity: "IE-RECIPE-SUMMARIZE"
    role: "recipe"
    status:
      state: "provisional"
  OCC-RECIPES-SELECTION:
    entity: "IE-RECIPES-SELECTION-GUIDE"
    role: "policy"
    status:
      state: "confirmed"

  OCC-CAPABILITIES-INDEX-ONLY:
    entity: "IE-CAPABILITIES-INDEX-ONLY"
    role: "solution"
    status:
      state: "confirmed"
  OCC-GUIDES-TWO-STAGE:
    entity: "IE-GUIDES-TWO-STAGE-RETRIEVAL"
    role: "solution"
    status:
      state: "confirmed"
  OCC-RECIPE-ID-STABILITY:
    entity: "IE-RECIPE-ID-STABILITY"
    role: "policy"
    status:
      state: "confirmed"
  OCC-CAPABILITIES-NEXT-STEP:
    entity: "IE-CAPABILITIES-NEXT-STEP-NORM"
    role: "policy"
    status:
      state: "confirmed"
  OCC-COMPATIBILITY-V005:
    entity: "IE-COMPATIBILITY-V005"
    role: "policy"
    status:
      state: "confirmed"

sections:
  SEC-ROUTING:
    anchorage: {view: "decision", phase: "design"}
    occurrences: []

  SEC-INTENT:
    anchorage: {view: "decision", phase: "plan"}
    occurrences: ["OCC-INTENT", "OCC-SCOPE-NOT-INCLUDED"]

  SEC-HYPOTHESIS:
    anchorage: {view: "problem", phase: "hypothesis"}
    occurrences: ["OCC-H1", "OCC-H2", "OCC-H3"]

  SEC-OPTIONS:
    anchorage: {view: "comparison", phase: "exploration"}
    occurrences: []

  SEC-DESIGN-DESCRIBE_BREAKDOWN:
    anchorage: {view: "solution", phase: "plan"}
    occurrences: ["OCC-DESCRIBE-ORTHO-IF", "OCC-DESCRIBE-DEFAULTS", "OCC-DESCRIBE-MODEL-RULE", "OCC-BREAKDOWN-MODES", "OCC-BREAKDOWN-LINEAGE-MIN", "OCC-BREAKDOWN-ID-PRESERVE"]

  SEC-GUIDES-REDESIGN:
    anchorage: {view: "analysis", phase: "exploration"}
    occurrences: ["OCC-GUIDES-MD-STRATEGY", "OCC-GUIDES-AI-SMALL-PRINCIPLES", "OCC-GUIDES-AI-LARGE-PRINCIPLES", "OCC-GUIDES-FOLLOWUP"]

  SEC-GUIDES-AI-SMALL:
    anchorage: {view: "solution", phase: "design"}
    occurrences: ["OCC-AI-SMALL-JSON-SCHEMA", "OCC-AI-SMALL-STEP-ORDER", "OCC-AI-SMALL-STRICT-EXT"]

  SEC-GUIDES-PROFILES:
    anchorage: {view: "decision", phase: "design"}
    occurrences: ["OCC-AI-LARGE-FRAMEWORK", "OCC-AI-LARGE-DP-SPLIT-MODE", "OCC-AI-LARGE-DP-STRICTNESS", "OCC-AI-LARGE-DP-MERGE-POLICY"]

  SEC-ABSTRACT-ACTIONS_RECIPES:
    anchorage: {view: "solution", phase: "design"}
    occurrences: ["OCC-ABSTRACT-ACTIONS-VOCAB", "OCC-ABSTRACT-ACTIONS-MAPPING", "OCC-RECIPES-SET", "OCC-RECIPES-SELECTION", "OCC-RECIPE-PDF", "OCC-RECIPE-LOG", "OCC-RECIPE-INJECT", "OCC-RECIPE-EXPAND", "OCC-RECIPE-SUMMARIZE"]

  SEC-CAPABILITIES-RECIPES:
    anchorage: {view: "solution", phase: "design"}
    occurrences: ["OCC-CAPABILITIES-INDEX-ONLY", "OCC-GUIDES-TWO-STAGE", "OCC-RECIPE-ID-STABILITY", "OCC-CAPABILITIES-NEXT-STEP", "OCC-COMPATIBILITY-V005"]

  SEC-METRICS:
    anchorage: {view: "observation_series", phase: "plan"}
    occurrences: ["OCC-METRICS-M1", "OCC-METRICS-M2", "OCC-METRICS-M3", "OCC-METRICS-M4", "OCC-VALIDATION-SCENARIO"]

  SEC-DECISION:
    anchorage: {view: "decision", phase: "confirmed"}
    occurrences: []

  SEC-INBOX:
    anchorage: {view: "analysis", phase: "plan"}
    occurrences: []

relations:
  - type: "supports"
    from: "IE-H2"
    to: "IE-DESCRIBE-ORTHOGONAL-IF"
  - type: "supports"
    from: "IE-H3"
    to: "IE-BREAKDOWN-MODES"
  - type: "supports"
    from: "IE-CAPABILITIES-INDEX-ONLY"
    to: "IE-GUIDES-TWO-STAGE-RETRIEVAL"
  - type: "measures"
    from: "IE-METRICS-M1"
    to: "IE-H1"
  - type: "measures"
    from: "IE-METRICS-M3"
    to: "IE-H1"

structure:
  sections:
    - "SEC-ROUTING"
    - "SEC-INTENT"
    - "SEC-HYPOTHESIS"
    - "SEC-OPTIONS"
    - "SEC-DESIGN-DESCRIBE_BREAKDOWN"
    - "SEC-GUIDES-REDESIGN"
    - "SEC-GUIDES-AI-SMALL"
    - "SEC-GUIDES-PROFILES"
    - "SEC-ABSTRACT-ACTIONS_RECIPES"
    - "SEC-CAPABILITIES-RECIPES"
    - "SEC-METRICS"
    - "SEC-DECISION"
    - "SEC-INBOX"
```

---

End of v0.0.9