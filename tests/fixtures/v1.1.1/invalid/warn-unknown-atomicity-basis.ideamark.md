---
ideamark_version: "1.1.1"
doc_id: "DOC-V111-WARN-ATOMICITY"
doc_type: "derived"
status:
  state: "in_progress"
created_at: "2026-07-02"
updated_at: "2026-07-02"
lang: "en"
---

WARNING expected, NOT an error (§7.11 / §7.15 / ADR-0005): atomicity_basis outside the interpretive|lexical|structural enumeration -> atomicity_basis_unknown. The value is preserved (§7.17); Core assigns it no semantics.

## Registry
```yaml
entities:
  E-1:
    kind: "claim"
    atomicity_basis: "creative"
    payload:
      format:
        media_type: "text/markdown"
      body: "Body."
occurrences:
  OCC-1:
    entity: "E-1"
    role: "claim"
sections:
  SEC-1:
    occurrences: ["OCC-1"]
```
