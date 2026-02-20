---
ideamark_version: 1
doc_id: "DOC-CSA"
doc_type: "derived"
status:
  state: "in_progress"
created_at: "2026-02-20"
updated_at: "2026-02-20"
lang: "en"
---

## SEC-X
```yaml
section_id: "SEC-X"
anchorage:
  view: "design"
  phase: "implementation"
occurrences: ["OCC-A"]
```

```yaml
occurrence_id: "OCC-A"
entity: "IE-A"
role: "observation"
status:
  state: "confirmed"
```

## Registry
```yaml
entities:
  IE-A:
    kind: "observation"
    content: "Entity A"
occurrences:
  OCC-A:
    entity: "IE-A"
    role: "observation"
    status: { state: "confirmed" }
sections:
  SEC-X:
    anchorage: { view: "design", phase: "implementation" }
    occurrences: ["OCC-A"]
structure:
  sections: ["SEC-X"]
```
