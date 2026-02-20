---
ideamark_version: 1
doc_id: "DOC-PUB-CANON"
doc_type: "derived"
status:
  state: "in_progress"
created_at: "2026-02-20"
updated_at: "2026-02-20"
lang: "en"
---

## SEC-CAN
```yaml
section_id: "SEC-CAN"
anchorage:
  view: "design"
  phase: "implementation"
occurrences: ["OCC-CAN"]
```

```yaml
occurrence_id: "OCC-CAN"
entity: "IE-CAN"
target: "IE-TGT"
supporting_evidence: ["IE-SUP"]
derived_from:
  - entity: "IE-DER"
role: "observation"
status:
  state: "confirmed"
```

## Registry
```yaml
entities:
  IE-CAN:
    kind: "observation"
    content: "Main entity"
  IE-TGT:
    kind: "observation"
    content: "Target entity"
  IE-SUP:
    kind: "evidence"
    content: "Supporting evidence"
  IE-DER:
    kind: "observation"
    content: "Derived entity"
occurrences:
  OCC-CAN:
    entity: "IE-CAN"
    target: "IE-TGT"
    supporting_evidence: ["IE-SUP"]
    derived_from:
      - entity: "IE-DER"
    role: "observation"
    status: { state: "confirmed" }
sections:
  SEC-CAN:
    anchorage: { view: "design", phase: "implementation" }
    occurrences: ["OCC-CAN"]
structure:
  sections: ["SEC-CAN"]
```
