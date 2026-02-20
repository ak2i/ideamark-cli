---
ideamark_version: 1
doc_id: "DOC-COA"
doc_type: "derived"
status:
  state: "in_progress"
created_at: "2026-02-20"
updated_at: "2026-02-20"
lang: "en"
---

## SEC-A
```yaml
section_id: "SEC-A"
anchorage:
  view: "design"
  phase: "implementation"
occurrences: ["OCC-X"]
```

```yaml
occurrence_id: "OCC-X"
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
  OCC-X:
    entity: "IE-A"
    role: "observation"
    status: { state: "confirmed" }
sections:
  SEC-A:
    anchorage: { view: "design", phase: "implementation" }
    occurrences: ["OCC-X"]
structure:
  sections: ["SEC-A"]
```
