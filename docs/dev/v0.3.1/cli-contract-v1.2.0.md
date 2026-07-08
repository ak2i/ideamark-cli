# IdeaMark CLI Contract — draft for IdeaMark Core v1.2.0

**Contract version:** `1.2.0-draft.2`  
**Tool version:** ideamark-cli v0.3.1  
**Status:** Phase 0 draft

## 0. How this contract stays small

IdeaMark Core v1.2.0 (Part 4) is a long specification. This contract deliberately does
NOT restate it. Responsibilities are split across three documents, each with stable
identifiers, so the contract itself only defines the command surface:

| Concern | Document | Stable identifier |
| --- | --- | --- |
| What is checked, at which severity, in which mode | [`validation-checklist.md`](./validation-checklist.md) | Rule IDs (`LOAD-01` … `NUL-01`) |
| How findings are named and reported | [`diagnostic-codes.md`](./diagnostic-codes.md) | Diagnostic codes (`snake_case`) |
| How commands are invoked and what they emit | this document | Command + flag names, envelope schema |
| Document format semantics | Part 4 (`docs/specs/V1.2.0/part4-core-specification/`) | Chapter numbers (§) |

Rule of thumb: if a question is "is this document valid?" the answer lives in the
checklist; if it is "what does the tool print / return?" the answer lives here.
Diagnostics link the layers: every diagnostic record carries both its `code` and its
checklist `rule`, and the checklist maps each rule to a Part 4 chapter. A consumer can
therefore trace tool output back to the normative spec without this contract
duplicating either.

Anything not specified in these three documents (message wording, warning order,
internal representation) is implementation detail and may change between patch
releases.

## 1. Scope

Commands in v0.3.1 scope: `validate`, `format`, `migrate`, `ls`, `describe`,
`--version`. Documents are IdeaMark Core v1.2.0 YAML documents
(`.ideamark.yaml` / `.ideamark.yml`); v1.1.x `.ideamark.md` documents are accepted
only by `migrate`.

`extract`, `compose`, `publish`, `diff`, and `lint` remain in the executable but fail
with `unsupported_for_spec` (exit 1) when given v1.2.0 input. Their v1.2.0 redesign is
deferred to v0.3.1+.

## 2. Common invocation conventions

- **Input**: positional `<infile>`, or `-` / omitted for stdin. Encoding is UTF-8 (LOAD-03).
- **Output**: `-o <outfile>`, or `-` / omitted for stdout. Document output goes to
  stdout; diagnostics go to stderr, unless a command below says otherwise.
- **Diagnostics stream override**: `--diagnostics <stderr|stdout|FILE>` on
  document-emitting commands (`format`, `migrate`).
- **Exit codes** (all commands):
  - `0` — success (no errors; warnings allowed unless `--fail-on-warn`)
  - `1` — validation errors, processing failure, or unsupported input
  - `2` — usage error (unknown command, flag, or flag value)
- Unknown flags are usage errors, never silently ignored.
- No network access, ever. No source URI is dereferenced (§13.14).

## 3. Diagnostic envelope (NDJSON)

All machine-readable diagnostics use one NDJSON stream: a `meta` record, zero or more
`diagnostic` records, then a `summary` record.

```json
{"kind":"meta","tool":"ideamark-cli","tool_version":"0.3.1","contract_version":"1.2.0-draft.2","command":"validate","mode":"core","spec_version_detected":"ideamark-core-v1.2.0","input":"path/or/-"}
{"kind":"diagnostic","severity":"warning","code":"placeholder_object","rule":"ENT-06","message":"entity has none of content/payload/ref; if intentional, mark it with status: draft","path":"entities[3]","object_id":"ent-004","field":null}
{"kind":"summary","ok":true,"errors":0,"warnings":1,"infos":0}
```

Field requirements for `diagnostic` records (§13.13 alignment):

| Field | Required | Meaning |
| --- | --- | --- |
| `severity` | yes | `error` / `warning` / `info` |
| `code` | yes | Registered code from `diagnostic-codes.md` |
| `rule` | yes | Checklist rule ID (traceability to Part 4) |
| `message` | yes | Human-readable; wording not contract-stable |
| `path` | yes | Namespace path, e.g. `occurrences[2].entity` (`null` only for document-level findings) |
| `object_id` | when known | `id` of the owning Core object |
| `field` | when known | Offending field name |

Consumers MUST tolerate additional fields (the envelope is open for extension).

`ok` in `summary` is `errors == 0`, and additionally `warnings == 0` when
`--fail-on-warn` is active.

## 4. Validation modes

| Mode | Meaning |
| --- | --- |
| `core` (default) | Part 4 Core mode. Errors per checklist; open vocabularies and placeholders warn |
| `strict` | Core plus the D8 promotion set (checklist §11). For exchange pipelines and tests |

Orthogonal switches:

- `--fail-on-warn` — exit 1 when warnings remain (works in both modes; this is the
  middle rung between `core` and `strict`)
- `--info` — emit `info` diagnostics (suppressed by default in every mode)
- `--allow-unsupported-spec` — downgrade `spec_version_unsupported` from error to
  warning (D7). Validation then proceeds on a best-effort v1.2.0 reading

## 5. Commands

### 5.1 `ideamark validate`

