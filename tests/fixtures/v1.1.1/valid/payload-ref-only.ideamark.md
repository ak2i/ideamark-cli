---
ideamark_version: "1.1.1"
doc_id: "DOC-V111-REF-ONLY"
doc_type: "derived"
status:
  state: "in_progress"
created_at: "2026-07-01"
updated_at: "2026-07-01"
lang: "en"
---
Valid payload combination: ref only (§7.7). ref.uri is required; selector is optional (§7.9). URI reachability is outside Core validation (§7.16).

## Registry
```yaml
entities:
  E-EXT-001:
    kind: "evidence"
    payload:
      format:
        media_type: "text/markdown"
      ref:
        uri: "./knowledge/example.okf.md"
        selector: "#claim-001"
occurrences:
  OCC-001:
    entity: "E-EXT-001"
    role: "evidence"
sections:
  SEC-001:
    occurrences: ["OCC-001"]
```
