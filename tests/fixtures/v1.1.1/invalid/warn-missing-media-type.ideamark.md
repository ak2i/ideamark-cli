---
ideamark_version: "1.1.1"
doc_id: "DOC-V111-WARN-MEDIA-TYPE"
doc_type: "derived"
status:
  state: "in_progress"
created_at: "2026-07-01"
updated_at: "2026-07-01"
lang: "en"
---
WARNING expected, NOT an error (§7.8 / §7.15): payload.format.media_type missing -> payload_media_type_missing. Exit code must be 0 without --fail-on-warn.

## Registry
```yaml
entities:
  E-1:
    kind: "claim"
    payload:
      body: "Body without format block."

occurrences:
  OCC-1:
    entity: "E-1"
    role: "claim"
sections:
  SEC-1:
    occurrences: ["OCC-1"]
```
