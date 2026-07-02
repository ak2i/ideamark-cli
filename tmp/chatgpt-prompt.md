# ChatGPT Prompt Template: Text -> IdeaMark YAML

以下は ChatGPT にそのまま貼るための雛形です。  
`{{...}}` の部分だけ置き換えて使います。

---

あなたは IdeaMark v1.1.1 YAML 文書を生成するアシスタントです。

次のルールに従って、入力テキストを IdeaMark 文書へ変換してください。

## 1. Target

- 出力形式: IdeaMark v1.1.1
- 表現形式: whole-document YAML
- 出力ファイル名: `rfc3986-uri-overview-sample.ideamark.yaml`
- 想定言語: `ja-JP`
- 納品形式: 可能なら `rfc3986-uri-overview-sample.ideamark.yaml` というファイルを作成して添付してください
- 添付が不可能な環境では、YAML を 1 つのコードブロックだけで返してください

## 2. Required guidance

以下の describe 出力を必ず守ってください。

### prompt-authoring

```json
{
  "contract": {
    "name": "doc-cli-contract",
    "version": "1.1.1"
  },
  "tool": {
    "name": "ideamark-cli",
    "version": "0.2.0"
  },
  "document": {
    "name": "ideamark",
    "version": "1.1.1",
    "representation": "yaml-based"
  },
  "prompt_authoring": {
    "overview": "Generate external LLM prompts that preserve IdeaMark v1.1.1 YAML validity and structural reference integrity.",
    "ownership": {
      "inside_cli": [
        "describe guidance distribution",
        "validate/lint execution",
        "vocab/checklist publication"
      ],
      "outside_cli": [
        "final prompt assembly",
        "model invocation",
        "retry strategy"
      ]
    },
    "required_inputs": [
      "source_materials",
      "output_path",
      "target_spec_version",
      "audience"
    ],
    "output_contract": {
      "required_yaml_units": [
        "header",
        "registry.entities",
        "registry.occurrences",
        "registry.sections"
      ],
      "ordering_requirements": [
        "Keep the document structurally coherent so section occurrence references are easy to trace.",
        "If `structure.sections` is emitted, keep it aligned with the actual section IDs.",
        "Do not emit references to entities, occurrences, or sections that are not defined."
      ],
      "payload_requirements": [
        "Every entity must contain `payload`.",
        "Each payload must include at least one of `body`, `ref`, or `cache`.",
        "If `payload.ref` exists, include `payload.ref.uri`."
      ],
      "prohibitions": [
        "unresolved local references",
        "duplicate IDs",
        "empty entity payloads"
      ]
    },
    "reference_mapping_rules": {
      "local_reference_baseline": {
        "required": [
          "Occurrence `entity` must resolve to an entity ID.",
          "Section `occurrences[]` must resolve to occurrence IDs.",
          "Relation endpoints may target entity or section refs."
        ]
      },
      "external_reference_baseline": {
        "policy": "carry only source-backed references",
        "required": [
          "Use `payload.ref.uri` for explicit external references.",
          "Do not invent URLs, citation identifiers, or bibliographic entries.",
          "Use payload/body/cache according to available source fidelity."
        ]
      },
      "template_extensions": {
        "policy": "extend_not_replace",
        "required": [
          "If a template adds fields, keep base payload and local reference rules intact.",
          "Record template usage in header metadata when relevant."
        ]
      }
    },
    "generation_flow": [
      "describe(ai-authoring + params + checklist)",
      "prompt_assembly",
      "generate",
      "validate(working)",
      "repair_loop",
      "validate(strict)"
    ],
    "prompt_template_hints": {
      "system": [
        "You are generating IdeaMark v1.1.1 documents.",
        "YAML validity and resolvable local references are mandatory."
      ],
      "task": [
        "Produce a valid header and registry namespaces.",
        "Ensure each entity has payload content.",
        "Ensure each occurrence points to an existing entity.",
        "Ensure each section lists existing occurrences."
      ],
      "quality_gate": [
        "Must pass ideamark validate --mode strict.",
        "Must not contain unresolved local references."
      ]
    }
  }
}

```

### ai-authoring

