# IdeaMark Decision6 WorkCell v0.5

<!---
  Document メタ情報
  機械処理はこの YAML ブロックから開始
  refs/URL は未確定のため空
--->
```yaml
ideamark_version: 1
doc_id: "ideamark.cli.ideamark-cli.workcell.decision6"
doc_type: "pattern"
status: "completed"
created_at: "2026-02-17"
updated_at: "2026-02-20"
lang: "ja-JP"

template:
  file: "Decision6-WorkCell.ideamark.template.md"
  description: "Decision6 WorkCell Template"
refs:
  sources:
    - id: "tpl.decision6.workcell"
      uri: "./Decision6-WorkCell.ideamark.template.md"
      role: "template"
      description: "Decision6 WorkCell Template"

  derived_from: []
  related:
    - uri: "./ideamark-cli_test-catalog_v0.8.flowmark.md"
      relation: "related"
      description: "FlowMark形式の網羅テストカタログ（v0.8）"
    - uri: "./ideamark-cli_test-spec_validate_v0.8.ideamark.md"
      relation: "related"
      description: "validateの受け入れ基準（v0.8）"
    - uri: "./ideamark-cli_test-spec_compose_v0.8.ideamark.md"
      relation: "related"
      description: "composeの受け入れ基準（v0.8）"
```

## Meta
```yaml
intent: "IdeaMark CLI（ideamark）MVP設計のWorkCellを、Strict（YAML必須）運用前提で定義する。"
domain: ["ideamark", "decision6", "workcell", "cli", "strict"]
constraints:
  - "各Sectionにanchorageを必須とする（fenced YAML）"
  - "Occurrenceは最小セットでも明示する（LLM分割生成→合成→検証のため）"
  - "外部参照（URL/FQID）は v0.1.0 では解決しない（存在検証のみ）"
```

---

## Section 001 : Intent
```yaml
section_id: "SEC-INTENT"
anchorage:
  view: "solution"
  phase: "confirmed"
```

### OCC-INTENT : 目的
```yaml
occurrence_id: "OCC-INTENT"
entity: "IE-INTENT"
role: "primary_statement"
status:
  state: "confirmed"
  confidence: 0.95
attribution:
  contributor: "user"
```

IdeaMark文書を、LLM非依存の機械的操作で **検証・抽出・合成・整形**できるCLIを設計する。  
Git運用・CI・AI利用のどれでも破綻しない「致命的事故を避ける」設計を優先する。

---

## Section 002 : Premises（前提）
```yaml
section_id: "SEC-PREMISES"
anchorage:
  view: "background"
  phase: "confirmed"
```

### OCC-PREMISES : 前提セット
```yaml
occurrence_id: "OCC-PREMISES"
entity: "IE-PREMISES"
role: "primary_statement"
status:
  state: "confirmed"
  confidence: 0.90
```

- 正しさの3層（parse / schema / operational）
- Source of Truth は Markdown + YAML frontmatter + fenced YAML（JSON/YAML単体は交換形式）
- IDは文書内一意でよい（MVPではUUID v4原則）
- 内部表現は AST（ツリー）＋Symbol Table（実体）＋Ref（参照）
- extract/compose は意味解釈ではなく構造操作（原則決定論的）

---

## Section 003 : Decisions（確定事項）
```yaml
section_id: "SEC-DECISIONS"
anchorage:
  view: "decision"
  phase: "confirmed"
```

### OCC-D1 : 同一性判定（ヒューリスティック）
```yaml
occurrence_id: "OCC-D1"
entity: "IE-D1"
role: "decision"
status:
  state: "confirmed"
  confidence: 0.95
```

- **第一段階**：fenced YAMLを除いたMarkdown本文（リテラル）が完全一致なら「同一候補」
- anchorage（fenced YAML属性）が異なる場合は別定義扱い
- 解釈結果同一性の判定は非目標（人/AIに委ねる）

### OCC-D2 : IDポリシー
```yaml
occurrence_id: "OCC-D2"
entity: "IE-D2"
role: "decision"
status:
  state: "confirmed"
  confidence: 0.90
```

- doc_id は UUID v4（extract/compose出力は常に新規）
- local_id（Entity/Occurrence/Section等）は原則 UUID v4
- 決定論はIDではなく AST操作の規約（並び・閉包・出力形式）に適用する

### OCC-D3 : FQID（参照文脈のみ）
```yaml
occurrence_id: "OCC-D3"
entity: "IE-D3"
role: "decision"
status:
  state: "confirmed"
  confidence: 0.90
```

