---
ideamark_version: "1.1.1"
doc_id: "DOC-V111-NORMALIZE"
doc_type: "derived"
status:
  state: "in_progress"
created_at: "2026-07-01"
updated_at: "2026-07-01"
lang: "en"
---
Multi-value fields written as single values; implementations normalize them to single-element arrays (§7.13). This document MUST validate without errors.

## Registry
```yaml
perspectives:
  P-X:
    description: "Single perspective"
entities:
  E-1:
    kind: "claim"
    perspective_scope: "P-X"
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
    perspectives: "P-X"
    anchorage:
      view: "design"
      phase: "implementation"
    occurrences: ["OCC-1"]
```
