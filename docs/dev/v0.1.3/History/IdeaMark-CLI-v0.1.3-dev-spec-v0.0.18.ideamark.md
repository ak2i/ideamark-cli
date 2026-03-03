```yaml
ideamark_version: "1.0.3"
doc_id: "ideamark.cli.v0.1.3.dev-spec.v0.0.18.2026-03-04"
doc_type: "evolving"
status:
  state: "in_progress"
created_at: "2026-03-01T00:00:00Z"
updated_at: "2026-03-03T22:26:33.398627+00:00"
lang: "ja-JP"
```

# IdeaMark-CLI v0.1.3 Development Spec (v0.0.18)
（v0.0.17 をベースに merge/refactor：章構成を維持しつつ、Section/Occurrence/Entityの配置を整理し、Markdown本文も読める形へ寄せる）

---

## SEC-OVERVIEW

```yaml
section_id: "SEC-OVERVIEW"
anchorage:
  view: "background"
  phase: "confirmed"
  domain: ["overview", "dev-spec", "v0.1.3"]
occurrences:
  - occurrence_id: "OCC-OVERVIEW-001"
    role: "explanation"
    entity_id: "IE-OVERVIEW-001"
entities:
  - entity_id: "IE-OVERVIEW-001"
    kind: "concept"
    content_lang: "ja-JP"
    content: |
      本ドキュメントは IdeaMark-CLI v0.1.3 の開発仕様（evolving）である。
      主眼は Doc-CLI-Contract v1.0.3 に整合する describe 拡張（describe ls / describe routing）と、
      その参照元となる内蔵 guides（IdeaMark文書）の同梱・探索・言語切替の設計を確定し、実装と動作確認へ接続すること。
```

### 何を解決するか

- 複数ツール環境で、LLM/AI/人が「どのツールを使うべきか」を機械可読に探索できる
- tools が自分の内蔵ガイド資産を **ファイル名やパスに依存せず**列挙できる
- guides は `anchorage.view` のバリエーション（background/problem/decision/solution）で
  **探索順序（background→problem→solution…）**を支援できる

---

## SEC-CONTRACT-ALIGNMENT

```yaml
section_id: "SEC-CONTRACT-ALIGNMENT"
anchorage:
  view: "solution"
  phase: "confirmed"
  domain: ["doc-cli-contract", "alignment", "v1.0.3"]
occurrences:
  - occurrence_id: "OCC-CONTRACT-ALIGN-001"
    role: "decision"
    entity_id: "IE-CONTRACT-ALIGN-001"
entities:
  - entity_id: "IE-CONTRACT-ALIGN-001"
    kind: "decision"
    content_lang: "ja-JP"
    content: |
      v0.1.3 では Doc-CLI-Contract v1.0.3 に整合し、describe の SHOULD topics として
      `describe ls` / `describe routing` を追加する。
      また `describe capabilities --format json` の features に `routing` と `languages` を追加する。
```

### 追加する SHOULD topics（Contract）
- `describe ls`
- `describe routing`

### capabilities schema 拡張（Contract）
- `features.routing`
- `features.languages`

---

## SEC-DESCRIBE-CAPABILITIES-V103

```yaml
section_id: "SEC-DESCRIBE-CAPABILITIES-V103"
anchorage:
  view: "solution"
  phase: "design"
  domain: ["describe", "capabilities", "json", "v1.0.3"]
occurrences:
  - occurrence_id: "OCC-CAPS-V103-001"
    role: "plan"
    entity_id: "IE-CAPS-V103-001"
entities:
  - entity_id: "IE-CAPS-V103-001"
    kind: "plan"
    content_lang: "ja-JP"
    content: |
      `ideamark describe capabilities --format json` は v0.1.2 の構造を維持したまま拡張する。
      describe.topics に ls/routing を追加し、features.routing/features.languages を追加する。
      既存 consumer は未知フィールドを無視できる前提とする。
```

### 完成版サンプル（要点）
- `contract.version = 1.0.3`
- `tool.version = 0.1.3`
- `document.version = 1.0.3`
- `commands.describe.topics` に `ls` / `routing`
- `features.routing` に entrypoints/selectors/fallback_search
- `features.languages` に available/default/(topics)

---

## SEC-BUILTIN-GUIDES-ASSETS

```yaml
section_id: "SEC-BUILTIN-GUIDES-ASSETS"
anchorage:
  view: "solution"
  phase: "design"
  domain: ["guides", "builtin", "assets", "lang"]
occurrences:
  - occurrence_id: "OCC-GUIDES-ASSET-001"
    role: "decision"
    entity_id: "IE-GUIDES-ASSET-001"
entities:
  - entity_id: "IE-GUIDES-ASSET-001"
    kind: "decision"
    content_lang: "ja-JP"
    content: |
      内蔵 guides は「1言語1内蔵doc」で同梱する（推奨）。
      describe の `--lang` で参照する内蔵docを切り替える。
      公開I/Fから物理パス/ファイル名は隠蔽し、`--target guides` の論理指定で参照する。
```

### テスト用の最小サンプル（同梱対象）
- en-US: `ideamark-builtin-guides-sample.v0.1.3.ideamark.md`
- ja-JP: `ideamark-builtin-guides-sample.v0.1.3.ja-JP.ideamark.md`

### guides 設計のキモ
- `anchorage.view` は **solution 以外も有効**（background/problem/decision）
- `anchorage.domain` は routing 用タグとして使える（例：guides/routing/breakdown）
- 重要な文言は `entities[].content` に置く（grep対象にもなる）

