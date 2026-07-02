---
ideamark_version: "1.1.1"
doc_id: "DOC-V111-FORWARD-COMPAT"
doc_type: "derived"
status:
  state: "in_progress"
created_at: "2026-07-01"
updated_at: "2026-07-01"
lang: "en"
---
Forward compatibility (§7.18): unknown fields are ignored and an unknown payload profile MUST NOT invalidate the document. Vocabulary is intentionally uncontrolled (§7.12).

## Registry
```yaml
entities:
  E-1:
    kind: "totally-novel-kind/with-slash"
    custom_extension_field: "ignored by core"
    payload:
      format:
        media_type: "application/x-future-format"
        profile: "com.example/unknown-profile-v9"
      body: "Payload in an unknown profile."
occurrences:
  OCC-1:
    entity: "E-1"
    role: "invented-role-2049"
    confidence: 0.42
sections:
  SEC-1:
    anchorage:
      view: ["viewpoint-that-no-vocabulary-defines"]
      phase: ["phase-42"]
    occurrences: ["OCC-1"]
    x_experimental: true
x_registry_extension:
  note: "unknown top-level registry field"
```
