# IdeaMark CLI v0.1.0 Background & Spec

<!---
  Machine-readable Document Header (required)
-->
```yaml
ideamark_version: 1
doc_id: "ideamark.cli.v0.1.0"
doc_type: "spec"
status: "draft"
created_at: "2026-02-14"
updated_at: "2026-02-14"
lang: "ja-JP"
domain: [ideamark, cli, tooling]
tags: [ideamark-cli, v0.1.0, extract, compose, describe, validate, guides]
refs:
  sources:
    - ref: "file:/mnt/data/ideamark-yaml-spec-v1.md"
      note: "IdeaMark YAML Specification v1"
    - ref: "file:/mnt/data/ideamark-document-spec-v1.md"
      note: "IdeaMark Document sample/spec"
```

## 概要

```yaml
section_id: SEC-001
anchorage:
  view: background
  phase: exploration
  domain: [ideamark, cli, guides]
```

IdeaMark CLI は、IdeaMark 形式（Markdown + fenced YAML）で書かれた文書から **セクション単位の抽出**と、複数セクションの **合成（compose）** を行うための基盤ツールである。

v0.1.0 の狙いは「上位ツール（例：FlowMark）から呼べる薄い基盤」を最短で成立させることにある。特に以下を満たす：

- `extract` / `compose` により、selector で機械的にガイド片を取り出せる
- `describe` により、LLM が **新しい IdeaMark 文書（guides など）を生成**するためのプロンプトを組み立てられる
- 必要最低限の `validate` により、運用時の破綻（参照切れ・欠落）を早期に検出できる

## v0.1.0 スコープ

```yaml
section_id: SEC-002
anchorage:
  view: background
  phase: decision
  domain: [ideamark, cli, scope]
```

### Must（v0.1.0で必ず実装）

- `ideamark extract sections`
- `ideamark compose`
- `ideamark describe`（LLM実行はしない。プロンプト生成のみ）
- `ideamark validate`（軽量チェック）

### Should（v0.1.0で可能なら）

- `ideamark guides import|list|update`（ローカルレジストリ）

### Not now（v0.2+）

- 高度なクエリ言語（括弧、NOT、正規表現、スコアリング）
- index DB（最初はファイル走査＋（将来）キャッシュ）
- breakdown / convergent / assist fill 系（別プロジェクト or v0.2+）

## CLI 全体仕様

```yaml
section_id: SEC-003
anchorage:
  view: spec
  phase: decision
  domain: [ideamark, cli, interface]
```

### コマンド一覧（v0.1.0）

- `ideamark extract sections`
- `ideamark compose`
- `ideamark describe`
- `ideamark validate`
- （任意）`ideamark guides import|list|update`

### 共通仕様

- 入力はファイルパス、または `--input -` による stdin
- 出力は `--out -` で stdout（デフォルトstdoutでもよい）
- エラーは非0終了コード＋標準エラーに短い説明を出す
- `--format md|json` はできるだけ全コマンドで統一する

## セクション境界の定義

```yaml
section_id: SEC-004
anchorage:
  view: spec
  phase: decision
  domain: [ideamark, parsing, sections]
```

v0.1.0 は安全運転として「決め打ちで安定する」境界定義を採用する。

### 文書ヘッダ（Document Header）

- Markdown内の fenced YAML のうち、最初に現れる `ideamark_version: 1` を含む YAML を「文書ヘッダ」とみなす

### セクション定義（Section YAML）

- fenced YAML のうち `section_id:` を含む YAML を「セクション定義」とみなす
- セクション本文は「その Section YAML ブロック直後から、次の Section YAML ブロック直前まで」
- 末尾の registry YAML（`sections:` / `structure:` 等）は v0.1.0 では **本文に含めない**（ただし `validate` では読む）

## selector 文法（v0.1.0）

```yaml
section_id: SEC-005
anchorage:
  view: spec
  phase: decision
  domain: [ideamark, selector]
```

### 方針

