# 01 NASA Tech Brief Sample

このディレクトリは、以下ソースを IdeaMark v1.0.3 形式へ変換したサンプルと、その生成手順をまとめたものです。

- Source: `./nasa_tech_brief_19660000361_automated_drafting_system.md`
- Prompt: `./nasa_tech_brief_19660000361_automated_drafting_system.prompt.md`
- Output: `./nasa_tech_brief_19660000361_automated_drafting_system.ideamark.md`

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
- 並び順規約: `section -> そのsectionのoccurrences -> 次section`
- 人間向け本文規約: section/occurrence YAML 直後に自然言語本文を配置

## 2. プロンプト作成

`prompt-authoring` で得た規約を反映して、`*.prompt.md` を作成します。

このサンプルのプロンプトには以下を明記しています。
- 入出力ファイル（相対パス）
- 構造要件（Header / Section / Occurrence / Registry）
- 並び順要件（sectionローカル順）
- 本文要件（YAML-only禁止）
- 品質ゲート（strict validate）

## 3. IdeaMark 生成

プロンプトに従って `*.ideamark.md` を生成します。

生成時の方針:
- まず Section YAML を配置
- その直後に Section の自然言語説明
- その Section が持つ Occurrence YAML を `section.occurrences` の順で配置
- 各 Occurrence の直後に自然言語説明
- 最後に Registry YAML を配置

## 4. 検証

strict validation で整合性を確認します。

```bash
ideamark validate ./nasa_tech_brief_19660000361_automated_drafting_system.ideamark.md --mode strict
```

期待結果:
- `summary.ok: true`
- `error_count: 0`
- `warning_count: 0`

## 5. 構造確認（任意）

IDや語彙を一覧確認します。

```bash
ideamark ls ./nasa_tech_brief_19660000361_automated_drafting_system.ideamark.md \
  --sections --occurrences --entities --vocab --format md
```

## 6. 補足

- パス記述は移動しやすさのため、すべて相対パスに統一しています。