- 正準形：`<doc_id>#<local_id>`
- 文書間参照など参照の文脈でのみ使用
- local_idを置き換えない

### OCC-D4 : compose衝突
```yaml
occurrence_id: "OCC-D4"
entity: "IE-D4"
role: "decision"
status:
  state: "confirmed"
  confidence: 0.90
```

- 異なるIDは別物として併記（dedupeしない）
- 同一local_idで定義が異なる場合：warning + UUID rename（デフォ） + 参照追随
- 将来 `--on-conflict=rename-deterministic` を追加しうる


### OCC-D5 : Refスコープ（v0.1.x）
```yaml
occurrence_id: "OCC-D5"
entity: "IE-D5"
role: "decision"
status:
  state: "confirmed"
  confidence: 0.90
```

- v0.1.x は **YAML内参照のみ**を Ref として追跡する（Markdown本文中のID/リンクは追跡しない）
- 対象：Occurrenceの `entity/target/supporting_evidence`、Registryの `sections.*.occurrences` / `structure.sections`、（実装するなら）`relations[].from/to`

### OCC-D6 : extract閉包は推移閉包（自己完結）
```yaml
occurrence_id: "OCC-D6"
entity: "IE-D6"
role: "decision"
status:
  state: "confirmed"
  confidence: 0.90
```

- extract は抽出対象から参照グラフを辿り、必要な定義が揃うまで **推移閉包（トランジティブ・クロージャ）**を取る
- 出力は単体で Strict validate を通過し、`structure.sections` は抽出Sectionのみで構成する

### OCC-D7 : Strictヘッダ必須はYAML Spec v1に寄せる
```yaml
occurrence_id: "OCC-D7"
entity: "IE-D7"
role: "decision"
status:
  state: "confirmed"
  confidence: 0.85
```

- Strict validate の Document Header 必須は `ideamark_version/doc_id/doc_type/status/created_at/updated_at/lang`（YAML Spec v1）に合わせる

### OCC-D8 : compose時のstructureマージ規則
```yaml
occurrence_id: "OCC-D8"
entity: "IE-D8"
role: "decision"
status:
  state: "confirmed"
  confidence: 0.85
```

- `structure.sections` は **Aの順序を維持し、Bの未出現Sectionを末尾に追加**（重複除外）


---


### OCC-D5 : 参照表現と正準形（ideamark://）
```yaml
occurrence_id: "OCC-D5B"
entity: "IE-D5"
role: "decision"
status:
  state: "confirmed"
  confidence: 0.90
```

- 参照の正準形は YAML Spec v1 の IdeaMark URI（`ideamark://docs/{doc_id}#/...`）とする  
- 作文・ローカル運用では、同一文書内参照として `IE-*` / `OCC-*` / `SEC-*` のローカルID参照を許容する  
- 外部参照（https 等）の解決は非目標（v0.1.0では存在検証のみ）  
- FQID（`<doc_id>#<local_id>`）は参照文脈の表現として許容するが、将来 format による正準化（`ideamark://`）の対象になりうる

## Section 004 : Hypotheses（仮説）
```yaml
section_id: "SEC-HYPOTHESES"
anchorage:
  view: "structural_hypothesis"
  phase: "hypothesis"
```

### OCC-H1 : LLM非依存コア
```yaml
occurrence_id: "OCC-H1"
entity: "IE-H1"
role: "structural_hypothesis"
status:
  state: "active"
  confidence: 0.80
```

生成・要約・意味解釈をコアに入れないことで、CIや企業利用を含め幅広く使える。

### OCC-H2 : extract/composeが採用を加速する
```yaml
occurrence_id: "OCC-H2"
entity: "IE-H2"
role: "structural_hypothesis"
status:
  state: "active"
  confidence: 0.80
```

validate/formatだけではなく、extract/composeが日常運用を可能にし採用を加速する。

### OCC-H3 : AST+Symbol+Ref
```yaml
occurrence_id: "OCC-H3"
entity: "IE-H3"
role: "structural_hypothesis"
status:
  state: "active"
  confidence: 0.80
```

AST+Symbol Table+Refで、重複出現と参照整合を両立できる。

---

## Section 005 : MVP Commands
```yaml
section_id: "SEC-COMMANDS"
anchorage:
  view: "solution"
  phase: "plan"
```

### OCC-COMMANDS : コマンドセット
```yaml
occurrence_id: "OCC-COMMANDS"
entity: "IE-COMMANDS"
role: "plan"
status:
  state: "confirmed"
  confidence: 0.90
```

