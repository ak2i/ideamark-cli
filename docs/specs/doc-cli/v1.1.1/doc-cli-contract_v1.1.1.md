# Doc CLI Contract v1.1.1
Generated: 2026-06-19T00:00:00Z

この文書は、IdeaMark Core v1.1.1 系の文書を扱う CLI ツールに対する
標準化された操作契約を定義する。

目的:

- LLM / 自動化 / 人間利用者が、同一の手順で Doc CLI ツールを扱えるようにする
- `describe` により、ツール自身が使い方・能力・入力要件を動的に公開できるようにする
- `validate` により、構造的妥当性を統一的に扱えるようにする

基本方針:

- この契約は Core 仕様書そのものではない
- この契約は CLI の自己記述と検証 I/F を定義する
- Core v1.1.1 以降の IdeaMark 文書は YAML ベースで扱う

---

## 0. 用語

- Layer A: Tool Interface Contract
  - CLI 操作の共通 I/F
- Layer B: Document Profile Contract
  - 対象文書向けの自己記述契約
- YAML-based document
  - ツールが主対象として扱う文書表現が YAML であること

---

## 1. Layer A: Tool Interface Contract

### 1.1 MUST commands

#### describe

```bash
<tool> describe <topic> [--format md|json|yaml] [common options...]
```

要件:

- `describe` は MUST
- `describe` は `md` と `json` を最低限サポートすることが望ましい
- `yaml` をサポートする場合は `describe capabilities` で宣言する
- `describe` はツールの使い方を動的に取得するための標準手段である

#### validate

```bash
<tool> validate [--format ndjson|json|md] [common options...] <input|->
```

要件:

- `validate` は MUST
- `validate` は構造妥当性を判定できなければならない
- `validate` は対象文書の意味論を保証しない
- 具体的な strictness や診断コードは Layer B で拡張可能

### 1.2 MUST describe topics

- `describe capabilities`
- `describe params`
- `describe ai-authoring`

### 1.3 SHOULD describe topics

- `describe ls`
- `describe routing`
- `describe checklist`
- `describe vocab`

### 1.4 MUST flags

#### --help

- `--help` は MUST

#### --version

- `--version` は MUST
- `--version --format json` は SHOULD
- JSON 出力時は少なくとも次を含むこと
  - tool version
  - contract version
  - document spec version

---

## 2. YAML-based document handling

Core v1.1.1 系において、Doc CLI は YAML ベース文書を第一対象とする。

要件:

- ツールは YAML ベース入力を正規対象として扱う
- Markdown 断片や人間向け説明文は補助的表現として扱ってよい
- `describe` が返す authoring guidance / params / capabilities は YAML ベース運用を前提にする

非目標:

- Markdown-first 文書構造を Core 前提として固定しない
- 旧 v1.0.3 系の文書表現互換をこの契約では保証しない

---

## 3. Layer B: Document Profile Contract

Layer B はツール固有であり、少なくとも次を公開する。

### 3.1 describe capabilities

ツールが実装している:

- commands
- formats
- options
- dynamic discovery topics
- supported document baseline

を機械可読に公開する。

### 3.2 describe params

文書生成に必要な:

- header fields
- registry namespaces
- reference forms
- payload rules
- optional / required fields

を公開する。

### 3.3 describe ai-authoring

LLM / human author が文書を正しく生成するための:

- overview
- do / dont
- checklist
- examples
- YAML authoring guidance

を公開する。

---

## 4. YAML authoring baseline

Doc CLI v1.1.1 系では、少なくとも以下を前提にする。

- document header is YAML
- structural units are YAML data
- `Entity.payload` is YAML object based
- references are strings unless profile extends them
- machine-readable output should prefer JSON or NDJSON

---

## 5. Required references

この契約は別紙を参照する。

- `doc-cli-contract_v1.1.1_validate-schema.md`
- `doc-cli-contract_v1.1.1_describe-params.md`
- `doc-cli-contract_v1.1.1_describe-ai-authoring.md`
- `doc-cli-contract_v1.1.1_capabilities-schema.md`
- `doc-cli-contract_v1.1.1_capabilities-md-template.md`

---

## 6. Compatibility policy

- Unknown fields MUST be ignored by consumers
- Field types SHOULD remain stable within the `v1.1.x` contract line
- Breaking CLI contract changes require a contract version bump

---

## 7. Non-goals

- Core meaning model definition
- payload profile semantics validation
- URI reachability validation
- legacy v1.0.3 migration rules

---

End of contract.
