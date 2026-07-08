# Doc CLI Contract v1.1.2
Generated: 2026-07-08T00:00:00+09:00

この文書は、YAML-based document を扱う CLI ツールに対する標準化された操作契約を定義する。

v1.1.2 は v1.1.1 の互換更新であり、主な追加は `describe ls` / `describe routing` を中心とする
**Discovery Contract** の明文化である。

目的:

- LLM / 自動化 / 人間利用者が、同一の手順で Doc CLI ツールを扱えるようにする
- `describe` により、ツール自身が使い方・能力・入力要件・探索可能なガイド資産を動的に公開できるようにする
- `validate` により、構造的妥当性を統一的に扱えるようにする
- `describe routing` により、複数 Doc CLI ツール間の routing 判断を機械可読にする

基本方針:

- この契約は Core 仕様書そのものではない
- この契約は CLI の自己記述と検証 I/F を定義する
- Core v1.1.1 以降の IdeaMark 文書は YAML ベースで扱う
- Discovery payload は物理ファイルパスではなく、論理 ID を公開する

---

## 0. 用語

- Layer A: Tool Interface Contract
  - CLI 操作の共通 I/F
- Layer B: Document Profile Contract
  - 対象文書向けの自己記述契約
- Discovery Contract
  - built-in guidance / vocabulary / routing hints を機械可読に公開する契約
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

### 1.4 Discovery-oriented describe topics

v1.1.2 では、以下を Discovery topic として標準化する。

- `describe ls`
  - built-in guidance assets / vocabularies / logical identifiers を列挙する
  - 物理ファイルパスを公開してはならない
- `describe routing`
  - ツールの適用範囲、非目標、補完ツール、routing selector を公開する
  - routing 情報の根拠となる guide / section ID を公開する

詳細 shape は `doc-cli-contract_v1.1.2_describe-discovery.md` で定義する。

### 1.5 MUST flags

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

Core v1.1.1 系以降において、Doc CLI は YAML ベース文書を第一対象とする。

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
- describe topics
- dynamic discovery topics
- supported document baseline
- supported routing selectors

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

### 3.4 describe discovery

LLM / human / automation がツールの built-in guidance と routing scope を発見するための:

- guide IDs
- section IDs
- selector names
- available languages
- non-goals
- complementary tools
- decision rules

を公開する。

---

## 4. YAML authoring baseline

Doc CLI v1.1.x 系では、少なくとも以下を前提にする。

- document header is YAML
- structural units are YAML data
- payload is YAML object based when the document profile defines payload
- references are strings unless profile extends them
- machine-readable output should prefer JSON, YAML, or NDJSON

---

## 5. Required references

この契約は別紙を参照する。

- `doc-cli-contract_v1.1.2_describe-discovery.md`
- `doc-cli-contract_v1.1.2_capabilities-schema.md`
- `doc-cli-contract_v1.1.2_describe-params.md`
- `doc-cli-contract_v1.1.2_describe-ai-authoring.md`

---

## 6. Compatibility policy

- Unknown fields MUST be ignored by consumers
- Field types SHOULD remain stable within the `v1.1.x` contract line
- v1.1.2 は v1.1.1 互換の additive update である
- Breaking CLI contract changes require a contract version bump outside the v1.1.x compatibility line

---

## 7. Non-goals

- Core meaning model definition
- payload profile semantics validation
- URI reachability validation
- legacy v1.0.3 migration rules
- retrieval ranking or storage orchestration

---

## 8. v1.1.2 changes

- `describe ls` / `describe routing` の Discovery output shape を追加
- capabilities schema に `features.routing` / `features.discovery` の推奨形を追加
- Discovery selector vocabulary を追加
- built-in guidance assets は logical IDs で公開する方針を明文化

---

End of contract.
