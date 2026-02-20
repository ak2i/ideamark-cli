---
ideamark_version: 1
doc_id: "DOC-EXT-REL"
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
    content: "Main entity"
  IE-R1:
    kind: "observation"
    content: "Relation entity 1"
  IE-R2:
    kind: "observation"
    content: "Relation entity 2"
occurrences:
  OCC-A:
    entity: "IE-A"
    role: "observation"
    status: { state: "confirmed" }
sections:
  SEC-A:
    anchorage: { view: "design", phase: "implementation" }
    occurrences: ["OCC-A"]
relations:
  - type: "relates_to"
    from: "IE-R1"
    to: "IE-R2"
structure:
  sections: ["SEC-A"]
```
