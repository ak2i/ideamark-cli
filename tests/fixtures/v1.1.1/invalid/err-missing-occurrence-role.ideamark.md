---
ideamark_version: "1.1.1"
doc_id: "DOC-V111-ERR-OCC-NO-ROLE"
doc_type: "derived"
status:
  state: "in_progress"
created_at: "2026-07-01"
updated_at: "2026-07-01"
lang: "en"
---
ERROR expected (§7.6 / §7.15): occurrence without role -> occurrence_role_required.

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
sections:
  SEC-1:
    occurrences: ["OCC-1"]
```