- ideamark describe（自己記述：説明＋将来スキーマ）
- ideamark validate（ID/参照整合/必須要素）
- ideamark format / normalize（決定論的整形・正規化）
- ideamark extract（条件抽出＋参照閉包＋新規doc_id）
- ideamark compose（和集合合成＋衝突時UUID rename＋参照追随＋新規doc_id）

---

## Section 006 : Experiment（最初の検証）
```yaml
section_id: "SEC-EXPERIMENT"
anchorage:
  view: "plan"
  phase: "plan"
```

### OCC-EXPERIMENT : 検証計画
```yaml
occurrence_id: "OCC-EXPERIMENT"
entity: "IE-EXPERIMENT"
role: "plan"
status:
  state: "confirmed"
  confidence: 0.90
```

テストセット（機能的テスト観点のケース化：v0.1.0）：

### Validate（Strict）
- **TC-VAL-001**: Header 必須欠落 → error（処理停止）
- **TC-VAL-002**: Section anchorage 欠落 → error
- **TC-VAL-003**: ID 重複（Entity/Occurrence/Section）→ error
- **TC-VAL-004**: 参照切れ（YAML内参照）→ error
- **TC-VAL-005**: 未参照 Entity / 未使用 Occurrence → warning
- **TC-VAL-006**: “同一定義候補”ヒューリスティック（本文リテラル一致）→ warning/info

### Extract（閉包・自己完結）
- **TC-EXT-001**: `--section` 抽出 → 参照閉包を含めて単体 validate 通過
- **TC-EXT-002**: 閉包が推移的（トランジティブ）に解決される（参照の参照まで同梱）
- **TC-EXT-003**: 出力 `doc_id` が新規 UUID v4、参照整合が維持される

### Compose（和集合・衝突・参照追随）
- **TC-COM-001**: 異なる ID は別物として併記（dedupe しない）
- **TC-COM-002**: 同一 ID かつ同一定義 → そのまま（または info）
- **TC-COM-003**: 同一 local_id 衝突（定義差）→ warning + UUID rename + 参照追随
- **TC-COM-004**: 参照追随は “YAML内参照フィールド” のみを対象（Markdown本文は対象外）
- **TC-COM-005**: 参照表現の差分（ローカルID / ideamark:// / FQID）を含む追随更新

### Format（決定論的整形）
- **TC-FMT-001**: YAML 正規化（キー順/インデント）により安定出力（再実行で差分なし）

成功条件：
> v0.6 では、このテスト観点を最小セットに絞らず **網羅的にケースID化し fixtures を生成**する方針を採用する。
> 具体的なケース一覧・期待結果の書式・フィクスチャ配置規約は、spec の「SEC-TEST-DESIGN」を正とする。

- extract 出力が単体で validate(strict) 通過
- compose 出力が validate(strict) 通過
- rename が発生しても参照が切れない（追随更新が完了している）


---

