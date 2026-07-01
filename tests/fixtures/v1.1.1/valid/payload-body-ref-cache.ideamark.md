---
ideamark_version: "1.1.1"
doc_id: "DOC-V111-BODY-REF-CACHE"
doc_type: "derived"
status:
  state: "in_progress"
created_at: "2026-07-01"
updated_at: "2026-07-01"
lang: "en"
---
Valid payload combination: body + ref + cache (§7.7).

## Registry
```yaml
entities:
  E-FULL-001:
    kind: "claim"
    payload:
      format:
        media_type: "text/markdown"
        profile: "example-profile"
        version: "1.0"
      body: "Authored restatement."
      ref:
        uri: "https://example.org/origin.md"
      cache:
        body: "Snapshot of the origin."
        captured_at: "2026-06-16T00:00:00+09:00"
        source_hash: "sha256:abc123"
occurrences:
  OCC-001:
    entity: "E-FULL-001"
    role: "claim"
sections:
  SEC-001:
    occurrences: ["OCC-001"]
```
