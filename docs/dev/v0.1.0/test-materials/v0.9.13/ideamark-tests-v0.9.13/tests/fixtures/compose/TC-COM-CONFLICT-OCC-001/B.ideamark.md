---
ideamark_version: 1
doc_id: "DOC-COB"
doc_type: "derived"
status:
  state: "in_progress"
created_at: "2026-02-20"
updated_at: "2026-02-20"
lang: "en"
---

## SEC-B
```yaml
section_id: "SEC-B"
anchorage:
  view: "design"
  phase: "implementation"
occurrences: ["OCC-X"]
```

```yaml
occurrence_id: "OCC-X"
entity: "IE-B"
role: "observation"
status:
  state: "confirmed"
```

## Registry
```yaml
entities:
  IE-B:
    kind: "observation"
    content: "Entity B"
occurrences:
  OCC-X:
    entity: "IE-B"
    role: "observation"
    status: { state: "confirmed" }
sections:
  SEC-B:
    anchorage: { view: "design", phase: "implementation" }
    occurrences: ["OCC-X"]
structure:
  sections: ["SEC-B"]
```
