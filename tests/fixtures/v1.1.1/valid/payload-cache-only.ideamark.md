---
ideamark_version: "1.1.1"
doc_id: "DOC-V111-CACHE-ONLY"
doc_type: "derived"
status:
  state: "in_progress"
created_at: "2026-07-01"
updated_at: "2026-07-01"
lang: "en"
---
Valid payload combination: cache only (§7.7, §7.10).

## Registry
```yaml
entities:
  E-SNAP-001:
    kind: "observation"
    payload:
      format:
        media_type: "text/plain"
      cache:
        body: "Observed water level at 2.3m."
        captured_at: "2026-06-16T00:00:00+09:00"
        source_hash: "sha256:0f1e2d"
occurrences:
  OCC-001:
    entity: "E-SNAP-001"
    role: "observation"
sections:
  SEC-001:
    occurrences: ["OCC-001"]
```
