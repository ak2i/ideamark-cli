---
ideamark_version: "1.1.1"
doc_id: "DOC-1"
doc_type: "derived"
status:
  state: "in_progress"
created_at: "2026-06-19T00:00:00Z"
updated_at: "2026-06-19T00:00:00Z"
lang: "en-US"
---

## SEC-2
```yaml
section_id: "SEC-2"
occurrences: ["OCC-2"]
```

```yaml
occurrence_id: "OCC-2"
entity: "IE-2"
role: "observation"
```

## Registry
```yaml
entities:
  IE-2:
    kind: "observation"
    payload:
      body: "test"
      format:
        media_type: "text/plain"
    atomicity_basis: "interpretive"
occurrences:
  OCC-2:
    entity: "IE-2"
    role: "observation"
sections:
  SEC-2:
    occurrences: ["OCC-2"]
relations: {}
perspectives: {}
structure:
  sections: ["SEC-2"]
```
