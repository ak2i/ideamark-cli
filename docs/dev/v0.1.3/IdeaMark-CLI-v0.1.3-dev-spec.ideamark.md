```yaml
ideamark_version: "1.0.3"
doc_id: "ideamark.cli.v0.1.3.dev-spec.v0.0.24.2026-03-04"
doc_type: "evolving"
status:
  state: "in_progress"
created_at: "2026-03-01T00:00:00Z"
updated_at: "2026-03-04T00:00:00Z"
lang: "ja-JP"
```

# IdeaMark-CLI v0.1.3 Development Spec

v0.0.6 / v0.0.17 / v0.0.20 を統合再構成した網羅版。  
構造は v0.0.20、内容は v0.0.17 を吸収し、v0.0.6 監査済み。

v0.0.24 では、diff/lint を **診断ツール**として追加した方針は維持しつつ、(1) lint の NDJSON を validate 契約のレコードモデル（meta/diagnostic/summary）に合わせ、(2) describe capabilities で lint/diff を明示宣言する。

---

# SEC-PURPOSE-AND-RATIONALE

```yaml
section_id: "SEC-PURPOSE-AND-RATIONALE"
anchorage:
  view: "background"
  phase: "confirmed"
  domain: ["purpose", "rationale", "v0.1.3"]
```

## 目的

v0.1.3 の目的は次の3点である：

1. `describe` を拡張し、LLMが自律探索可能な環境を整備する
2. guides を再設計し、生成/検証/変換の安定動作を実現する
3. Section分割（breakdown）を正式仕様化し、将来の diff/lint と整合する基盤を作る

## なぜ必要か

- Doc-CLI-Contract v1.0.3 に準拠する必要
- 複数Doc系CLI環境でのLLM自律探索
- ファイル名依存を排除
- routing概念の共通化
- guides が「運任せ」状態になっていた

---

# SEC-SCOPE-AND-NONGOALS

```yaml
section_id: "SEC-SCOPE-AND-NONGOALS"
anchorage:
  view: "problem"
  phase: "confirmed"
```

## Scope

- describe 直交I/F化（audience/lang/model）
- profile エイリアス導入
- guides 再設計（ai-small / ai-large）
- describe ls 実装
- describe routing 実装
- breakdown（Section独立文書化）仕様確定
- minimal validationポリシー明文化
- LLMテスト設計

## Non-goals

- merge コマンド正式実装（v0.2以降）
- diff/lint フル実装
- routing JSON schema 固定

---

# SEC-DESCRIBE-INTERFACE-DESIGN

```yaml
section_id: "SEC-DESCRIBE-INTERFACE-DESIGN"
anchorage:
  view: "decision"
  phase: "confirmed"
```

## 正規I/F（直交設計）

--audience human|ai  
--lang ja|en  
--model small|large  

### 原則

- profile は内部で直交I/Fへ展開
- format=json の default → audience=ai, model=small
- format=md の default → audience=human, lang=ja
- --model は audience=ai のときのみ有効

採用理由：LLM が capabilities を見て意図を分解しやすくするため。

---

# SEC-GUIDES-ARCHITECTURE

```yaml
section_id: "SEC-GUIDES-ARCHITECTURE"
anchorage:
  view: "solution"
  phase: "design"
```

## guides 再設計思想

従来の課題：

- 手順が説明中心
- 検証ループ不明示
- ai-authoring と params の関係が曖昧

### v0.1.3 原則

- ai-small → 固定安全レシピ
- ai-large → フレームワーク＋判断点＋終了条件
- human-easy / human-advanced → MD版

---

# SEC-AI-SMALL-GUIDES

```yaml
section_id: "SEC-AI-SMALL-GUIDES"
anchorage:
  view: "solution"
  phase: "design"
```

## 目的

small LLMが迷わず成功する最短パスを提供。

## 最小スキーマ

- version
- goal
- preconditions
- steps[]
- minimal_validation[]
- forbidden_patterns[]
- followup_topics[]

## 固定手順

1. generate
2. validate
3. breakdown(copy)

必須チェック：

- YAML parseable
- ID unique
- reference resolvable

---

# SEC-AI-LARGE-GUIDES

