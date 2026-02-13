# ideamark-cli

Command Line Interface for IdeaMark v0.1.0.

## Install (npm)

```bash
npm install -g ideamark-cli
```

## Usage

```bash
ideamark extract sections --input docs/dev/v0.1.0/examples/fixtures/fixture.min.ideamark.md \
  --select 'view=rules domain~=flowmark,guides' \
  --format md

ideamark compose --inputs docs/dev/v0.1.0/examples/fixtures/fixture.min.ideamark.md \
  --select 'view=background view=rules' \
  --with-provenance

ideamark describe --inputs docs/dev/v0.1.0/examples/fixtures/fixture.min.ideamark.md \
  --select 'view=background view=rules' \
  --goal guides.flowmark \
  --format md

ideamark validate --input docs/dev/v0.1.0/examples/fixtures/fixture.min.ideamark.md
cat docs/dev/v0.1.0/examples/fixtures/fixture.min.ideamark.md | ideamark validate --input -
```

## Options

- `--input <path|->`
- `--inputs <path>...`
- `--select <selector>`
- `--format md|json`
- `--include-yaml section|none`
- `--include-body true|false`
- `--limit <n>`
- `--with-provenance`
- `--provenance-style frontmatter|footer|both`
- `--sort default|structure|file|timestamp`
- `--goal guides.flowmark|guides.ideamark|spec.cli`
- `--out <path|->`
- `--version`
- `--help`

## npm pack (Publish Check)

```bash
npm pack
# verify files
# tar -tf ideamark-cli-0.1.0.tgz
```

Ensure `bin/`, `src/`, `docs/dev/v0.1.0/internal/goals/`, `README.md`, and `LICENSE` are included.
