---
ideamark_version: "1.1.1"
doc_id: "DOC-V111-BODY-REF"
doc_type: "derived"
status:
  state: "in_progress"
created_at: "2026-07-01"
updated_at: "2026-07-01"
lang: "en"
---
Valid payload combination: body + ref (§7.7).

## Registry
```yaml
entities:
  E-DUAL-001:
    kind: "claim"
    payload:
      format:
        media_type: "text/markdown"
      body: "Local excerpt of the referenced source."
      ref:
        uri: "https://example.org/report.md"
occurrences:
  OCC-001:
    entity: "E-DUAL-001"
    role: "claim"
sections:
  SEC-001:
    occurrences: ["OCC-001"]
```
