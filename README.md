# ideamark-cli

Command-line tools for working with IdeaMark documents (v0.1.0). The CLI can validate, format, extract, compose, and publish IdeaMark documents, and provides a self-describing `describe` command.

## Commands (v0.1.0)

- `validate`
- `format`
- `extract`
- `compose`
- `publish`
- `describe`

## Usage

### validate

```bash
ideamark validate [<infile>|-] [--strict] [--fail-on-warn] [--mode working|strict]
```

- Reads from stdin if `<infile>` is omitted or `-`.
- Outputs NDJSON diagnostics to stdout.
- Exit codes: `0` success, `1` validation failure, `2` usage error.

### format

```bash
ideamark format [<infile>|-] [-o <outfile>|-] [--canonical] [--diagnostics <path|->]
```

- Formats an IdeaMark document.
- `--canonical` normalizes references to canonical `ideamark://` URIs.
- Outputs the formatted document to stdout (or `-o`).
- Diagnostics go to stderr by default (or `--diagnostics`).

### extract

```bash
ideamark extract [<infile>|-] [-o <outfile>|-] (--section <SEC_ID> | --occ <OCC_ID>) [--diagnostics <path|->]
```

- Extracts a section or occurrence and its closure into a new document.
- Output has a new `doc_id`.
- Diagnostics go to stderr by default (or `--diagnostics`).

### compose

```bash
ideamark compose <fileA> <fileB> [<fileN>...] [-o <outfile>|-]
                [--update --base <basefile>] [--doc-id <DOC_ID>] [--inherit none|first|base]
                [--diagnostics <path|->]
```

- Merges multiple documents by union (no semantic dedupe).
- On ID conflicts, renames with aliases and retargets references.
- Diagnostics go to stderr by default (or `--diagnostics`).

### publish

```bash
ideamark publish [<infile>|-] [-o <outfile>|-] [--diagnostics <path|->]
```

- Pipeline: `format --canonical` -> `validate --strict`.
- On success, updates `updated_at` and sets `status.state=published` (if present).
- On strict failure, outputs diagnostics only and exits `1` (no artifact output).

### describe

```bash
ideamark describe <topic> [--format json|yaml|md]
```

Topics:
- `checklist`
- `vocab`
- `capabilities`

## I/O conventions

- `<infile>` omitted or `-` means stdin.
- `-o -` means stdout.
- `validate` writes diagnostics to stdout.
- Other commands write artifacts to stdout and diagnostics to stderr (or `--diagnostics`).

## Exit codes

1. `0` success (no error diagnostics)
2. `1` failure (validation/strict error or command failure)
3. `2` usage error (invalid arguments)

## Minimal strict-valid example

```markdown
---
ideamark_version: 1
doc_id: "DOC-EXAMPLE-1"
doc_type: "derived"
status:
  state: "in_progress"
created_at: "2026-02-20"
updated_at: "2026-02-20"
lang: "en"
---

## SEC-EXAMPLE
```yaml
section_id: "SEC-EXAMPLE"
anchorage:
  view: "design"
  phase: "implementation"
occurrences: ["OCC-EXAMPLE"]
```

```yaml
occurrence_id: "OCC-EXAMPLE"
entity: "IE-EXAMPLE"
role: "observation"
status:
  state: "confirmed"
```

## Registry
```yaml
entities:
  IE-EXAMPLE:
    kind: "observation"
    content: "Example content"
occurrences:
  OCC-EXAMPLE:
    entity: "IE-EXAMPLE"
    role: "observation"
    status: { state: "confirmed" }
sections:
  SEC-EXAMPLE:
    anchorage: { view: "design", phase: "implementation" }
    occurrences: ["OCC-EXAMPLE"]
structure:
  sections: ["SEC-EXAMPLE"]
```
```

Validate it:

```bash
ideamark validate --strict example.ideamark.md
```

## Publish example (canonical refs)

Input (working):\n
```markdown
```yaml
occurrence_id: "OCC-1"
entity: "IE-1"
target: "IE-2"
supporting_evidence: ["IE-3"]
derived_from:
  - entity: "IE-4"
```
```

After `ideamark publish`, the references are canonicalized:

```yaml
occurrence_id: "OCC-1"
entity: "ideamark://docs/<doc_id>#/entities/IE-1"
target: "ideamark://docs/<doc_id>#/entities/IE-2"
supporting_evidence:
  - "ideamark://docs/<doc_id>#/entities/IE-3"
derived_from:
  - entity: "ideamark://docs/<doc_id>#/entities/IE-4"
```

## Installation

Local install (repo):\n
```bash
npm install
npm link
```

Global install (published package):\n
```bash
npm install -g ideamark-cli
```

## Tests

See `tests/README.md` for smoke and internal tests.

## Release Notes

See `docs/release/v0.1.0.md`.