```yaml
section_id: "SEC-AI-LARGE-GUIDES"
anchorage:
  view: "solution"
  phase: "design"
```

## フレームワーク構造

- PLAN
- AUTHOR
- VALIDATE
- TRANSFORM

## Decision Points

- SPLIT-MODE（copy/ref/hybrid）
- STRICTNESS（working/strict）
- MERGE-POLICY

## 終了条件

- requested outputs produced
- chosen strictness validation passes
- lineage recorded

---

# SEC-ABSTRACT-ACTIONS

```yaml
section_id: "SEC-ABSTRACT-ACTIONS"
anchorage:
  view: "solution"
  phase: "design"
```

## 抽象アクション語彙

Ingest系:
- ingest.material
- interpret.chunk

編集系:
- append.section
- expand.section
- summarize.section

構造操作系:
- validate.minimal
- breakdown.until_fit
- compose.bundle
- extract.view

---

# SEC-BREAKDOWN-SPECIFICATION

```yaml
section_id: "SEC-BREAKDOWN-SPECIFICATION"
anchorage:
  view: "solution"
  phase: "confirmed"
```

## 概念

Section を独立 IdeaMark 文書へ変換。

## モード

- copy（デフォルト）
- ref
- hybrid

## 最低来歴要件

- refs.derived_from に元 doc_id + section_id 記録
- operation: breakdown
- entity ID は copyでも保持
- 新規 entity は新ID付与

## Round-trip 要件

split → refine → merge で情報欠落が起きないこと。

---

# SEC-MINIMAL-VALIDATION-POLICY

```yaml
section_id: "SEC-MINIMAL-VALIDATION-POLICY"
anchorage:
  view: "decision"
  phase: "confirmed"
```

## 最低検証

- header_singleton
- yaml_parseable
- id_unique_within_doc
- references_resolvable

---

# SEC-LLM-TEST-MODEL

```yaml
section_id: "SEC-LLM-TEST-MODEL"
anchorage:
  view: "observation_series"
  phase: "design"
```

## 観測指標

- YAML parse 成功率
- ID一意率
- 自己修正率
- 再試行回数
- round-trip整合率

## 最低テストシナリオ

1. 長文生成
2. breakdown(copy)
3. 各文書精緻化
4. 統合
5. extract

---



---

# SEC-DIFF-AND-LINT-PURPOSE

```yaml
section_id: "SEC-DIFF-AND-LINT-PURPOSE"
anchorage:
  view: "background"
  phase: "confirmed"
  domain: ["diff", "lint", "diagnostic", "v0.1.3"]
```

## 目的（v0.1.3 内での位置づけ）

v0.1.3 における diff/lint は **診断（diagnostic）** として提供し、開発フローを止めない。

- diff: IdeaMark 文書の「構造差分」を抽出し、レビュー・統合・回帰確認を容易にする
- lint: 文書の「最低限の整合性」や「材料不足の示唆」を警告として提示し、次の作業（追加材料・局所修正）を誘導する

## 設計原則

- **Non-blocking by default**: デフォルトでは exit code 0（警告があっても成功扱い）
- **Strict is opt-in**: CI / release gating は `--strict` 等の明示指定でのみ有効化
- **YAML-first**: まずは fenced YAML（Registry と参照）を中心に扱い、Markdown 本文の差分は任意機能とする
- **Machine-readable first**: 出力は NDJSON を第一候補とし、後段ツールや LLM が扱いやすい形式を優先

---

# SEC-LINT-SPECIFICATION

```yaml
section_id: "SEC-LINT-SPECIFICATION"
anchorage:
  view: "solution"
  phase: "design"
  domain: ["lint", "rules", "diagnostic"]
```

## CLI（暫定）

- `ideamark lint <file> [--format ndjson|json|md] [--strict] [--profile <name>]`
  - v0.1.3 では `--format ndjson` を推奨（stdout）
  - `--strict` が無い場合：exit code 0（warning/error があっても成功）
  - `--strict` がある場合：severity=error を検出したら exit code 1

## 出力（NDJSON 推奨 / validate と同型）

v0.1.3 の lint は `validate` と **同じレコードモデル**で NDJSON を出力する（互換性・再利用性のため）。
ただし lint は独自コマンドのため、exit code の扱いは本仕様（non-blocking default）に従う。

