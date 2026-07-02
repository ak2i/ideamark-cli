---
ideamark_version: "1.1.1"
doc_id: "DOC-V111-SHORTHAND-REF"
doc_type: "derived"
status:
  state: "in_progress"
created_at: "2026-07-02"
updated_at: "2026-07-02"
lang: "en"
---

Shorthand external reference form (Core Spec §9.2 / ADR-0003): `{doc_id}#{element_id}` referencing an entity in ANOTHER document. External references are opaque to Core validation, so this document MUST validate without diagnostics.

## Registry
```yaml
entities:
  E-LOCAL-001:
    kind: "observation"
    payload:
      format:
        media_type: "text/markdown"
      body: "Local note referring to a past claim."
occurrences:
  OCC-REUSED-SHORTHAND:
    entity: "DOC-PAST-SESSION#E-CLAIM-001"
    role: "evidence"
  OCC-LOCAL:
    entity: "E-LOCAL-001"
    role: "observation"
sections:
  SEC-1:
    occurrences: ["OCC-REUSED-SHORTHAND", "OCC-LOCAL"]
```
