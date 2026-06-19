# ChatGPT Conversion Template

このディレクトリは、外部で入手したテキストを ChatGPT に渡して IdeaMark v1.1.1 YAML へ変換するための最小テンプレートです。

## Recommended describe commands

まず `ideamark describe` で変換ルールを取得します。

```bash
ideamark describe prompt-authoring --format json --audience ai --model large --lang ja-JP > describe.prompt-authoring.json
ideamark describe ai-authoring --format json --audience ai --model large --lang ja-JP > describe.ai-authoring.json
ideamark describe params --format json --audience ai --model large --lang ja-JP > describe.params.json
ideamark describe checklist --format md --audience ai --model large --lang ja-JP > describe.checklist.md
ideamark describe vocab --format md --audience ai --model large --lang ja-JP > describe.vocab.md
```

用途:
- `prompt-authoring.json`: ChatGPT に渡す変換指示の骨格
- `ai-authoring.json`: 生成時の基本方針
- `params.json`: required / optional と payload ルール
- `checklist.md`: 自己点検用
- `vocab.md`: `role` / `kind` / `atomicity_basis` の候補確認用

## Prompt template

実際に ChatGPT へ貼るときは [chatgpt-conversion-prompt-template.md](./chatgpt-conversion-prompt-template.md) を使います。

手で埋め込む代わりに、補助スクリプトで自動生成することもできます。

```bash
npm run build:chatgpt-prompt -- \
  --source ./tmp/source.txt \
  --output ./tmp/chatgpt-prompt.md \
  --lang ja-JP \
  --target-file output.ideamark.yaml \
  --artifacts-dir ./tmp/describe
```

出力:
- `./tmp/chatgpt-prompt.md`: ChatGPT に貼る完成済み prompt
- `./tmp/describe/describe.*`: 埋め込み元の describe 出力

## Important notes

- 現行の `ideamark-cli v0.2.0` では `entities`, `occurrences`, `sections` は top-level に置きます。
- `registry:` の下に `entities:` を入れると validate で空文書扱いになります。
- ChatGPT に「添付ファイルで返す」よう指示できますが、実際に添付できるかは利用中の ChatGPT 環境に依存します。
- 添付できない場合の fallback として、`yaml` コードブロック 1 つだけを返すよう指示しています。

## Validation flow

生成後は必ず検証します。

```bash
ideamark validate ./output.ideamark.yaml --mode working
ideamark validate ./output.ideamark.yaml --mode strict
```

必要なら正規化も行います。

```bash
ideamark format ./output.ideamark.yaml --canonical -o ./output.formatted.ideamark.yaml
```
