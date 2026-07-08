# Doc CLI Contract v1.1.2
## capabilities Schema
Generated: 2026-07-08T00:00:00+09:00

`describe capabilities --format json` は、少なくとも次の shape を満たすこと。

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
    "version": "<document-spec-version>",
    "representation": "yaml-based"
  },
  "features": {},
  "commands": {}
}
```

## Required top-level fields

- `contract`
- `tool`
- `commands`

## Recommended top-level fields

- `document`
- `features`

## commands entry expectations

各 command entry は少なくとも次を持つことが望ましい。

```json
{
  "formats": ["json"],
  "stdin": true,
  "description": "..."
}
```

追加可能:

- `options`
- `topics`
- `examples`

## describe command expectations

`describe` command entry がある場合、`topics` SHOULD include:

- `capabilities`
- `params`
- `ai-authoring`

Discovery を実装する場合、`topics` SHOULD also include:

- `ls`
- `routing`

```json
{
  "commands": {
    "describe": {
      "formats": ["md", "json", "yaml"],
      "topics": ["capabilities", "params", "ai-authoring", "ls", "routing"],
      "description": "Print tool guidance and discovery metadata."
    }
  }
}
```

## features.discovery

Discovery topics を実装する場合、`features.discovery` SHOULD be declared.

```json
{
  "features": {
    "discovery": {
      "supported": true,
      "entrypoints": ["describe ls", "describe routing"],
      "targets": ["guides"],
      "logical_ids": true
    }
  }
}
```

## features.routing

Routing discovery を実装する場合、`features.routing` SHOULD be declared.

```json
{
  "features": {
    "routing": {
      "supported": true,
      "entrypoints": ["describe routing", "describe ls"],
      "selectors": ["source.type", "occurrence.role", "entity.kind", "anchor.type"],
      "fallback_search": true
    }
  }
}
```

## YAML baseline

`document.representation` がある場合、v1.1.x line では `"yaml-based"` を推奨する。

Tool-specific documents MAY use more specific representations such as `"single-yaml-mapping"`, but consumers SHOULD treat such values as YAML-based unless explicitly documented otherwise.

## Compatibility

- Unknown top-level fields MUST be ignored
- Unknown feature fields MUST be ignored
- Unknown command fields MUST be ignored
- v1.1.2 is additive over v1.1.1

---

End of capabilities schema.
