---
ideamark_version: "1.1.1"
doc_id: "DOC-V111-BODY"
doc_type: "derived"
status:
  state: "in_progress"
created_at: "2026-06-19T00:00:00Z"
updated_at: "2026-06-19T00:00:00Z"
lang: "en-US"
---

## SEC-1
```yaml
section_id: "SEC-1"
occurrences: ["OCC-1"]
```

## Registry
```yaml
entities:
  IE-1:
    kind: "note"
    payload:
      body: "Body only payload"
      format:
        media_type: "text/plain"
occurrences:
  OCC-1:
    entity: "IE-1"
    role: "claim"
sections:
  SEC-1:
    occurrences: ["OCC-1"]
relations: {}
perspectives: {}
```
