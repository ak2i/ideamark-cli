---
ideamark_version: "1.1.1"
doc_id: "DOC-V111-MINIMAL-BODY"
doc_type: "derived"
status:
  state: "in_progress"
created_at: "2026-07-01"
updated_at: "2026-07-01"
lang: "en"
---
Minimal valid document: payload with body only (Core Constraints §7.7).

## Registry
```yaml
entities:
  E-CLAIM-001:
    kind: "claim"
    payload:
      format:
        media_type: "text/markdown"
      body: "Rainwater tanks reduce peak drainage load."
occurrences:
  OCC-001:
    entity: "E-CLAIM-001"
    role: "claim"
sections:
  SEC-001:
    title: "Findings"
    anchorage:
      view: ["urban-drainage"]
      phase: ["analysis"]
    occurrences: ["OCC-001"]
```
