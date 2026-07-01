---
ideamark_version: "1.1.1"
doc_id: "DOC-V111-ERR-NO-PAYLOAD"
doc_type: "derived"
status:
  state: "in_progress"
created_at: "2026-07-01"
updated_at: "2026-07-01"
lang: "en"
---
ERROR expected (§7.7 / §7.15): entity without payload -> payload_required.

## Registry
```yaml
entities:
  E-1:
    kind: "claim"

occurrences:
  OCC-1:
    entity: "E-1"
    role: "claim"
sections:
  SEC-1:
    occurrences: ["OCC-1"]
```