- AND がデフォルト
- 同一キー複数指定は OR（例：`phase=exploration phase=hypothesis`）
- v0.1.0 の selector は「完全な検索言語」ではなく「機械的に安定するフィルタ」

### サポートする条件

- `view=<value>`（セクション `anchorage.view` と一致）
- `phase=<value>`（`anchorage.phase` と一致、複数可）
- `domain~=a,b,c`（`anchorage.domain` にいずれかを含む）
- `doc_id=<id>`（文書ヘッダ `doc_id` と一致）
- `section_id=<id>`（セクションID一致）
- `limit=<n>`（CLI引数 `--limit` と同義でも可）

### 例

- `view=rules domain~=flowmark,guides phase=decision`
- `domain~=ideamark,cli view=spec`

## `ideamark extract sections` 仕様

```yaml
section_id: SEC-006
anchorage:
  view: spec
  phase: decision
  domain: [ideamark, cli, extract]
```

### 目的

IdeaMark 文書からセクションを抽出し、selector でフィルタして返す。

### 形式

```bash
ideamark extract sections \
  --input <path|-> \
  --select '<selector>' \
  --format md|json \
  --include-yaml section|none \
  --include-body true|false \
  --limit <n>
```

### 出力（md）

- 抽出したセクションを **そのまま Markdown 片**として返す
- `--include-yaml=section` の場合、Section YAML を含める
- `--include-yaml=none` の場合、本文のみ

### 出力（json）最小形

```json
{
  "doc": { "doc_id": "...", "path": "...", "header": { } },
  "sections": [
    {
      "section_id": "SEC-001",
      "anchorage": { "view": "background", "phase": "exploration", "domain": ["..."] },
      "range": { "start_line": 1, "end_line": 42 },
      "markdown": "...",
      "yaml": { }
    }
  ]
}
```

## `ideamark compose` 仕様

```yaml
section_id: SEC-007
anchorage:
  view: spec
  phase: decision
  domain: [ideamark, cli, compose]
```

### 目的

selector に合致するセクションを、既定順で並べて 1つの出力にする。必要なら provenance を付与する。

### 形式

```bash
ideamark compose \
  --inputs <path>... \
  --select '<selector>' \
  --format md|json \
  --with-provenance \
  --provenance-style frontmatter|footer|both \
  --sort default|structure|file|timestamp
```

### 並び順（sort）

- `default`：`structure.sections` があればそれ優先、なければファイル内出現順
- `structure`：`structure.sections` の順のみ使用
- `file`：入力ファイル順→出現順
- `timestamp`：`sections.<id>.timestamp_range.from` 等があればそれ、なければ fallback

### provenance（md）

- `frontmatter`：出力先頭に YAML frontmatter を追加
- `footer`：出力末尾に箇条書きで付与
- `both`：両方

## `ideamark describe` 仕様

```yaml
section_id: SEC-008
anchorage:
  view: spec
  phase: decision
  domain: [ideamark, cli, describe, llm]
```

### 目的

LLM が新しい IdeaMark 文書（guides 等）を生成するための **プロンプト（指示書）を生成**する。

- describe 自体は LLM を呼ばない（v0.1.0 方針）
- `compose` を内部で呼び、Materials を束ねて差し込む

### 形式

```bash
ideamark describe \
  --inputs <path>... \
  --select '<selector>' \
  --goal guides.flowmark|guides.ideamark|spec.cli \
  --format md|json \
  --out <path|-> \
  --with-provenance
```

### goal（v0.1.0）

- `guides.flowmark`：FlowMark用ガイド（`domain~=flowmark,guides`）生成指示
- `guides.ideamark`：一般的な IdeaMark 文書を作るためのガイド生成指示（汎用）
- `spec.cli`：CLI 仕様文書の生成指示（ブートストラップ）

### 実装メモ

- built-in テンプレ（goalごと）を読み込む
- `{{COMPOSED_MATERIALS}}` を `compose` の結果で置換
- `format=json` は OpenAI/任意 LLM 実行器が食べやすい `messages` 形に変換する

