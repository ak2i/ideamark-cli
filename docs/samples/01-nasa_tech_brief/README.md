# 01 NASA Tech Brief Sample

このディレクトリは、以下ソースを IdeaMark v1.1.1 YAML-first 形式へ変換したサンプルと、その生成手順をまとめたものです。

- Source: `./nasa_tech_brief_19660000361_automated_drafting_system.md`
- Prompt: `./nasa_tech_brief_19660000361_automated_drafting_system.prompt.md`
- Output: `./nasa_tech_brief_19660000361_automated_drafting_system.ideamark.yaml`

## 1. ガイド要素の取得（describe）

`ideamark describe` で、プロンプト生成に必要な規約を取得します。

```bash
ideamark describe prompt-authoring --format json --audience ai --model large --lang en-US
ideamark describe ai-authoring --format json --audience ai --model large --lang en-US
ideamark describe params --format json --audience ai --model large --lang en-US
ideamark describe checklist --format md --audience ai --model large --lang en-US
ideamark describe vocab --format md --audience ai --model large --lang en-US
```

使う要点:
- strict 必須ヘッダ（`ideamark_version`, `doc_id`, `doc_type`, `status`, `created_at`, `updated_at`, `lang`）
- `entities`, `occurrences`, `sections`, `relations`, `perspectives`, `structure` を top-level に置く
- `payload.body / payload.ref / payload.cache` のいずれかを各 entity に持たせる
- 参照整合（entity/occurrence/section の解決）

## 2. プロンプト作成

`prompt-authoring` で得た規約を反映して、`*.prompt.md` を作成します。

このサンプルのプロンプトには以下を明記しています。
- 入出力ファイル（相対パス）
- 構造要件（top-level `entities / occurrences / sections`）
- payload 要件
- 参照整合要件
- 品質ゲート（strict validate）

## 3. IdeaMark 生成

プロンプトに従って `*.ideamark.yaml` を生成します。

生成時の方針:
- Markdown 埋め込み IdeaMark (`*.ideamark.md`) は使わない
- `registry:` キーで包まず、top-level に namespace を置く
- `relations: {}` と `perspectives: {}` も明示する

## 4. 検証

strict validation で整合性を確認します。

```bash
ideamark validate ./nasa_tech_brief_19660000361_automated_drafting_system.ideamark.yaml --mode working
ideamark validate ./nasa_tech_brief_19660000361_automated_drafting_system.ideamark.yaml --mode strict
```

期待結果:
- `summary.ok: true`
- `error_count: 0`
- `warning_count: 0`

## 5. 構造確認（任意）

IDや語彙を一覧確認します。

```bash
ideamark ls ./nasa_tech_brief_19660000361_automated_drafting_system.ideamark.yaml \
  --sections --occurrences --entities --vocab --format md
```

## 6. 補足

- `nasa_tech_brief_19660000361_automated_drafting_system.ideamark.md` は旧 v1.0.3 / Markdown 埋め込み系の履歴として残っていますが、現行テスト対象ではありません。
- パス記述は移動しやすさのため、すべて相対パスに統一しています。
