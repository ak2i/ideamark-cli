---
ideamark_version: "1.1.1"
doc_id: "DOC-V111-REF"
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
    kind: "reference"
    payload:
      ref:
        uri: "./knowledge/example.md"
        selector: "#example-1"
      format:
        media_type: "text/markdown"
occurrences:
  OCC-1:
    entity: "IE-1"
    role: "evidence"
sections:
  SEC-1:
    occurrences: ["OCC-1"]
relations: {}
perspectives: {}
```
