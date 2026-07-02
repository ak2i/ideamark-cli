---
ideamark_version: "1.1.1"
doc_id: "DOC-V111-WARN-CAPTURED-AT"
doc_type: "derived"
status:
  state: "in_progress"
created_at: "2026-07-01"
updated_at: "2026-07-01"
lang: "en"
---
WARNING expected, NOT an error (§7.10 / §7.15): payload.cache without captured_at -> payload_captured_at_missing.

## Registry
```yaml
entities:
  E-1:
    kind: "claim"
    payload:
      format:
        media_type: "text/markdown"
      cache:
        body: "Snapshot without captured_at."

occurrences:
  OCC-1:
    entity: "E-1"
    role: "claim"
sections:
  SEC-1:
    occurrences: ["OCC-1"]
```