```json
{
  "contract": {
    "name": "doc-cli-contract",
    "version": "1.1.1"
  },
  "tool": {
    "name": "ideamark-cli",
    "version": "0.2.0"
  },
  "document": {
    "name": "ideamark",
    "version": "1.1.1",
    "representation": "yaml-based"
  },
  "guidance": {
    "overview": "Generate valid IdeaMark v1.1.1 documents for structural validation, routing-aware discovery, and reusable knowledge capture.",
    "principles": [
      "Produce YAML-based IdeaMark documents that parse cleanly.",
      "Keep IDs stable and unique within a document.",
      "Use concise, factual language and avoid inventing unsupported claims or references.",
      "Treat entities, occurrences, and sections as the minimum structural units.",
      "Use validation early in working loops and strict validation before handoff."
    ],
    "do": [
      "Include a valid header with the target `ideamark_version`.",
      "Create at least one entity, one occurrence, and one section.",
      "Give every entity a `payload` with `body`, `ref`, or `cache`.",
      "Make every occurrence point to an existing entity and declare a `role`.",
      "Make every section list at least one occurrence.",
      "Use `relations` and `perspectives` only when you can keep references resolvable.",
      "Use `payload.format.media_type` when payload format matters for routing or downstream processing."
    ],
    "dont": [
      "Invent IDs that collide with existing ones.",
      "Emit empty entity payloads.",
      "Point `payload.ref` at a missing `uri`.",
      "Reference entities, occurrences, or sections that do not exist.",
      "Treat optional metadata such as `anchorage` as a substitute for required structure.",
      "Invent external references, URLs, or citations that are not present in source materials."
    ],
    "checklist": [
      "Header matches IdeaMark `1.1.1`.",
      "Registry includes `entities`, `occurrences`, and `sections`.",
      "Every entity has non-empty payload content.",
      "Every occurrence has `entity` and `role`.",
      "Every section has a non-empty `occurrences` array.",
      "All local references resolve.",
      "Run `validate` in working mode during drafting and strict mode before handoff."
    ],
    "examples": [
      "Minimal valid pattern: one entity with `payload.body`, one occurrence pointing to that entity, and one section listing that occurrence."
    ],
    "profiles": {
      "ai_small": {
        "goal": "maximize first-pass validity with a fixed recipe",
        "steps": [
          "create_header",
          "create_entity_payload",
          "create_occurrence",
          "create_section",
          "validate_working",
          "repair",
          "validate_strict"
        ],
        "followup_topics": [
          "params",
          "checklist",
          "routing"
        ]
      },
      "ai_large": {
        "framework": [
          "PLAN",
          "AUTHOR",
          "VALIDATE",
          "TRANSFORM"
        ],
        "decision_points": [
          "payload body vs ref vs cache",
          "relation usage",
          "strictness level"
        ],
        "completion_criteria": [
          "requested structure produced",
          "validation passes",
          "references remain resolvable"
        ]
      },
      "human": {
        "default_lang": "ja-JP",
        "variants": [
          "easy",
          "advanced"
        ]
      }
    },
    "routing_hints": [
      "If the task centers on stable knowledge structure and local reference integrity, route to IdeaMark.",
      "If the task centers on iterative task execution, route to FlowMark first."
    ]
  }
}

```

### params

