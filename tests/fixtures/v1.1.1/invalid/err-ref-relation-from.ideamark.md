---
ideamark_version: "1.1.1"
doc_id: "DOC-V111-ERR-REL-FROM"
doc_type: "derived"
status:
  state: "in_progress"
created_at: "2026-07-01"
updated_at: "2026-07-01"
lang: "en"
---
ERROR expected (§7.4 / §7.15): relations.from refers to a non-existent target -> relation_from_invalid.

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
    occurrences: ["OCC-1"]
relations:
  REL-1:
    type: "supports"
    from: "E-MISSING"
    to: "E-1"
```
