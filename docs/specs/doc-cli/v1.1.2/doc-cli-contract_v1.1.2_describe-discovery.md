# Doc CLI Contract v1.1.2
## describe discovery Contract
Generated: 2026-07-08T00:00:00+09:00

この文書は次を定義する。

```bash
<tool> describe ls [--target guides] [--sections] [--vocab] [--format md|json|yaml]
<tool> describe routing [--format md|json|yaml]
```

---

## 1. Purpose

Discovery topics は、LLM / automation / human が Doc CLI ツールの適用範囲と built-in guidance を発見するための自己記述である。

主用途:

- caller が利用可能な guide / vocabulary / logical section ID を知る
- caller が routing selector を知る
- caller が「この問題をどのツールに渡すべきか」を判断する
- LLM が必要な guide を選び、必要に応じて `describe ai-authoring` / `describe params` を追加取得する

Discovery は対象文書を読む操作ではない。対象文書内の ID を列挙する場合は、各ツールの document-instance `ls` command を用いる。

---

## 2. Generic schema and tool-specific instances

Doc CLI Contract が標準化するのは、Discovery の protocol と common JSON shape である。

- Generic schema: `describe-discovery.schema.json`
- Generic example: `examples/discovery.example.json`
- Tool-specific instance example: each project MAY provide a file such as `docs/guides/<tool>/discovery.json`

`docs/specs/doc-cli/v1.1.2/` 配下の schema / example は、IdeaMark 以外の FlowMark / TPCG / HecatonAccess / PrepZen 等でもそのまま再利用できることを目的とする。

Tool-specific discovery catalog は、tool 固有の guide IDs、section IDs、routing rules、document profile 名を持ってよい。ただし common fields は schema に従い、unknown fields は無視可能でなければならない。

---

## 3. Common envelope

JSON / YAML output は少なくとも次の envelope を持つことが望ましい。

```json
{
  "contract": {
    "name": "doc-cli-contract",
    "version": "1.1.2"
  },
  "tool": {
    "name": "<tool-name>",
    "version": "<semver>"
  },
  "document": {
    "name": "<document-format-name>",
    "version": "<document-format-version>",
    "representation": "yaml-based"
  },
  "topic": "ls|routing",
  "audience": "human|ai",
  "language": "<BCP47>"
}
```

追加フィールドは許容する。Consumers MUST ignore unknown fields.

Tool-specific catalog files SHOULD also include a `discovery` object containing the reusable guide/routing catalog described by `describe-discovery.schema.json`.

---

## 4. `describe ls --target guides`

### 4.1 Scope

`describe ls --target guides` は built-in guidance assets を列挙する。

要件:

- logical guide IDs を返す
- logical section IDs を返せる
- 物理ファイルパスを返してはならない
- target が未指定の場合、tool は既定 target を選んでよい
- 未対応 target は usage error または structured error として扱う

### 4.2 JSON structure

```json
{
  "topic": "ls",
  "target": "guides",
  "available_targets": ["guides"],
  "available_languages": ["ja-JP", "en-US"],
  "guides": [
    {
      "id": "<stable-guide-id>",
      "topic": "<describe-topic>",
      "title": "<human-readable-title>",
      "description": "<short description>",
      "formats": ["md", "json", "yaml"],
      "languages": ["ja-JP", "en-US"],
      "sections_count": 1,
      "section_ids": ["<stable-section-id>"],
      "views": ["background"],
      "domains": ["routing"]
    }
  ]
}
```

When `--sections` is supplied, each guide SHOULD include `sections`.

```json
{
  "sections": [
    {
      "id": "<stable-section-id>",
      "title": "<human-readable-title>",
      "view": "background",
      "domains": ["routing", "scope"],
      "selectors": ["source.type", "occurrence.role"],
      "summary": "<short summary>"
    }
  ]
}
```

When `--vocab` is supplied, the payload SHOULD include reusable vocabulary data. The vocabulary shape is tool-specific, but selector names SHOULD align with section 6.

### 4.3 Field requirements

- `guides[].id` MUST be stable within the package version
- `guides[].section_ids` SHOULD be stable logical identifiers
- `guides[].section_ids` MUST match `guides[].sections[].id` when `sections` is present
- `sections[].id` MUST NOT expose a physical file path
- `sections[].selectors` SHOULD use selector names from this contract or documented tool-specific extensions
- `sections[].summary` is human-readable and not contract-stable

---

## 5. `describe routing`

### 5.1 Scope

`describe routing` exposes machine-readable guidance for deciding whether a tool applies to a problem context.

It SHOULD include:

- supported routing selectors
- applicable problem scope
- non-goals
- complementary tools
- source guide and section IDs
- decision rules

It MUST NOT claim capabilities that belong to complementary systems unless the tool actually implements them.

### 5.2 JSON structure

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
    "guide_id": "<stable-guide-id>",
    "topic": "routing",
    "section_ids": ["<stable-section-id>"]
  },
  "applies_to": ["<scope item>"],
  "non_goals": ["<non-goal>"],
  "complementary_tools": ["<tool-name>"],
  "decision_rules": [
    {
      "when": "<condition>",
      "route": "<route-id>"
    }
  ]
}
```

### 5.3 Field requirements

- `routing.supported` MUST be boolean
- `routing.entrypoints` SHOULD include `describe routing`
- `routing.selectors` SHOULD list selector axes understood by the tool
- top-level `selectors` MAY duplicate `routing.selectors` for convenience
- `source.type` SHOULD be `builtin_guidance` when routing data comes from built-in guidance
- `source.guide_id` SHOULD match a guide returned by `describe ls --target guides`
- `source.section_ids` SHOULD be non-empty
- `decision_rules[].route` SHOULD be short, stable identifiers

---

## 6. Selector vocabulary

The base selector vocabulary is additive.

Recommended common selectors:

- `source.type`
- `section.view`
- `section.domain`
- `occurrence.role`
- `entity.kind`
- `anchor.type`
- `skeleton.role`
- `skeleton.slot`

Tools MAY add tool-specific selectors. Consumers MUST ignore unknown selectors.

---

## 7. Markdown output

Markdown output is human-facing and MAY omit fields, but SHOULD include:

- guide IDs
- section IDs
- source guide ID
- source section IDs
- applies-to
- non-goals
- complementary tools

---

## 8. Compatibility rules

- This contract is additive over v1.1.1
- Unknown fields MUST be ignored
- Published guide IDs and section IDs SHOULD remain stable within a package minor version
- Breaking changes require a contract version bump outside the v1.1.x compatibility line

---

End of describe discovery contract.
