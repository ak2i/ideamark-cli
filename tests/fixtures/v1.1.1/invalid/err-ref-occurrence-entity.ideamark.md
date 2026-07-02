---
ideamark_version: "1.1.1"
doc_id: "DOC-V111-ERR-OCC-ENTITY-REF"
doc_type: "derived"
status:
  state: "in_progress"
created_at: "2026-07-01"
updated_at: "2026-07-01"
lang: "en"
---
ERROR expected (§7.4 / §7.15): occurrence.entity refers to a non-existent local entity -> entity_ref_invalid.

## Registry
```yaml
entities:
  E-1:
    kind: "claim"
    payload:
      format:
        media_type: "text/markdown"
      body: "Present but unused."
occurrences:
  OCC-1:
    entity: "E-MISSING"
    role: "claim"
sections:
  SEC-1:
    occurrences: ["OCC-1"]
```
