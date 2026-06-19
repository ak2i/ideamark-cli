# 01 NASA Tech Brief Sample

このディレクトリは、以下ソースを IdeaMark v1.1.1 の YAML-based 形式へ変換したサンプルと、その生成手順をまとめたものです。

- Source: `./nasa_tech_brief_19660000361_automated_drafting_system.md`
- Prompt: `./nasa_tech_brief_19660000361_automated_drafting_system.prompt.md`
- Output: `./nasa_tech_brief_19660000361_automated_drafting_system.ideamark.yaml`

## 1. ガイド要素の取得（describe）

`ideamark describe` で、プロンプト生成に必要な規約を取得します。

```bash
ideamark describe prompt-authoring --format md
ideamark describe ai-authoring --format md
ideamark describe checklist --format md
ideamark describe vocab --format md
```

使う要点:
- strict 必須ヘッダ（`ideamark_version`, `doc_id`, `doc_type`, `status`, `created_at`, `updated_at`, `lang`）
- 参照整合（entity/occurrence/section の解決）
- 必須構造（`entities`, `occurrences`, `sections`）
- payload 規約（`body` / `ref` / `cache` のいずれか）

## 2. プロンプト作成

`prompt-authoring` で得た規約を反映して、`*.prompt.md` を作成します。

このサンプルのプロンプトには以下を明記しています。
- 入出力ファイル（相対パス）
- 構造要件（Header / `entities` / `occurrences` / `sections`）
- payload 要件
- 品質ゲート（strict validate）

## 3. IdeaMark 生成

プロンプトに従って `*.ideamark.yaml` を生成します。

生成時の方針:
- whole-document YAML を 1 文書として生成
- `entities` / `occurrences` / `sections` を必ず含める
- local reference を解決可能なまま保つ
- 必要に応じて `structure.sections` を付与する

## 4. 検証

strict validation で整合性を確認します。

```bash
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

- パス記述は移動しやすさのため、すべて相対パスに統一しています。
- 旧 `.ideamark.md` 版は廃止し、この sample の公開形式は `.ideamark.yaml` に統一しています。
