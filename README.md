# ideamark-cli

Command-line tools for working with IdeaMark documents on the `v0.2.0` track.  
The current implementation is being aligned to IdeaMark Core `v1.1.1`.

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