### Record 1: meta（先頭に1回）

- `type`: `"meta"`
- `tool`: `"<tool-name>"`
- `version`: `"<semver>"`
- `mode`: `"<string>"`（例: `"diagnostic"` / `"strict"`）
- `command`: `"lint"`

### Record N: diagnostic（0回以上）

- `type`: `"diagnostic"`
- `severity`: `"error"|"warning"|"info"`
- `code`: `"<short_code>"`（例: `IM-LINT-001`）
- `message`: `"<human-readable message>"`
- `location`（optional）:
  - `scope`: `header|section|occurrence|entity|relation|structure|evidence|unknown`
  - `path`: JSON Pointer 例 `#/entities/IE-123`
  - `id`: 例 `IE-123` / `SEC-001`
  - `line`, `column`（任意）
- `mode`: `"<string>"`

拡張フィールド（任意）:
- `hint`: 次に取るべき行動（unknown field として許容され、利用側は無視してよい）
- `evidence`: 機械向け補助情報（同上）

### Record last: summary（末尾に1回）

- `type`: `"summary"`
- `ok`: `true|false`（lint では non-blocking default のため **通常 true**。`--strict` では fail になり得る）
- `error_count`, `warning_count`, `info_count`: 数


## ルールセット（v0.1.3 最小）

### 必須（最低検証ライン）

- IM-LINT-001: `header_singleton`
- IM-LINT-002: `yaml_parseable`
- IM-LINT-003: `id_unique_within_doc`
- IM-LINT-004: `references_resolvable`（Entity/Occurrence/Section/Relation の参照整合）

### 推奨（材料不足の示唆：warning）

- IM-LINT-101: `missing_sections`（構造 `structure.sections` にあるが実体が無い/逆）
- IM-LINT-102: `dangling_occurrences`（Occurrence があるが Section から参照されない）
- IM-LINT-103: `unreferenced_entities`（Entity があるが Occurrence から参照されない）
- IM-LINT-104: `anchorage_domain_sparse`（routing/discovery 用 domain が薄い、など）

※「推奨」は *エラーではない*。追加材料や再整理の必要性を示す。

## プロファイル（将来拡張の前提）

- `--profile minimal` : 必須ルールのみ
- `--profile diagnostic` : 必須 + 推奨（default）
- `--profile strict` : 必須 + 推奨 + 追加の強制（将来）

---

# SEC-DIFF-SPECIFICATION

```yaml
section_id: "SEC-DIFF-SPECIFICATION"
anchorage:
  view: "solution"
  phase: "design"
  domain: ["diff", "structure_diff", "diagnostic"]
```

## CLI（暫定）

- `ideamark diff <from> <to> [--format ndjson|json|md] [--scope yaml|all] [--include-markdown]`

v0.1.3 の基本方針：

- default scope は `yaml`（Registry と参照）
- Markdown 本文の差分は `--include-markdown` を付けた時のみ（ノイズ抑制）

## 差分の最小単位（YAML-first）

- Entities: 追加/削除/変更（`kind`, `content` のhash差分など）
- Occurrences: 追加/削除/変更（`entity`参照, `role`, `status`）
- Sections: 追加/削除/変更（`anchorage`, `occurrences[]`）
- Relations: 追加/削除/変更（`type`, `from`, `to`）
- Structure: `structure.sections` の順序と集合

## 出力（NDJSON 推奨）

- `op`: `add|remove|replace|move`
- `path`: JSON Pointer 例 `#/entities/IE-123`
- `before` / `after` : 値（必要最小、または hash）
- `summary`: 人間向け短文
- `risk_hint`: 参照破断/情報落ちの可能性など（任意）

## 正規化（ノイズ抑制）

v0.1.3 では「最低限の正規化」だけを行う：

- YAML のキー順は diff 対象外（内部で正規化して比較してよい）
- `updated_at` などタイムスタンプ系フィールドは既定で diff から除外（`--include-meta` で含める）
- 空白差分や Markdown の改行差分は既定で無視（`--include-markdown` で含める）

---

# SEC-DIFF-LINT-INTEGRATION-PLAN

