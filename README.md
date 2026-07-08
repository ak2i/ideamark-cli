# ideamark-cli

Command-line tools for working with IdeaMark Core `v1.2.0` documents.
The current package version is `0.3.1` with additive Skeleton Graph discovery/basic validation (`skeletons`) and retrieval fixture support.

## Installation

The npm package is published as `@ideamark/core-cli`. The installed command is `ideamark`.

```bash
npm install -g @ideamark/core-cli
ideamark --version
ideamark describe capabilities --format json
```

## Package / command names

| Role | Name |
| --- | --- |
| npm package | `@ideamark/core-cli` |
| CLI command | `ideamark` |
| tool.name | `ideamark-cli` |
| document.name | `ideamark` |

## Commands

- `validate`
- `lint`
- `diff`
- `format`
- `extract`
- `compose`
- `publish`
- `describe`
- `ls`

## Usage

### validate

```bash
ideamark validate [<infile>|-] [--strict] [--fail-on-warn] [--mode working|strict] \
  [--emit-evidence yaml|ndjson] [--evidence-scope document|section|entity|occurrence] \
  [--evidence-target <id>] [--attach <file|->] [--artifact-out <path>]
```

- Reads from stdin if `<infile>` is omitted or `-`.
- Outputs NDJSON diagnostics to stdout.
- Validates structure, references, and entity payload requirements.
- Does not validate payload meaning, external profile semantics, or URI reachability.

### lint

```bash
ideamark lint [<infile>|-] [--format ndjson|json|md] [--strict] [--profile minimal|diagnostic|strict]
```

- Default is non-blocking.
- `--strict` fails on error-level diagnostics.

### diff

```bash
ideamark diff <from> <to> [--format ndjson|json|md] [--scope yaml|all] [--include-markdown] [--include-meta]
```

- Default scope is YAML-first.
- Compares `entities`, `occurrences`, `sections`, `relations`, `perspectives`, and `structure`.

### format

```bash
ideamark format [<infile>|-] [-o <outfile>|-] [--canonical] [--diagnostics <path|->]
```

### extract

```bash
ideamark extract [<infile>|-] [-o <outfile>|-] (--section <SEC_ID> | --occ <OCC_ID>) [--diagnostics <path|->]
```

### compose

```bash
ideamark compose <fileA> <fileB> [<fileN>...] [-o <outfile>|-]
                [--update --base <basefile>] [--doc-id <DOC_ID>] [--inherit none|first|base]
                [--preserve-markdown] [--diagnostics <path|->]
```

### publish

```bash
ideamark publish [<infile>|-] [-o <outfile>|-] [--diagnostics <path|->]
```

### describe

```bash
ideamark describe <topic> [--format json|yaml|md] [--audience human|ai] [--lang ja|en|ja-JP|en-US] [--model small|large] [--profile <alias>]
ideamark describe ls --target guides [--sections] [--vocab] [--format json|yaml|md]
ideamark describe routing [--format json|yaml|md]
```

Topics:
- `checklist`
- `vocab`
- `capabilities`
- `ai-authoring`
- `prompt-authoring`
- `params`
- `ls`
- `routing`

### ls

```bash
ideamark ls [<infile>|-] [--sources] [--sections] [--occurrences] [--entities] [--skeletons] [--vocab] [--format json|md]
```

## Minimal v1.2.0 example

```yaml
meta:
  spec_version: ideamark-core-v1.2.0
  document_id: doc-example-1
  status: draft
sources:
  - id: src-1
    type: document
    title: Example source
sections:
  - id: sec-1
    title: Example
    occurrences: [occ-1]
occurrences:
  - id: occ-1
    entity: ent-1
    role: observation
entities:
  - id: ent-1
    kind: observation
    content: Example content
```

Validate it:

```bash
ideamark validate --strict example.ideamark.yaml
```

## I/O conventions

- `<infile>` omitted or `-` means stdin.
- `-o -` means stdout.
- `validate` writes diagnostics to stdout.
- `validate` writes diagnostics to stderr when `--emit-evidence` or `--attach` is used.
- Other commands write artifacts to stdout and diagnostics to stderr unless redirected.

## Exit codes

1. `0` success
2. `1` validation/strict failure or command failure
3. `2` usage error

## Tests

See `tests/README.md`. v0.3.1 also includes `npm run retrieval:v0.3.1` for structural Skeleton Graph fixture matching; it is not a retrieval engine or reconstruction-quality evaluator.

## Public samples

公開サンプルは `docs/samples/` に置いています。小さめの YAML-first サンプルとして次があります。

- [docs/samples/04-rfc3986-uri-overview/README.md](docs/samples/04-rfc3986-uri-overview/README.md)
- [docs/samples/04-rfc3986-uri-overview/rfc3986-uri-overview-sample.ideamark.yaml](docs/samples/04-rfc3986-uri-overview/rfc3986-uri-overview-sample.ideamark.yaml)

## ChatGPT workflow

外部テキストを ChatGPT に渡して IdeaMark YAML へ変換したい場合は、まず `describe` で変換規約を取得します。

```bash
ideamark describe prompt-authoring --format json --audience ai --model large --lang ja-JP
ideamark describe ai-authoring --format json --audience ai --model large --lang ja-JP
ideamark describe params --format json --audience ai --model large --lang ja-JP
ideamark describe checklist --format md --audience ai --model large --lang ja-JP
ideamark describe vocab --format md --audience ai --model large --lang ja-JP
```

実際に ChatGPT へ貼るための雛形は次を参照してください。

- [docs/samples/00-chatgpt-conversion-template/README.md](docs/samples/00-chatgpt-conversion-template/README.md)
- [docs/samples/00-chatgpt-conversion-template/chatgpt-conversion-prompt-template.md](docs/samples/00-chatgpt-conversion-template/chatgpt-conversion-prompt-template.md)

補助スクリプトで prompt を自動生成することもできます。

```bash
npm run build:chatgpt-prompt -- \
  --source ./tmp/source.txt \
  --output ./tmp/chatgpt-prompt.md \
  --lang ja-JP \
  --target-file output.ideamark.yaml \
  --artifacts-dir ./tmp/describe
```

注意:
- 現行の生成指示は `entities`, `occurrences`, `sections` を top-level に置く前提です。
- `registry:` で包むと `validate` が期待どおりに解釈しません。
- Markdown 埋め込み型の旧 `*.ideamark.md` は現行の生成対象ではありません。
