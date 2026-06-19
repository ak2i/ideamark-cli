---
ideamark_version: "1.1.1"
doc_id: "DOC-V111-CACHE"
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
    kind: "cache"
    payload:
      cache:
        body: "Cached payload"
        captured_at: "2026-06-19T00:00:00Z"
        source_hash: "sha256:demo"
      format:
        media_type: "text/plain"
occurrences:
  OCC-1:
    entity: "IE-1"
    role: "observation"
sections:
  SEC-1:
    occurrences: ["OCC-1"]
relations: {}
perspectives: {}
```
