---
ideamark_version: "1.1.1"
doc_id: "DOC-V111-ERR-DUP-ENTITY"
doc_type: "derived"
status:
  state: "in_progress"
created_at: "2026-07-01"
updated_at: "2026-07-01"
lang: "en"
---
ERROR expected (§7.5 / §7.15): entity_id defined twice across registry blocks -> id_duplicate.

## Registry
```yaml
entities:
  E-1:
    kind: "claim"
    payload:
      format:
        media_type: "text/markdown"
      body: "First definition."
occurrences:
  OCC-1:
    entity: "E-1"
    role: "claim"
sections:
  SEC-1:
    occurrences: ["OCC-1"]
```

## Registry
```yaml
entities:
  E-1:
    kind: "claim"
    payload:
      format:
        media_type: "text/markdown"
      body: "Second definition with the same id."
```
