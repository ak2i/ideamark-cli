# Repository Guidelines for Codex (ideamark-cli)

This repository implements ideamark-cli as a Node.js package.
Goal: publish to npm and use as a global CLI via `npm install -g`.

## Reference Implementation (FlowMark-core)
Follow the structure and conventions used in FlowMark-core:
- bin/ + src/ layout
- CLI entry under bin/
- npm pack sanity check
(See FlowMark-core README and repo layout.) :contentReference[oaicite:1]{index=1}

## Source of Truth (must read first)
1) docs/dev/v0.1.0/codex/handoff.md
2) docs/dev/v0.1.0/docs/ideamark-cli.v0.1.0.ideamark.md
3) docs/specs/ideamark-yaml-spec-v1.md
4) docs/specs/ideamark-document-spec-v1.md

## Scope (v0.1.0)
Implement ONLY:
- `ideamark extract sections`
- `ideamark compose`
- `ideamark describe` (prompt generation only; DO NOT call any LLM)
- `ideamark validate` (lightweight checks)

Optional (only if easy; still v0.1.0):
- `ideamark guides import|list|update`

Out of scope (v0.2+):
- Advanced query language (NOT, parentheses, regex, scoring)
- Index DB / search engine
- breakdown / convergent / assist-fill
- Network calls

## Node Packaging Requirements (must)
- Provide a CLI entrypoint in `bin/ideamark.js` (or `bin/ideamark`).
- Configure `package.json` with `"bin": { "ideamark": "bin/ideamark.js" }`.
- Keep implementation in `src/`.
- `npm pack` output must include: `bin/`, `src/`, `README.md`, `LICENSE`
  (same publish check style as FlowMark-core). :contentReference[oaicite:2]{index=2}

## Fixed Parsing Rules (v0.1.0)
- Document Header: first fenced YAML block containing `ideamark_version: 1`
- Section YAML: fenced YAML block containing `section_id:`
- Section body: after Section YAML until before next Section YAML
- Registry YAML (sections/structure) is NOT part of section body
  - validate may read it for consistency checks
YAML must be parsed only inside fenced blocks.

## Selector Semantics (v0.1.0)
- AND by default
- Same key repeated = OR (e.g. `phase=exploration phase=hypothesis`)
- `domain~=a,b,c` => anchorage.domain contains ANY of [a,b,c]
- Missing fields => NOT MATCH (safe default)

Supported keys:
- view, phase, domain~=, doc_id, section_id, limit

## Built-in Templates (describe)
Goal templates live under:
- docs/dev/v0.1.0/internal/goals/*.md

`ideamark describe` must:
- run internal compose to build materials (md)
- replace `{{COMPOSED_MATERIALS}}` in the template
- output:
  - `--format md`: a single prompt markdown
  - `--format json`: `{ "messages": [...], "meta": {...} }`

## Tests (must-have)
Use golden tests with fixtures:
- docs/dev/v0.1.0/examples/fixtures/*

At minimum, test:
- extract: selector filters correctly; md/json formats
- compose: order + provenance; md/json formats
- describe: template replacement works; md/json formats
- validate: detects broken YAML fixture as failure

## Deliverables
- Node CLI implementation (parser, selector, commands, io, templates)
- README with usage examples
- Tests passing locally
