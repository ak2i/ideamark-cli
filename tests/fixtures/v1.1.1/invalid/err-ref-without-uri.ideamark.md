---
ideamark_version: "1.1.1"
doc_id: "DOC-V111-ERR-REF-NO-URI"
doc_type: "derived"
status:
  state: "in_progress"
created_at: "2026-07-01"
updated_at: "2026-07-01"
lang: "en"
---
ERROR expected (§7.9 / §7.15): payload.ref present without ref.uri -> payload_ref_uri_required.

## Registry
```yaml
entities:
  E-1:
    kind: "claim"
    payload:
      format:
        media_type: "text/markdown"
      ref:
        selector: "#claim-001"

occurrences:
  OCC-1:
    entity: "E-1"
    role: "claim"
sections:
  SEC-1:
    occurrences: ["OCC-1"]
```