## Entities / Occurrences / Sections Registry
```yaml
entities:
  IE-INTENT:
    kind: concept
    content: LLM非依存の機械的操作でIdeaMark文書を扱えるCLIを設計する。
    atomic_state: true
  IE-PREMISES:
    kind: background
    content: 本WorkCellの成立条件（前提）を列挙する。
    atomic_state: true
  IE-D1:
    kind: decision
    content: 同一性判定ヒューリスティック（リテラル一致優先）
    atomic_state: true
  IE-D2:
    kind: decision
    content: IDポリシー（UUID v4、決定論はAST操作へ）
    atomic_state: true
  IE-D3:
    kind: decision
    content: FQIDは参照文脈のみ（<doc_id>#<local_id>）
    atomic_state: true
  IE-D4:
    kind: decision
    content: compose衝突はwarning＋UUID rename＋参照追随（デフォ）
    atomic_state: true
  IE-D5:
    kind: decision
    content: 参照表現と正準形（ideamark://、ローカルID許容、外部解決は非目標）
    atomic_state: true
  IE-H1:
    kind: structural_hypothesis
    content: LLM非依存コアが信頼性と汎用性を最大化する
    atomic_state: true
  IE-H2:
    kind: structural_hypothesis
    content: extract/composeが採用を加速する
    atomic_state: true
  IE-H3:
    kind: structural_hypothesis
    content: AST+Symbol+Refが重複出現と参照整合を両立する
    atomic_state: true
  IE-COMMANDS:
    kind: plan
    content: MVPコマンド群（describe/validate/format/normalize/extract/compose）
    atomic_state: true
  IE-EXPERIMENT:
    kind: plan
    content: extract/composeの参照整合・安全性を検証する最小テスト
    atomic_state: true
  IE-D6:
    kind: decision
    content: IE-D6（Decision項目）
    atomic_state: true
  IE-D7:
    kind: decision
    content: IE-D7（Decision項目）
    atomic_state: true
  IE-D8:
    kind: decision
    content: IE-D8（Decision項目）
    atomic_state: true
IE-D5:
  kind: decision
  content: RefスコープはYAML内参照のみ（v0.1.x）
  atomic_state: true
IE-D6:
  kind: decision
  content: extract閉包は推移閉包で自己完結を保証
  atomic_state: true
IE-D7:
  kind: decision
  content: Strictヘッダ必須はYAML Spec v1に寄せる
  atomic_state: true
IE-D8:
  kind: decision
  content: compose時のstructureマージ規則（A順序維持+末尾追加）
  atomic_state: true
occurrences:
  OCC-INTENT:
    entity: IE-INTENT
    role: primary_statement
    status:
      state: confirmed
  OCC-PREMISES:
    entity: IE-PREMISES
    role: primary_statement
    status:
      state: confirmed
  OCC-D1:
    entity: IE-D1
    role: decision
    status:
      state: confirmed
  OCC-D2:
    entity: IE-D2
    role: decision
    status:
      state: confirmed
  OCC-D3:
    entity: IE-D3
    role: decision
    status:
      state: confirmed
  OCC-D4:
    entity: IE-D4
    role: decision
    status:
      state: confirmed
  OCC-D5:
    entity: IE-D5
    role: decision
    status:
      state: confirmed
  OCC-H1:
    entity: IE-H1
    role: structural_hypothesis
    status:
      state: active
      confidence: 0.8
  OCC-H2:
    entity: IE-H2
    role: structural_hypothesis
    status:
      state: active
      confidence: 0.8
  OCC-H3:
    entity: IE-H3
    role: structural_hypothesis
    status:
      state: active
      confidence: 0.8
  OCC-COMMANDS:
    entity: IE-COMMANDS
    role: plan
    status:
      state: confirmed
  OCC-EXPERIMENT:
    entity: IE-EXPERIMENT
    role: plan
    status:
      state: confirmed
  OCC-D5B:
    entity: IE-D5
    role: decision
    status:
      state: confirmed
      confidence: 0.9
  OCC-D6:
    entity: IE-D6
    role: decision
    status:
      state: confirmed
      confidence: 0.9
  OCC-D7:
    entity: IE-D7
    role: decision
    status:
      state: confirmed
      confidence: 0.85
  OCC-D8:
    entity: IE-D8
    role: decision
    status:
      state: confirmed
      confidence: 0.85
OCC-D5:
  entity: IE-D5
  role: decision
  status:
    state: confirmed
OCC-D6:
  entity: IE-D6
  role: decision
  status:
    state: confirmed
OCC-D7:
  entity: IE-D7
  role: decision
  status:
    state: confirmed
OCC-D8:
  entity: IE-D8
  role: decision
  status:
    state: confirmed
sections:
  SEC-INTENT:
    anchorage:
      view: solution
      phase: confirmed
    occurrences:
    - OCC-INTENT
  SEC-PREMISES:
    anchorage:
      view: background
      phase: confirmed
    occurrences:
    - OCC-PREMISES
  SEC-DECISIONS:
    anchorage:
      view: decision
      phase: confirmed
    occurrences:
    - OCC-D1
    - OCC-D2
    - OCC-D3
    - OCC-D4
    - OCC-D5
    - OCC-D6
    - OCC-D7
    - OCC-D8
    - OCC-D5B
  SEC-HYPOTHESES:
    anchorage:
      view: structural_hypothesis
      phase: hypothesis
    occurrences:
    - OCC-H1
    - OCC-H2
    - OCC-H3
  SEC-COMMANDS:
    anchorage:
      view: solution
      phase: plan
    occurrences:
    - OCC-COMMANDS
  SEC-EXPERIMENT:
    anchorage:
      view: plan
      phase: plan
    occurrences:
    - OCC-EXPERIMENT
structure:
  sections:
  - SEC-INTENT
  - SEC-PREMISES
  - SEC-DECISIONS
  - SEC-HYPOTHESES
  - SEC-COMMANDS
  - SEC-EXPERIMENT
```

---

## 補足: Strict運用の狙い（anchorage必須の理由）