## `ideamark validate` 仕様（軽量）

```yaml
section_id: SEC-009
anchorage:
  view: spec
  phase: decision
  domain: [ideamark, cli, validate]
```

### 目的

運用前に「最低限の破綻」を検出する。

### 形式

```bash
ideamark validate --input <path>
```

### チェック（v0.1.0）

- Document Header 必須キーの存在：
  - `ideamark_version, doc_id, doc_type, status, created_at, updated_at, lang`
- registry の参照整合（存在する `section_id` か）：
  - `sections` / `structure.sections`
- （可能なら）Occurrence/Entity の `ref` 解決（警告でも可）

## `ideamark guides`（任意）

```yaml
section_id: SEC-010
anchorage:
  view: spec
  phase: exploration
  domain: [ideamark, cli, guides]
```

### 目的

FlowMark 等の上位ツールが「保存場所を意識せず」ガイドを利用できるようにする。

### 形式（案）

```bash
ideamark guides import <path|uri> [--name <id>]
ideamark guides list
ideamark guides update [--name <id>|--all]
```

### 保存先（案）

- `~/.ideamark/guides/<name>/...`
- `manifest.json` に取得元・更新日時・doc_id一覧を保存

## エラーコード方針

```yaml
section_id: SEC-011
anchorage:
  view: spec
  phase: decision
  domain: [ideamark, cli, errors]
```

v0.1.0 は単純に以下を推奨する。

- `0`：成功
- `1`：一般エラー（引数不正、I/O、パース失敗など）
- `2`：validate 失敗（致命）
- `3`：selector 解釈失敗

（将来拡張：細分化する場合も上位互換を守る）

## テスト方針（v0.1.0）

```yaml
section_id: SEC-012
anchorage:
  view: spec
  phase: decision
  domain: [ideamark, cli, test]
```

- golden file（入力→出力）中心
- fixtures：
  - 最小文書（header + 2 sections）
  - registry を含む文書
  - セクションYAMLが連続する文書（本文空）
  - 壊れたYAML（validateで検出）

## Non-goals（v0.1.0）

```yaml
section_id: SEC-013
anchorage:
  view: constraints
  phase: decision
  domain: [ideamark, cli, scope]
```

- 文書の意味理解、要約、推論
- Entity/Ocurrence の高度なグラフ処理
- IDE統合やUI

## Open Questions

```yaml
section_id: SEC-014
anchorage:
  view: hypothesis
  phase: hypothesis
  domain: [ideamark, cli, roadmap]
```

- registry YAML の位置（文末固定か、複数許すか）
- `ref` の形式（`doc_id#ie_id` に加え URL/URN をどこまで許すか）
- selector の拡張（NOT / 優先順位 / 正規表現）

---

<!---
  Minimal Registry (recommended)
-->
```yaml
sections:
  SEC-001: { title: "概要" }
  SEC-002: { title: "v0.1.0 スコープ" }
  SEC-003: { title: "CLI 全体仕様" }
  SEC-004: { title: "セクション境界の定義" }
  SEC-005: { title: "selector 文法（v0.1.0）" }
  SEC-006: { title: "`ideamark extract sections` 仕様" }
  SEC-007: { title: "`ideamark compose` 仕様" }
  SEC-008: { title: "`ideamark describe` 仕様" }
  SEC-009: { title: "`ideamark validate` 仕様（軽量）" }
  SEC-010: { title: "`ideamark guides`（任意）" }
  SEC-011: { title: "エラーコード方針" }
  SEC-012: { title: "テスト方針（v0.1.0）" }
  SEC-013: { title: "Non-goals（v0.1.0）" }
  SEC-014: { title: "Open Questions" }

structure:
  sections:
    - SEC-001
    - SEC-002
    - SEC-003
    - SEC-004
    - SEC-005
    - SEC-006
    - SEC-007
    - SEC-008
    - SEC-009
    - SEC-010
    - SEC-011
    - SEC-012
    - SEC-013
    - SEC-014
```
