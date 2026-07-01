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
WARNING expected, NOT an error (§7.15): section omitted from the structure.sections listing -> section_unused. ("Unused section" has no Core definition; see the spec ambiguity issue.)

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
