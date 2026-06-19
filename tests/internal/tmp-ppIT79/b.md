---
ideamark_version: "1.1.1"
doc_id: "DOC-2"
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

Section narrative B

```yaml
occurrence_id: "OCC-1"
entity: "IE-1"
role: "observation"
```

## Registry
```yaml
entities:
  IE-1:
    kind: "observation"
    payload:
      body: "test"
      format:
        media_type: "text/plain"
    atomicity_basis: "interpretive"
occurrences:
  OCC-1:
    entity: "IE-1"
    role: "observation"
sections:
  SEC-1:
    occurrences: ["OCC-1"]
relations: {}
perspectives: {}
structure:
  sections: ["SEC-1"]
```
