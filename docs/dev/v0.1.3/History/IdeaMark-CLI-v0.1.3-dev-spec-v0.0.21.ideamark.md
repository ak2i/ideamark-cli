```yaml
ideamark_version: "1.0.3"
doc_id: "ideamark.cli.v0.1.3.dev-spec.v0.0.21.2026-03-04"
doc_type: "evolving"
status:
  state: "in_progress"
created_at: "2026-03-01T00:00:00Z"
updated_at: "2026-03-04T00:00:00Z"
lang: "ja-JP"
```

# IdeaMark-CLI v0.1.3 Development Spec (v0.0.21)

v0.0.6 / v0.0.17 / v0.0.20 を統合再構成した網羅版。  
構造は v0.0.20、内容は v0.0.17 を吸収し、v0.0.6 監査済み。

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

# SEC-IMPLEMENTATION-PLAN

```yaml
section_id: "SEC-IMPLEMENTATION-PLAN"
anchorage:
  view: "plan"
  phase: "design"
```

実装順序：

1. describe I/F 拡張
2. guides JSON 出力
3. breakdown 実装
4. minimal validation 実装
5. LLMテストスクリプト整備

---

End of v0.0.21
