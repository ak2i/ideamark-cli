---
ideamark_version: 1
doc_id: "DOC-EXT-CLO"
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
supporting_evidence: ["IE-SUP", "OCC-SUP"]
derived_from:
  - entity: "IE-DER"
status:
  state: "confirmed"
```

```yaml
occurrence_id: "OCC-SUP"
entity: "IE-SUP"
role: "evidence"
status:
  state: "confirmed"
```

## Registry
```yaml
entities:
  IE-A:
    kind: "observation"
    content: "Main entity"
  IE-SUP:
    kind: "evidence"
    content: "Supporting evidence"
  IE-DER:
    kind: "observation"
    content: "Derived entity"
occurrences:
  OCC-A:
    entity: "IE-A"
    role: "observation"
    supporting_evidence: ["IE-SUP", "OCC-SUP"]
    derived_from:
      - entity: "IE-DER"
    status: { state: "confirmed" }
  OCC-SUP:
    entity: "IE-SUP"
    role: "evidence"
    status: { state: "confirmed" }
sections:
  SEC-A:
    anchorage: { view: "design", phase: "implementation" }
    occurrences: ["OCC-A"]
structure:
  sections: ["SEC-A"]
```
