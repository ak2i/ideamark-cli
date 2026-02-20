---
ideamark_version: 1
doc_id: "DOC-MIX-A"
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
occurrences: ["OCC-X"]
```

```yaml
occurrence_id: "OCC-X"
entity: "IE-X"
role: "observation"
status:
  state: "confirmed"
```

## Registry
```yaml
entities:
  IE-X:
    kind: "observation"
    content: "Entity X A"
occurrences:
  OCC-X:
    entity: "IE-X"
    role: "observation"
    status: { state: "confirmed" }
sections:
  SEC-X:
    anchorage: { view: "design", phase: "implementation" }
    occurrences: ["OCC-X"]
structure:
  sections: ["SEC-X"]
```
