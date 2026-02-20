---
ideamark_version: 1
doc_id: "DOC-B"
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
occurrences: ["OCC-B"]
```

```yaml
occurrence_id: "OCC-B"
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
  OCC-B:
    entity: "IE-B"
    role: "observation"
    status: { state: "confirmed" }
sections:
  SEC-B:
    anchorage: { view: "design", phase: "implementation" }
    occurrences: ["OCC-B"]
structure:
  sections: ["SEC-B"]
```
