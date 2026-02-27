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

## SEC-2
```yaml
section_id: "SEC-2"
anchorage:
  view: "design"
  phase: "implementation"
occurrences: ["OCC-2"]
```

```yaml
occurrence_id: "OCC-2"
entity: "IE-2"
role: "observation"
status: { state: "confirmed" }
```

## Registry
```yaml
entities:
  IE-2:
    kind: "observation"
    content: "test"
occurrences:
  OCC-2:
    entity: "IE-2"
    role: "observation"
    status: { state: "confirmed" }
sections:
  SEC-2:
    anchorage: { view: "design", phase: "implementation" }
    occurrences: ["OCC-2"]
structure:
  sections: ["SEC-2"]
```
