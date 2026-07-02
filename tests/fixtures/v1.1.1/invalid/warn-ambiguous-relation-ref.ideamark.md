---
ideamark_version: "1.1.1"
doc_id: "DOC-V111-WARN-AMBIGUOUS-REL"
doc_type: "derived"
status:
  state: "in_progress"
created_at: "2026-07-02"
updated_at: "2026-07-02"
lang: "en"
---

WARNING expected, NOT an error (Core Spec §6.3 / ADR-0001): the id "X-AMB" exists as both an entity and a section, so the bare relation endpoint is ambiguous -> relation_ref_ambiguous. It resolves as the entity (entity namespace first); authors should disambiguate with a typed reference form.

## Registry
```yaml
entities:
  E-1:
    kind: "claim"
    payload:
      format:
        media_type: "text/markdown"
      body: "Claim body."
  X-AMB:
    kind: "evidence"
    payload:
      format:
        media_type: "text/markdown"
      body: "Entity that shares its id with a section."
occurrences:
  OCC-1:
    entity: "E-1"
    role: "claim"
  OCC-AMB:
    entity: "X-AMB"
    role: "evidence"
sections:
  SEC-1:
    occurrences: ["OCC-1", "OCC-AMB"]
  X-AMB:
    occurrences: ["OCC-1"]
relations:
  REL-1:
    type: "supports"
    from: "X-AMB"
    to: "E-1"
```
