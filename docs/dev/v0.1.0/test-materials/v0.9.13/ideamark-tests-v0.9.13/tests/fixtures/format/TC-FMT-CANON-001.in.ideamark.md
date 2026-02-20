---
ideamark_version: 1
doc_id: "DOC-FMT-1"
doc_type: "derived"
status:
  state: "in_progress"
created_at: "2026-02-20"
updated_at: "2026-02-20"
lang: "en"
---

## SEC-FMT
```yaml
section_id: "SEC-FMT"
anchorage:
  view: "design"
  phase: "implementation"
occurrences: ["OCC-F1"]
```

```yaml
occurrence_id: "OCC-F1"
entity: "IE-F1"
role: "observation"
status:
  state: "confirmed"
```

## Registry
```yaml
entities:
  IE-F1:
    kind: "observation"
    content: "Format entity"
occurrences:
  OCC-F1:
    entity: "IE-F1"
    role: "observation"
    status: { state: "confirmed" }
sections:
  SEC-FMT:
    anchorage: { view: "design", phase: "implementation" }
    occurrences: ["OCC-F1"]
structure:
  sections: ["SEC-FMT"]
```