```yaml
section_id: "SEC-DIFF-LINT-INTEGRATION-PLAN"
anchorage:
  view: "plan"
  phase: "design"
  domain: ["integration", "smoke_test", "workflow"]
```

## 開発フローへの組み込み方針（v0.1.3）

- 開発中：`lint` は default（non-blocking）で常時実行してよい
- PR/CI：必要になったタイミングで `lint --strict` を段階的に導入
- 回帰：`diff` は「構造差分」のみを用いて、意図しない ID/参照の変化を検出する

## スモークテスト（最小）

1) 既知の正常文書で `lint` が severity=error を出さないこと  
2) 意図的に壊した文書で `lint --strict` が exit code 1 になること  
3) 変更前後で `diff --scope yaml` が期待通りの add/remove/replace を出すこと  
4) breakdown round-trip（split→refine→merge）用の回帰テストは v0.1.3 では「設計上の前提」まで（merge実装は non-goal）




---

# SEC-CAPABILITIES-DECLARATION-UPDATE

```yaml
section_id: "SEC-CAPABILITIES-DECLARATION-UPDATE"
anchorage:
  view: "plan"
  phase: "design"
  domain: ["doc-cli-contract", "capabilities", "lint", "diff"]
```

## describe capabilities への追加宣言（v0.1.3）

`lint` / `diff` は Doc CLI Contract の MUST コマンドではないが、
実装する場合は **必ず** `describe capabilities` の `commands` に明示し、
対応フォーマットと主要オプションを宣言する。

### capabilities（JSON）例（非規範 / 抜粋）

```json
{
  "commands": {
    "lint": {
      "formats": ["ndjson"],
      "stdin": true,
      "description": "Emit non-blocking diagnostics for IdeaMark documents. Does not modify input.",
      "options": {
        "--strict": { "description": "Fail (exit 1) if any error-level diagnostics exist." },
        "--format": { "values": ["ndjson"], "description": "Output format." },
        "--profile": { "description": "Select lint rule profile (minimal|diagnostic|strict)." }
      }
    },
    "diff": {
      "formats": ["ndjson", "json"],
      "description": "Emit structural differences between two IdeaMark documents (YAML-first by default).",
      "options": {
        "--format": { "values": ["ndjson", "json"], "description": "Output format." },
        "--scope": { "values": ["yaml", "all"], "description": "Diff scope. Default: yaml." },
        "--include-markdown": { "description": "Include Markdown body differences (optional)." },
        "--include-meta": { "description": "Include meta/timestamp differences (optional)." },
        "--include-evidence": { "description": "Include Evidence Block differences (optional)." }
      }
    }
  }
}
```

# SEC-IMPLEMENTATION-PLAN

```yaml
section_id: "SEC-IMPLEMENTATION-PLAN"
anchorage:
  view: "plan"
  phase: "design"
```

実装順序（v0.1.3 / v0.0.23時点）：

1. describe I/F 拡張（audience/lang/model + profile 正規化）
2. guides 出力（ai-small / ai-large、言語切替の方針反映）
3. breakdown 実装（copy/ref/hybrid + derived_from / ID維持）
4. minimal validation 実装（YAML parse / ID一意 / 参照整合の最小）

5. **lint 実装（診断ツール / non-blocking default）**
   - 既定：`ideamark lint <file> --format ndjson`（stdout）
   - `--strict` 指定時のみ severity=error を exit code 1 にする
   - ルール最小セット：header_singleton / yaml_parseable / id_unique_within_doc / references_resolvable
   - 推奨（warning）：missing_sections / dangling_occurrences / unreferenced_entities など

6. **diff 実装（構造 diff / YAML-first default）**
   - 既定：`ideamark diff <from> <to> --scope yaml --format ndjson`
   - 正規化：timestamp系を既定で除外、YAMLキー順や空白差分でノイズを出さない
   - 最小単位：Entities/Occurrences/Sections/Relations/Structure の add/remove/replace/move

7. スモークテスト自動化
   - lint: 正常/異常の2系統（`--strict` の exit code 含む）
   - diff: 期待通りの add/remove/replace が出るフィクスチャ
   - （将来）breakdown round-trip 回帰の足場整備（merge実装は non-goal）

8. LLMテストスクリプト整備（guides品質の回帰・再試行回数など）

---

