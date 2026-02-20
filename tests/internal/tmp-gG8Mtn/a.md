---
ideamark_version: 1
doc_id: "DOC-1"
doc_type: "derived"
status:
  state: "in_progress"
created_at: "2026-02-20"
updated_at: "2026-02-20"
lang: "en"
---

## SEC-1
```yaml
section_id: "SEC-1"
anchorage:
  view: "design"
  phase: "implementation"
occurrences: ["OCC-1"]
```

```yaml
occurrence_id: "OCC-1"
entity: "IE-A"
role: "observation"
status: { state: "confirmed" }
```

## Registry
```yaml
entities:
  IE-A:
    kind: "observation"
    content: "test"
occurrences:
  OCC-1:
    entity: "IE-A"
    role: "observation"
    status: { state: "confirmed" }
sections:
  SEC-1:
    anchorage: { view: "design", phase: "implementation" }
    occurrences: ["OCC-1"]
structure:
  sections: ["SEC-1"]
```
