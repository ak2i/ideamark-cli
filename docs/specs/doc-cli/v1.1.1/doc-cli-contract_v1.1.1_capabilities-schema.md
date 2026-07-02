# Doc CLI Contract v1.1.1
## capabilities Schema
Generated: 2026-06-19T00:00:00Z

`describe capabilities --format json` は、少なくとも次の shape を満たすこと。

```json
{
  "contract": {
    "name": "doc-cli-contract",
    "version": "1.1.1"
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

## YAML baseline

`document.representation` がある場合、v1.1.1 line では `"yaml-based"` を推奨する。

---

End of capabilities schema.