---

## SEC-DESCRIBE-LS

```yaml
section_id: "SEC-DESCRIBE-LS"
anchorage:
  view: "solution"
  phase: "design"
  domain: ["describe", "ls", "guides", "catalog"]
occurrences:
  - occurrence_id: "OCC-DESCRIBE-LS-001"
    role: "plan"
    entity_id: "IE-DESCRIBE-LS-001"
entities:
  - entity_id: "IE-DESCRIBE-LS-001"
    kind: "plan"
    content_lang: "ja-JP"
    content: |
      `describe ls` は、内蔵 guides のカタログを返す SHOULD topic として追加する。
      出力ロジックは既存 `ideamark ls` と同一ルーチンを再利用し、入力を内蔵docに差し替える。
```

### I/F（確定案）
```bash
ideamark describe ls --target guides [--lang <ja-JP|en-US|auto>] [ls-options] [--format json|md]
```

- `--target`（必須）：`guides`
- `--lang`：`ja-JP | en-US | auto`
- `ls-options`：既存 ls と同じ（`--sections | --occurrences | --entities | --vocab`）
- 既定（推奨）：`--sections + --vocab`

### 出力（互換方針）
- 既存 `ideamark ls` の JSON を基本形として維持
- 追加メタは **フィールド追加のみ**（例：languages/target/source）

---

## SEC-LS-BACKCOMPAT-DOMAIN

```yaml
section_id: "SEC-LS-BACKCOMPAT-DOMAIN"
anchorage:
  view: "decision"
  phase: "design"
  domain: ["ls", "backward-compat", "domain"]
occurrences:
  - occurrence_id: "OCC-LS-DOMAIN-001"
    role: "decision"
    entity_id: "IE-LS-DOMAIN-001"
entities:
  - entity_id: "IE-LS-DOMAIN-001"
    kind: "decision"
    content_lang: "ja-JP"
    content: |
      v0.1.3 では guides 探索のため、`ls --sections` の sections[] に domain: string[] を追加する。
      既存フィールドは変更せず、新フィールド追加のみとする（後方互換）。
```

### 追加するフィールド（推奨）
- `sections[].domain` = `section.anchorage.domain`

---

## SEC-DESCRIBE-ROUTING

```yaml
section_id: "SEC-DESCRIBE-ROUTING"
anchorage:
  view: "solution"
  phase: "design"
  domain: ["describe", "routing", "guides"]
occurrences:
  - occurrence_id: "OCC-DESCRIBE-ROUTING-001"
    role: "plan"
    entity_id: "IE-DESCRIBE-ROUTING-001"
entities:
  - entity_id: "IE-DESCRIBE-ROUTING-001"
    kind: "plan"
    content_lang: "ja-JP"
    content: |
      `describe routing` は、ツール適用範囲・非目標・併用（補完ツール）・推奨フローを返す。
      内部的には内蔵 guides から `domain` に routing を含む sections を抽出して再構成する。
      推奨探索順序は background → problem → decision → solution（必要時）とする。
```

### I/F（確定案）
```bash
ideamark describe routing [--lang <ja-JP|en-US|auto>] [--format json|md]
```

### 返す情報（最小）
- scope（overview / when_to_use）
- non_goals
- complementary_tools（例：FlowMark）
- recommended_flow（例：FlowMark → IdeaMark）
- discovery（entrypoints / selectors / fallback_search）

---

## SEC-TEST-PLAN-MIN

```yaml
section_id: "SEC-TEST-PLAN-MIN"
anchorage:
  view: "plan"
  phase: "design"
  domain: ["test", "smoke", "guides", "routing", "ls"]
occurrences:
  - occurrence_id: "OCC-TEST-PLAN-001"
    role: "plan"
    entity_id: "IE-TEST-PLAN-001"
entities:
  - entity_id: "IE-TEST-PLAN-001"
    kind: "plan"
    content_lang: "ja-JP"
    content: |
      v0.0.18 の目的は、内蔵 guides（en-US/ja-JP）を利用した describe ls / routing のスモークテストを
      実装と同時に回せるようにすること。まずは json 出力が安定して得られることを確認する。
```

### describe ls
```bash
ideamark describe ls --target guides --lang en-US --sections --format json
ideamark describe ls --target guides --lang ja-JP --sections --format json
ideamark describe ls --target guides --lang ja-JP --vocab --format json
```

### describe routing
```bash
ideamark describe routing --lang en-US --format json
ideamark describe routing --lang ja-JP --format json
```

---

## SEC-IMPLEMENTATION-TASKS

```yaml
section_id: "SEC-IMPLEMENTATION-TASKS"
anchorage:
  view: "plan"
  phase: "design"
  domain: ["implementation", "tasks", "v0.1.3"]
occurrences:
  - occurrence_id: "OCC-IMPL-001"
    role: "plan"
    entity_id: "IE-IMPL-001"
entities:
  - entity_id: "IE-IMPL-001"
    kind: "plan"
    content_lang: "ja-JP"
    content: |
      実装は段階的に進める。
      (1) describe capabilities を v1.0.3 に更新（topics/feature追加）
      (2) describe ls（builtin guides + lang切替 + lsルーチン再利用）
      (3) ls --sections の domain 追加（後方互換）
      (4) describe routing（builtin guides から抽出・再構成）
      (5) スモークテスト（SEC-TEST-PLAN-MIN）を自動化（最小でOK）
```

---

End of v0.0.18