- Markdown本文は読みやすいが、生成時の意図・制約・読み方が落ちやすい  
- anchorage（view/phase）は「どう読むか」を固定し、意味の発生条件を保持する  
- LLMのトークン制約により分割生成が前提になるため、**Section/Occurrence単位で合成・検証できる**ことが重要  
- YAMLなし文書は「素材」として取り込み、describeがStrict化の手順（雛形・チェックリスト）をガイドする

---

## SEC-REGISTRY-POLICY

```yaml
section_id: "SEC-REGISTRY-POLICY"
anchorage:
  view: "design"
  phase: "validation"
```

本プロジェクトでは Registry を source of truth とする設計方針を採用する。
validate / format は Registry を基準に動作する。


---

## SEC-ID-POLICY

```yaml
section_id: "SEC-ID-POLICY"
anchorage:
  view: "design"
  phase: "validation"
```

本プロジェクトでは `doc_id` を概念IDとして固定し、版管理はファイル名で行う。
Entity/Occurrence/Section のIDは文書内一意を原則とし、compose衝突時はUUID短縮サフィックスで rename する。
rename は `aliases` として旧IDを保持する。

---

## SEC-WORKING-PUBLISHED-MODEL

```yaml
section_id: "SEC-WORKING-PUBLISHED-MODEL"
anchorage:
  view: "design"
  phase: "implementation"
```

本プロジェクトでは Working と Published を明確に分離する。

- Working: local ID 参照、編集・議論・生成用。
- Published: canonical 参照（URI形式）、DB登録・共有用。
- extract は常に新規 doc_id。
- compose は Create（新規）と Update（既存更新）を区別する。

---

## SEC-VALIDATE-DIAGNOSTICS

```yaml
section_id: "SEC-VALIDATE-DIAGNOSTICS"
anchorage:
  view: "design"
  phase: "implementation"
```

validate は JSON Lines（NDJSON）で diagnostics を出力する。
severity は error/warning/info、code は snake_case、location（scope/path/id）と mode を必須とする。

---

## SEC-COMPOSE-CONFLICT-AND-ORDER

```yaml
section_id: "SEC-COMPOSE-CONFLICT-AND-ORDER"
anchorage:
  view: "design"
  phase: "implementation"
```

compose は dedupe せず rename で吸収する。
RegistryはIDソートで安定化し、Section順は structure.sections を正とする。

---

## SEC-FORMAT-SCOPE

```yaml
section_id: "SEC-FORMAT-SCOPE"
anchorage:
  view: "design"
  phase: "implementation"
```

format は整形のみを担い、sync はオプションで分離する。
YAML表記の厳密一致は要求せず、構文的に有効であることを重視する。
Section順は structure.sections を正とし、formatではupdated_atを更新しない。

---

## SEC-TEMPLATE-REFERENCE-AND-LINT

```yaml
section_id: "SEC-TEMPLATE-REFERENCE-AND-LINT"
anchorage:
  view: "design"
  phase: "implementation"
```

template は必須ではなく、適合性は将来の lint で warning として評価する。
参照は refs.template に記録し、formatはtemplate強制を行わない。

---

## SEC-PUBLISH-COMMAND

```yaml
section_id: "SEC-PUBLISH-COMMAND"
anchorage:
  view: "design"
  phase: "implementation"
```

publish は Working を Published に正規化するまでを責務とし、DB登録や配置は呼び出し側に委ねる。
デフォルトは `format --canonical` → `validate --strict`。syncは含めず、updated_atを更新する。

---

## SEC-COMMAND-IO-CONVENTIONS

```yaml
section_id: "SEC-COMMAND-IO-CONVENTIONS"
anchorage:
  view: "design"
  phase: "implementation"
```

v0.1.0では、infile省略時はstdin、成果物はstdout、validate以外のdiagnosticsはstderrを基本とする。

---

## SEC-CLI-SIGNATURES

```yaml
section_id: "SEC-CLI-SIGNATURES"
anchorage:
  view: "design"
  phase: "implementation"
```

v0.1.0 の CLI シグネチャを確定した（validate/format/extract/compose/publish と I/O 規約）。

---

## SEC-DESCRIBE-COMMAND

```yaml
section_id: "SEC-DESCRIBE-COMMAND"
anchorage:
  view: "design"
  phase: "implementation"
```

describe は仕様・語彙・チェックリストを出力する自己記述コマンドとして復活。
v0.1.0 ではフィルタ無しの静的照会のみを扱う。
