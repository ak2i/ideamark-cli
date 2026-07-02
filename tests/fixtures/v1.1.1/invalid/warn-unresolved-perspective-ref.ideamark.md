---
ideamark_version: "1.1.1"
doc_id: "DOC-V111-WARN-PERSP-REF"
doc_type: "derived"
status:
  state: "in_progress"
created_at: "2026-07-02"
updated_at: "2026-07-02"
lang: "en"
---

WARNING expected, NOT an error (Core Spec §2.4 / ADR-0002): bare perspective_refs that do not resolve within the document -> perspective_ref_unresolved, at all three sites (perspectives.base / sections.perspectives / entities.perspective_scope). Reference integrity (§7.4) intentionally excludes perspective_ref, so the document stays valid.

## Registry
```yaml
perspectives:
  P-1:
    description: "Perspective whose base does not resolve."
    base: "P-GONE"
entities:
  E-1:
    kind: "claim"
    perspective_scope: ["P-LOST"]
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
    perspectives: ["P-MISSING"]
    occurrences: ["OCC-1"]
```
