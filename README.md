# ideamark-cli

Command-line tools for validating and working with IdeaMark YAML documents on the `v0.3.0` track.  
The current implementation targets IdeaMark Core `v1.1.1` and Doc CLI Contract `v1.1.1`.

## Installation

```bash
npm install -g ideamark-cli
ideamark --version
ideamark --help
```

For npm package registration and release steps, see:

- [docs/dev/v0.3.0/npm-publishing.md](docs/dev/v0.3.0/npm-publishing.md)

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
ideamark ls [<infile>|-] [--sections] [--occurrences] [--entities] [--vocab] [--format json|md]
```

## Minimal v1.1.1 example

```yaml
ideamark_version: "1.1.1"
doc_id: "DOC-EXAMPLE-1"
doc_type: "derived"
status:
  state: "in_progress"
created_at: "2026-06-19T00:00:00Z"
updated_at: "2026-06-19T00:00:00Z"
lang: "en-US"
entities:
  IE-EXAMPLE:
    kind: "observation"
    payload:
      body: "Example content"
      format:
        media_type: "text/plain"
    atomicity_basis: "interpretive"
occurrences:
  OCC-EXAMPLE:
    entity: "IE-EXAMPLE"
    role: "observation"
sections:
  SEC-EXAMPLE:
    occurrences: ["OCC-EXAMPLE"]
relations: {}
perspectives: {}
structure:
  sections: ["SEC-EXAMPLE"]
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

See `tests/README.md`.

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
- Markdown 埋め込み型の旧 `*.ideamark.md` は現行の生成対象ではありません。`v0.3.0` では `*.ideamark.yaml` の YAML-first 形式を使ってください。
