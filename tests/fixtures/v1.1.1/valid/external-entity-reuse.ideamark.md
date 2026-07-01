---
ideamark_version: "1.1.1"
doc_id: "DOC-V111-EXTERNAL-REUSE"
doc_type: "derived"
status:
  state: "in_progress"
created_at: "2026-07-01"
updated_at: "2026-07-01"
lang: "en"
---
Recursive usage-log case: a session that reused a past entity is itself recorded as a new document whose occurrence references the SAME entity id in the past document. External references are opaque to Core validation and MUST NOT be errors.

## Registry
```yaml
entities:
  E-SESSION-NOTE-001:
    kind: "observation"
    payload:
      format:
        media_type: "text/markdown"
      body: "Applied the drainage claim to the 2026 renewal plan."
occurrences:
  OCC-REUSED-PAST:
    entity: "ideamark://docs/DOC-PAST-SESSION#/entities/E-CLAIM-001"
    role: "evidence"
  OCC-LOCAL-NOTE:
    entity: "E-SESSION-NOTE-001"
    role: "observation"
sections:
  SEC-REUSE-TRACE:
    title: "Reuse trace"
    anchorage:
      view: ["knowledge-reuse"]
      phase: ["application"]
    occurrences: ["OCC-REUSED-PAST", "OCC-LOCAL-NOTE"]
```
