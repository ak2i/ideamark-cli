---
ideamark_version: "1.1.1"
doc_id: "DOC-V111-REL-PERSP"
doc_type: "derived"
status:
  state: "in_progress"
created_at: "2026-07-01"
updated_at: "2026-07-01"
lang: "en"
---
Relations as an id-keyed map with entity_ref and section_ref endpoints (Core Spec §6.2), plus perspectives and perspective_scope.

## Registry
```yaml
perspectives:
  P-URBAN:
    description: "Urban planning viewpoint"
    modifiers: ["mid-term"]
entities:
  E-A:
    kind: "claim"
    perspective_scope: ["P-URBAN"]
    payload:
      format:
        media_type: "text/markdown"
      body: "Claim A."
  E-B:
    kind: "evidence"
    payload:
      format:
        media_type: "text/markdown"
      body: "Evidence B."
occurrences:
  OCC-A:
    entity: "E-A"
    role: "claim"
  OCC-B:
    entity: "E-B"
    role: "evidence"
sections:
  SEC-001:
    title: "Discussion"
    perspectives: ["P-URBAN"]
    occurrences: ["OCC-A", "OCC-B"]
relations:
  REL-001:
    type: "supports"
    from: "E-B"
    to: "E-A"
  REL-002:
    type: "elaborated_in"
    from: "E-A"
    to: "SEC-001"
```