```
ideamark validate [<infile>|-] [--mode core|strict] [--fail-on-warn] [--info]
                  [--allow-unsupported-spec]
```

- Emits the diagnostic envelope on **stdout** (validate's product IS the diagnostics).
- Exit: `0` ok / `1` errors (or warnings with `--fail-on-warn`) / `2` usage.
- Never mutates input. Never dereferences sources.
- v1.1.x input → single `legacy_document_detected` error naming `ideamark migrate`.
- The v0.2.0 flags `--strict` (alias for `--mode strict`) is kept; the old `working`
  mode name is removed. Evidence flags (`--emit-evidence` etc.) are dropped in v0.3.1.

### 5.2 `ideamark format`

```
ideamark format [<infile>|-] [-o <outfile>|-] [--canonical]
                [--diagnostics <stderr|stdout|FILE>]
```

- Default is **round-trip mode**: preserves unknown namespaces, extension fields,
  optional fields, array order, and comments (§15.8–15.9). Formatting normalizes
  only whitespace/indentation.
- `--canonical` additionally reorders top-level namespaces to
  `meta, sources, sections, occurrences, entities, structure, extensions, <others>`
  and applies uniform quoting/indent style. Canonical mode never deletes data; it is
  the explicit mode required by §15.8.
- Formatted document → stdout / `-o`; diagnostics (e.g. `yaml_restricted_feature`,
  `canonical_reordered`) → stderr by default.
- Exit `1` when input cannot be loaded (LOAD-01/02/03/05); the document is otherwise
  formatted even if it has validation errors — `format` is not a validator.

### 5.3 `ideamark migrate`

```
ideamark migrate <infile> [-o <outfile>|-] [--from v1.1.1] [--strict] [--info]
                 [--diagnostics <stderr|stdout|FILE>]
```

- Converts a v1.1.x `.ideamark.md` document to a v1.2.0 `.ideamark.yaml` document
  per Part 4 §14 (keyed maps → arrays preserving keys as `id`, header → `meta`,
  `original_sources` → `sources`, singular `anchor` → `anchors[]`, Projection data →
  `meta.projections`, `meta.migration` record written).
- `--from` is optional; source format is auto-detected. The flag exists to pin
  detection in pipelines and to fail fast on mismatch.
- Unresolvable references: preserved with `migration_reference_unresolved` warning, or
  a placeholder object plus `migration_placeholder_created` (§14.8). `--strict` turns
  the former into an error. Nothing is silently dropped; data with no v1.2.0 home is
  preserved under extension fields (`migration_data_preserved_as_extension`).
- After conversion, Core-mode validation runs automatically on the result; its
  diagnostics are appended to the migrate envelope. Exit `1` if migration failed OR
  the result has Core errors.

### 5.4 `ideamark ls`

```
ideamark ls [<infile>|-] [--sources] [--sections] [--occurrences] [--entities]
            [--vocab] [--format json|md]
```

- Lists object IDs (with `title`/`kind`/`role` summaries) and, with `--vocab`, the
  observed vocabulary values (status, source types, anchor types, roles, kinds).
- No selector flags → all groups. Default `--format json`.
- Requires loadable v1.2.0 input; validation warnings do not block `ls`.

### 5.5 `ideamark describe`

```
ideamark describe <topic> [--format json|yaml|md] [--audience human|ai] [--lang ...]
```

- Topics as in v0.2.0 (`capabilities`, `checklist`, `vocab`, `ai-authoring`,
  `prompt-authoring`, `params`, `ls`, `routing`), with content regenerated for
  v1.2.0: vocabulary lists mirror the checklist tables; `checklist` mirrors rule IDs;
  `capabilities` reports the v0.3.1 command surface and this contract version.

### 5.6 `ideamark --version`

```
ideamark --version [--format json]
```

JSON payload:

```json
{"tool":{"version":"0.3.1"},"contract":{"version":"1.2.0-draft.2"},"document_spec":{"version":"ideamark-core-v1.2.0"}}
```

## 6. Contract stability

- Additive changes (new flags, new diagnostic codes, new envelope fields, new info
  diagnostics) are allowed within v0.3.x and bump the draft suffix.
- Breaking changes (removing/renaming commands, flags, codes, envelope fields;
  changing severities of existing codes in a given mode; changing exit-code meaning)
  require a new contract version and a CLI minor bump.
- Message wording, diagnostic ordering, and formatting style details are explicitly
  NOT contract-stable.

## 7. Non-goals (v0.3.1)

Profile validation, Projection content validation, retrieval, storage, source
verification, canonical JSON output, `extract`/`compose`/`publish`/`diff`/`lint`
semantics for v1.2.0 (deferred to v0.3.1+).

## v0.3.1 additive draft.2 update

- Contract version: `1.2.0-draft.2`.
- Tool version: `0.3.1`.
- `skeletons` is a known optional top-level namespace. Core validation preserves Core behavior and reports Skeleton Graph basic-shape issues as warnings.
- `ideamark ls --skeletons` lists graph id, role, projection, node/link counts, unresolved Core refs, and unresolved graph-local link endpoints.
- Projection Profile support remains discovery-only; external projection resolution, compatibility scoring, and retrieval ranking are out of scope.
