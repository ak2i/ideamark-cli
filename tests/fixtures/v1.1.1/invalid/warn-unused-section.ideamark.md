---
ideamark_version: "1.1.1"
doc_id: "DOC-V111-WARN-UNUSED-SECTION"
doc_type: "derived"
status:
  state: "in_progress"
created_at: "2026-07-01"
updated_at: "2026-07-01"
lang: "en"
---
WARNING expected, NOT an error: section omitted from the structure.sections listing -> section_unused. This is a CLI hygiene warning (Constraints §7.17 / ADR-0004), not a Core §7.15 item — "unused sections" was removed from the Core warning list because the v1.1.1 model has no definition of section "use".

## Registry
```yaml
entities:
  E-1:
    kind: "claim"
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
  SEC-DETACHED:
    occurrences: ["OCC-1"]
structure:
  sections: ["SEC-1"]
```
