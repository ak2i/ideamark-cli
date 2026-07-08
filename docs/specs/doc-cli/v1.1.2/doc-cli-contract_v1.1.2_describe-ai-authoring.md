# Doc CLI Contract v1.1.2
## describe ai-authoring Contract
Generated: 2026-07-08T00:00:00+09:00

この文書は次を定義する。

```bash
<tool> describe ai-authoring [--format md|json|yaml]
```

v1.1.2 は v1.1.1 の互換更新であり、`describe ai-authoring` の基本 shape は v1.1.1 と同じである。

---

## 1. Purpose

`describe ai-authoring` は、LLM が対象文書を正しく生成・修正・検証するためのガイドを公開する。

v1.1.x line では、YAML-based authoring を前提にする。

---

## 2. JSON structure

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
- routing / discovery follow-up hints when supported

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
- routing decision の完全定義。routing は `describe routing` で扱う。

---

## 6. Compatibility

- Unknown fields MUST be ignored
- v1.1.2 is additive over v1.1.1

---

End of describe ai-authoring contract.
