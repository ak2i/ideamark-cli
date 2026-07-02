# Doc CLI Contract v1.1.1
## describe params Contract
Generated: 2026-06-19T00:00:00Z

この文書は次を定義する。

```bash
<tool> describe params [--format md|json|yaml]
```

---

## 1. Purpose

`describe params` は、対象文書を生成・編集・検証するために必要な入力パラメータ情報を公開する。

主用途:

- LLM が文書生成時の required / optional を知る
- caller が reference form や payload 形状を知る
- human が最小 valid 文書を構成できる

---

## 2. Output requirements

### JSON output

少なくとも次の構造を持つこと。

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
    "name": "<document-format-name>",
    "version": "<document-format-version>",
    "representation": "yaml-based"
  },
  "header": {},
  "registry": {},
  "references": {},
  "validation": {}
}
```

### Markdown output

少なくとも次を説明する。

- required header fields
- required registry namespaces
- reference targets
- payload rules
- strict validation highlights

---

## 3. Required information categories

### header

- required fields
- optional fields
- value notes

### registry

- namespaces such as `entities`, `occurrences`, `sections`, `relations`, `perspectives`
- required / optional

### references

- supported local reference forms
- canonical reference forms if any
- valid target namespaces

### validation

- required structures
- payload requirements
- strict-mode notes

---

## 4. YAML-based baseline

`describe params` SHOULD explicitly state that the document baseline is YAML-based in the v1.1.1 line.

---

End of describe params contract.
