---
ideamark_version: "1.1.1"
doc_id: "DOC-V111-ERR-MULTI-VALUE"
doc_type: "derived"
status:
  state: "in_progress"
created_at: "2026-07-02"
updated_at: "2026-07-02"
lang: "en"
---

ERROR expected (§7.13 / §7.15 / ADR-0005): a multi-value field holding a mapping cannot be normalized to an array -> multi_value_field_invalid. Scalars are normalized to single-element arrays; mappings break every consumer that iterates these fields.

## Registry
```yaml
entities:
  E-1:
    kind: "claim"
    payload:
      format:
        media_type: "text/markdown"
      body: "Body."
occurrences:
  OCC-1:
    entity: "E-1"
    role: "claim"
sections:
  SEC-1:
    anchorage:
      view: { nested: true }
      phase: ["implementation"]
    occurrences: ["OCC-1"]
```
