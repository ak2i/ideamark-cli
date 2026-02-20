---
ideamark_version: 1
doc_id: "DOC-PUB-1"
doc_type: "derived"
status:
  state: "in_progress"
created_at: "2026-02-19"
updated_at: "2026-02-19"
lang: "en"
---

## SEC-PUB
```yaml
section_id: "SEC-PUB"
anchorage:
  view: "design"
  phase: "implementation"
occurrences: ["OCC-1"]
```

```yaml
occurrence_id: "OCC-1"
entity: "IE-1"
role: "observation"
status:
  state: "confirmed"
```

## Registry
```yaml
entities:
  IE-1:
    kind: "observation"
    content: "Publish entity"
occurrences:
  OCC-1:
    entity: "IE-1"
    role: "observation"
    status: { state: "confirmed" }
sections:
  SEC-PUB:
    anchorage: { view: "design", phase: "implementation" }
    occurrences: ["OCC-1"]
structure:
  sections: ["SEC-PUB"]
```
