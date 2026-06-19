# Doc CLI Contract v1.1.1
## validate Contract
Generated: 2026-06-19T00:00:00Z

この文書は次を定義する。

```bash
<tool> validate [options] <input|->
```

---

## 1. Signature

```bash
<tool> validate [--format ndjson|json|md] [common options...] <input|->
```

要件:

- `<input>` はファイルパスまたは `-`
- `-` は stdin
- 出力は既定で stdout

---

## 2. Exit codes

- `0`: validation OK
- `1`: validation failed
- `2`: usage error
- `3`: runtime error (optional)

---

## 3. Diagnostics model

NDJSON を標準レコード形式とする。

順序:

1. `meta`
2. `diagnostic*`
3. `summary`

### meta

```json
{
  "type": "meta",
  "tool": "<tool-name>",
  "version": "<semver>",
  "mode": "<string>",
  "command": "validate"
}
```

### diagnostic

```json
{
  "type": "diagnostic",
  "severity": "error|warning|info",
  "code": "<short_code>",
  "message": "<human-readable>",
  "location": {
    "scope": "<string>",
    "path": "<string>",
    "id": "<string>",
    "line": 0,
    "column": 0
  },
  "mode": "<string>"
}
```

### summary

```json
{
  "type": "summary",
  "ok": true,
  "error_count": 0,
  "warning_count": 0,
  "info_count": 0
}
```

---

## 4. Validation boundary

Doc CLI v1.1.1 の `validate` は、少なくとも構造妥当性を扱う。

含めてよい:

- YAML parseability
- required header fields
- required registry namespaces
- internal reference integrity
- required payload shape
- tool-specific strict mode checks

含めない:

- payload meaning
- external resource existence
- URI reachability
- profile-specific semantics unless tool explicitly extends them

---

## 5. JSON and Markdown output

### JSON

単一 JSON object:

```json
{
  "meta": {},
  "diagnostics": [],
  "summary": {}
}
```

### Markdown

- human readable
- non-normative

---

## 6. Strictness

- default fail threshold は `error`
- `--strict` を実装する場合、`describe capabilities` で宣言する
- strict mode は追加チェックまたは診断昇格を行ってよい

---

## 7. Compatibility

- Unknown fields MUST be ignored
- Diagnostic field types MUST remain stable within the contract line

---

End of validate contract.
