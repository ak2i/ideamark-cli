---
ideamark_version: "1.1.1"
doc_id: "DOC-V111-REF-CACHE"
doc_type: "derived"
status:
  state: "in_progress"
created_at: "2026-07-01"
updated_at: "2026-07-01"
lang: "en"
---
Valid payload combination: ref + cache (§7.7).

## Registry
```yaml
entities:
  E-RC-001:
    kind: "evidence"
    payload:
      format:
        media_type: "text/markdown"
      ref:
        uri: "https://example.org/source.md"
        selector: "#sec-2"
      cache:
        body: "Cached copy of the referenced fragment."
        captured_at: "2026-06-16T00:00:00+09:00"
occurrences:
  OCC-001:
    entity: "E-RC-001"
    role: "evidence"
sections:
  SEC-001:
    occurrences: ["OCC-001"]
```
