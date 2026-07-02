---
ideamark_version: "1.1.1"
doc_id: "DOC-V111-MULTI-ROLE"
doc_type: "derived"
status:
  state: "in_progress"
created_at: "2026-07-01"
updated_at: "2026-07-01"
lang: "en"
---
One entity activated by multiple occurrences with different roles (claim / evidence / constraint). Core Model §4.1: the same Entity MAY participate in multiple Occurrences with different roles.

## Registry
```yaml
entities:
  E-OBS-001:
    kind: "observation"
    payload:
      format:
        media_type: "text/markdown"
      body: "Pump capacity is limited to 120% of nominal load."
occurrences:
  OCC-AS-CLAIM:
    entity: "E-OBS-001"
    role: "claim"
  OCC-AS-EVIDENCE:
    entity: "E-OBS-001"
    role: "evidence"
  OCC-AS-CONSTRAINT:
    entity: "E-OBS-001"
    role: "constraint"
sections:
  SEC-ARGUMENT:
    title: "Argument"
    anchorage:
      view: ["capacity-planning"]
      phase: ["analysis"]
    occurrences: ["OCC-AS-CLAIM", "OCC-AS-EVIDENCE"]
  SEC-DESIGN:
    title: "Design constraints"
    anchorage:
      view: ["design"]
      phase: ["planning"]
    occurrences: ["OCC-AS-CONSTRAINT"]
```
