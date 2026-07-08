# IdeaMark Describe Discovery Contract — draft for IdeaMark Core v1.2.0

**Contract version:** `1.2.0-draft.2`  
**Tool version:** ideamark-cli v0.3.1  
**Status:** Additive discovery contract

This document fixes the machine-readable discovery contract for:

- `ideamark describe ls --target guides [--sections] [--vocab] --format json|yaml|md`
- `ideamark describe routing --format json|yaml|md`

It covers built-in guidance discovery, not document-instance listing. For document-instance
listing, use `ideamark ls`.

## 1. Purpose

`describe` discovery lets a human, LLM, or upstream router discover:

1. which built-in guidance assets exist,
2. which logical guide sections can be cited or routed against,
3. which selector axes the tool understands, and
4. whether a task should be routed to IdeaMark or a complementary tool.

The output is intentionally self-contained and MUST NOT expose physical file paths.

## 2. Common envelope

All `describe ls` and `describe routing` JSON/YAML payloads MUST include this envelope:

```json
{
  "contract": {
    "name": "doc-cli-contract",
    "version": "1.2.0-draft.2"
  },
  "tool": {
    "name": "ideamark-cli",
    "package": "@ideamark/core-cli",
    "command": "ideamark",
    "version": "0.3.1"
  },
  "document": {
    "name": "ideamark",
    "version": "ideamark-core-v1.2.0",
    "representation": "single-yaml-mapping"
  },
  "topic": "ls|routing",
  "audience": "human|ai",
  "language": "ja-JP|en-US"
}
```

Consumers MUST ignore unknown fields. Producers MAY add fields within this envelope.

## 3. `describe ls --target guides`

### 3.1 Scope

`describe ls --target guides` enumerates built-in guidance assets. It is not a document
parser and does not read user input.

Supported target values:

- `guides`

Unsupported targets MUST return `unsupported_target` through the internal API and exit
with usage error through the CLI.

### 3.2 JSON shape

```json
{
  "topic": "ls",
  "target": "guides",
  "available_targets": ["guides"],
  "available_languages": ["ja-JP", "en-US"],
  "guides": [
    {
      "id": "ideamark.guides.routing",
      "topic": "routing",
      "title": "IdeaMark routing guide",
      "description": "...",
      "formats": ["md", "json", "yaml"],
      "languages": ["ja-JP", "en-US"],
      "sections_count": 3,
      "section_ids": ["SEC-IMK-SCOPE-BACKGROUND"],
      "views": ["background", "decision"],
      "domains": ["routing", "scope", "discovery"]
    }
  ]
}
```

When `--sections` is supplied, each guide MUST include a `sections` array.

```json
{
  "sections": [
    {
      "id": "SEC-IMK-SCOPE-BACKGROUND",
      "title": "IdeaMark scope background",
      "view": "background",
      "domains": ["routing", "scope"],
      "selectors": ["source.type", "occurrence.role", "entity.kind", "anchor.type"],
      "summary": "..."
    }
  ]
}
```

When `--vocab` is supplied, the payload SHOULD include the same guidance vocabulary that
`describe vocab` exposes.

### 3.3 Field rules

- `guides[].id` MUST be stable within the package version.
- `guides[].topic` SHOULD match a supported `describe` topic when the guide is directly retrievable.
- `guides[].section_ids` MUST equal `guides[].sections[].id` when sections are included.
- `sections[].id` MUST be a logical identifier and MUST NOT encode a physical path.
- `sections[].selectors` SHOULD use the selector vocabulary in section 5.
- `sections[].summary` is human-readable and not contract-stable.

## 4. `describe routing`

### 4.1 Scope

`describe routing` exposes whether IdeaMark applies to a task context and where the
routing guidance came from.

It MUST NOT claim to execute retrieval, ranking, external source dereferencing, storage
management, or task-loop orchestration.

### 4.2 JSON shape

```json
{
  "topic": "routing",
  "routing": {
    "supported": true,
    "entrypoints": ["describe routing", "describe ls --target guides --sections"],
    "selectors": ["source.type", "occurrence.role", "entity.kind", "anchor.type"],
    "fallback_search": true
  },
  "selectors": ["source.type", "occurrence.role", "entity.kind", "anchor.type"],
  "source": {
    "type": "builtin_guidance",
    "guide_id": "ideamark.guides.routing",
    "topic": "routing",
    "section_ids": ["SEC-IMK-SCOPE-BACKGROUND"]
  },
  "applies_to": ["..."],
  "non_goals": ["..."],
  "complementary_tools": ["flowmark"],
  "decision_rules": [
    {
      "when": "...",
      "route": "ideamark"
    }
  ]
}
```

### 4.3 Field rules

- `source.type` MUST be `builtin_guidance` for built-in guidance.
- `source.guide_id` MUST match one `guides[].id` returned by `describe ls --target guides`.
- `source.section_ids` MUST be non-empty and MUST reference section IDs in that guide.
- `routing.selectors` and top-level `selectors` SHOULD be identical for convenience.
- `decision_rules[].route` SHOULD be short, stable, lowercase identifiers.
- `applies_to`, `non_goals`, and `complementary_tools` SHOULD be concise and machine-readable enough for LLM routing prompts.

## 5. Selector vocabulary

The initial v1.2.0 discovery selector vocabulary is:

- `source.type`
- `occurrence.role`
- `entity.kind`
- `anchor.type`
- `skeleton.role`
- `skeleton.slot`

This vocabulary is additive. Consumers MUST ignore unknown selector values.

## 6. Markdown and YAML formats

- `--format json` is the normative machine-readable form.
- `--format yaml` MUST preserve the same structure as JSON.
- `--format md` is human-facing and MAY omit fields, but SHOULD include guide IDs,
  section IDs, source guide ID, and source section IDs.

## 7. Stability

Stable across patch releases:

- envelope keys,
- guide IDs,
- section IDs,
- selector names already published,
- `source.guide_id`,
- `source.section_ids` shape.

Not contract-stable:

- prose summaries,
- markdown wording,
- order of non-required arrays unless explicitly stated,
- additional fields.

## 8. Compatibility notes

This contract is an additive specialization of `describe` for v1.2.0 discovery. It does
not change validation, formatting, migration, or document-instance `ls` behavior.
