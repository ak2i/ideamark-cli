# Doc CLI Contract v1.1.1
## describe ai-authoring Contract
Generated: 2026-06-19T00:00:00Z

この文書は次を定義する。

```bash
<tool> describe ai-authoring [--format md|json|yaml]
```

---

## 1. Purpose

`describe ai-authoring` は、LLM が対象文書を正しく生成・修正・検証するためのガイドを公開する。

v1.1.1 line では、YAML-based authoring を前提にする。

---

## 2. JSON structure

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
  "guidance": {
    "overview": "<short text>",
    "principles": ["<rule>"],
    "do": ["<rule>"],
    "dont": ["<rule>"],
    "checklist": ["<item>"],
    "examples": ["<example>"]
  }
}
```

---

## 3. Guidance requirements

少なくとも次を含めること。

- YAML-based authoring baseline
- required structural units
- payload authoring guidance
- do / dont
- validation reminders

推奨:

- small model 向け fixed recipe
- large model 向け planning / validation guidance

---

## 4. Markdown requirements

Markdown 出力は次を含むこと。

- overview
- do
- do not
- checklist
- example or pattern

---

## 5. Non-goals

- Core meaning model explanationの完全版
- payload profile semantics の完全定義

---

End of describe ai-authoring contract.
