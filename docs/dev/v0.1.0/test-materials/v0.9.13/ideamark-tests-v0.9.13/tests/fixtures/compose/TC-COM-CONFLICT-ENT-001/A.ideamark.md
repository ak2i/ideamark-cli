---
ideamark_version: 1
doc_id: "DOC-CEA"
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
occurrences: ["OCC-A"]
```

```yaml
occurrence_id: "OCC-A"
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
  OCC-A:
    entity: "IE-X"
    role: "observation"
    status: { state: "confirmed" }
sections:
  SEC-A:
    anchorage: { view: "design", phase: "implementation" }
    occurrences: ["OCC-A"]
structure:
  sections: ["SEC-A"]
```