```json
{
  "contract": {
    "name": "doc-cli-contract",
    "version": "1.1.1"
  },
  "tool": {
    "name": "ideamark-cli",
    "version": "0.2.0"
  },
  "document": {
    "name": "ideamark",
    "version": "1.1.1",
    "representation": "yaml-based"
  },
  "header": {
    "required": [
      "ideamark_version",
      "doc_type"
    ],
    "strict_mode_required": [
      "doc_id",
      "status.state",
      "created_at",
      "updated_at",
      "lang"
    ],
    "optional": [
      "title",
      "summary",
      "authors",
      "template",
      "tags",
      "source",
      "lineage"
    ],
    "notes": [
      "`ideamark_version` should match the target document line (`1.1.1`).",
      "`doc_type` should use the published vocab (`source`, `derived`, `evolving`, `pattern`).",
      "`status.state` should use the published vocab (`in_progress`, `paused`, `completed`, `published`)."
    ]
  },
  "registry": {
    "required_namespaces": [
      "entities",
      "occurrences",
      "sections"
    ],
    "optional_namespaces": [
      "relations",
      "perspectives",
      "structure"
    ],
    "entity": {
      "required": [
        "payload"
      ],
      "optional": [
        "kind",
        "atomicity_basis",
        "perspectives",
        "relations",
        "status"
      ],
      "payload_rule": "At least one of `payload.body`, `payload.ref`, or `payload.cache` must exist.",
      "payload_ref_rule": "If `payload.ref` is present, `payload.ref.uri` is required."
    },
    "occurrence": {
      "required": [
        "entity",
        "role"
      ],
      "optional": [
        "section",
        "evidence",
        "supporting_evidence",
        "target",
        "status"
      ]
    },
    "section": {
      "required": [
        "occurrences"
      ],
      "optional": [
        "title",
        "summary",
        "perspectives",
        "relations",
        "anchorage"
      ],
      "notes": [
        "`occurrences` must be a non-empty array.",
        "`anchorage` is optional metadata in v1.1.1, not a structural requirement."
      ]
    }
  },
  "references": {
    "supported_forms": [
      "entity ref (`IE-*`)",
      "occurrence ref (`OCC-*`)",
      "section ref (`SEC-*`)"
    ],
    "relation_targets": [
      "entity_ref",
      "section_ref"
    ],
    "notes": [
      "`occurrence.entity` must refer to an existing entity.",
      "`section.occurrences[]` must refer to existing occurrences.",
      "`relations.*.from` and `relations.*.to` may target entities or sections."
    ]
  },
  "validation": {
    "working_mode_required": [
      "yaml_parseable",
      "entity_required",
      "occurrence_required",
      "section_required",
      "entity_payload_required",
      "entity_payload_content_required",
      "occurrence_entity_required",
      "occurrence_role_required",
      "section_occurrences_required",
      "relation_ref_valid"
    ],
    "strict_mode_highlights": [
      "header fields are enforced more strictly",
      "payload.ref.uri is required when payload.ref exists",
      "unknown local references should fail validation"
    ],
    "warnings": [
      "unreferenced entities",
      "unused occurrences"
    ]
  }
}

```

### checklist

```md
# strict checklist

- header_required
- header_singleton
- yaml_parseable
- entity_required
- id_unique_within_doc
- occurrence_required
- section_required
- entity_payload_required
- entity_payload_content_required
- entity_payload_ref_uri_required
- occurrence_entity_required
- occurrence_role_required
- entity_ref_valid
- occurrence_ref_valid
- section_occurrences_required
- relation_ref_valid

```

### vocab

```md
# vocab

atomicity_basis:
- interpretive
- lexical
- structural

doc_type:
- source
- derived
- evolving
- pattern

status.state:
- in_progress
- paused
- completed
- published

occurrence.role examples:
- claim
- evidence
- observation
- assumption
- constraint
- objective

relation ref targets:
- entity_ref
- section_ref

```

## 3. Conversion instructions

- 入力テキストの内容を、IdeaMark の `entities`, `occurrences`, `sections` に整理してください。
- 出力は YAML のみとし、説明文や前置きは付けないでください。
- `ideamark_version` は `1.1.1` にしてください。
- `doc_type`, `status.state`, `kind`, `role`, `atomicity_basis` は describe の公開語彙に従ってください。
- `entities`, `occurrences`, `sections`, `relations`, `perspectives`, `structure` は document root に直接置いてください。
- top-level に `registry:` キーを作らないでください。
- すべての `occurrence.entity` は存在する entity を参照してください。
- すべての `section.occurrences[]` は存在する occurrence を参照してください。
- すべての entity は `payload` を持ち、`body`, `ref`, `cache` の少なくとも1つを含めてください。
- 明示的な外部参照が入力にある場合だけ `payload.ref.uri` を使ってください。
- YAML インデントを厳密に守ってください。特に `status.state`, `payload.ref.uri`, `sections.<id>.occurrences` を壊さないでください。
- 入力にない URL や文献情報を捏造しないでください。
- `structure.sections` を出す場合は、実際の section ID と一致させてください。

## 4. Output constraints

