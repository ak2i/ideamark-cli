---
ideamark_version: "1.1.1"
doc_id: "DOC-V111-WARN-UNUSED-ENTITY"
doc_type: "derived"
status:
  state: "in_progress"
created_at: "2026-07-01"
updated_at: "2026-07-01"
lang: "en"
---
WARNING expected, NOT an error (§7.15): entity never activated by an occurrence -> entity_unused.

## Registry
```yaml
entities:
  E-1:
    kind: "claim"
    payload:
      format:
        media_type: "text/markdown"
      body: "Used."
  E-ORPHAN:
    kind: "claim"
    payload:
      format:
        media_type: "text/markdown"
      body: "Never referenced."
occurrences:
  OCC-1:
    entity: "E-1"
    role: "claim"
sections:
  SEC-1:
    occurrences: ["OCC-1"]
```