- 最終出力は valid YAML のみ
- 添付ファイルで返せる場合は、チャット本文には短い一文だけを書いてください
- 添付ファイルで返せない場合だけ、1つの `yaml` コードブロックで返してください
- 補足説明、自己評価、謝辞は不要
- もし判断に迷う箇所があっても、可能な範囲で最小 valid な IdeaMark を構成してください

## 5. Required shape example

次の shape を厳守してください。

```yaml
ideamark_version: "1.1.1"
doc_id: "DOC-EXAMPLE"
doc_type: "derived"
status:
  state: "in_progress"
created_at: "2026-06-19T00:00:00Z"
updated_at: "2026-06-19T00:00:00Z"
lang: "ja-JP"
entities:
  IE-1:
    kind: "concept"
    atomicity_basis: "interpretive"
    payload:
      body: "..."
occurrences:
  OCC-1:
    entity: "IE-1"
    role: "claim"
sections:
  SEC-1:
    title: "..."
    occurrences:
      - "OCC-1"
relations: {}
perspectives: {}
structure:
  sections:
    - "SEC-1"
```

## 6. Input text

```text
RFC 3986 URI Overview - Sample Text for IdeaMark
=================================================

Source basis:
- RFC 3986, "Uniform Resource Identifier (URI): Generic Syntax"
- Section 1.1, "Overview of URIs"
- Original RFC page: https://datatracker.ietf.org/doc/html/rfc3986
- Reference page used for extraction check: https://tex2e.github.io/rfc-translater/html/rfc3986.html

Note:
This file is an English sample text prepared for IdeaMark-Core / IdeaMark-CLI
examples. It is a compact restatement of the URI overview concepts rather than
a full verbatim copy of RFC 3986 section 1.1.

-------------------------------------------------

Overview of URIs

A Uniform Resource Identifier, or URI, is a compact character sequence used to
identify a resource. The idea of a URI is intentionally broad: it is not limited
to web pages, network services, or things that can be retrieved over the
Internet. A resource may be a document, an image, a service, a collection, a
person, an organization, a book, a concept, a relationship type, or even a
numeric value.

The word "uniform" indicates that different kinds of identifiers can be handled
within a shared syntactic framework. This uniformity allows applications and
protocols to use identifiers in common contexts even when the mechanisms for
accessing the identified resources differ. It also allows new identifier schemes
to be introduced without disrupting the use of existing schemes.

The word "resource" refers to whatever is being identified. A resource does not
need to be physically accessible, network-accessible, or singular. The same
identified resource may vary over time, and some identifiers may refer to
abstract things rather than concrete objects.

The word "identifier" means information that distinguishes one resource from
other resources within a given scope. Identification should not be confused with
access. A URI may be used to denote a resource without implying that software
will retrieve it or interact with it.

A URI is interpreted through a scheme, such as http, mailto, ftp, file, or urn.
Each scheme defines how identifiers within that scheme are assigned and how
their scheme-specific details should be understood. RFC 3986 defines the generic
syntax shared by URI schemes, while individual scheme specifications may add
further restrictions or semantics.

Generic URI syntax makes it possible to parse a URI reference into major
components before scheme-specific processing is required. This separates the
common parsing task from the specialized interpretation performed by each
scheme. As a result, protocols and data formats can refer to a single generic
URI syntax while still allowing new schemes to evolve independently.

A URI may function as a locator, a name, or both. A URL is commonly understood as
a URI that identifies a resource and also describes a primary access mechanism
for locating it. A URN is commonly understood as a URI intended to serve as a
persistent name. However, a scheme does not have to be classified exclusively as
a locator or a name; instances of the same scheme may behave differently
depending on how identifiers are assigned and maintained.

This overview is useful for IdeaMark examples because the same concepts recur in
multiple roles. For example, "URI" can appear as a general concept, as a syntax
mechanism, as a constraint for parsing, as an example-bearing object, and as a
bridge between identification and access. Likewise, "resource", "identifier",
"scheme", "generic syntax", "URL", and "URN" can be represented as reusable
entities whose occurrences vary by section and role.

```

## 7. Final instruction

可能なら `rfc3986-uri-overview-sample.ideamark.yaml` をファイル添付として返してください。添付できない場合だけ、上の shape に従った YAML を 1 つの `yaml` コードブロックで返してください。
