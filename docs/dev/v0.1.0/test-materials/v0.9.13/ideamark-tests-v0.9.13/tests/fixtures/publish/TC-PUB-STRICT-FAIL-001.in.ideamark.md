---
ideamark_version: 1
doc_id: "DOC-PUB-FAIL"
status:
  state: "in_progress"
created_at: "2026-02-20"
updated_at: "2026-02-20"
lang: "en"
---

## SEC-FAIL
```yaml
section_id: "SEC-FAIL"
anchorage:
  view: "design"
  phase: "implementation"
occurrences: ["OCC-FAIL"]
```

```yaml
occurrence_id: "OCC-FAIL"
entity: "IE-FAIL"
role: "observation"
status:
  state: "confirmed"
```

## Registry
```yaml
entities:
  IE-FAIL:
    kind: "observation"
    content: "Fail entity"
occurrences:
  OCC-FAIL:
    entity: "IE-FAIL"
    role: "observation"
    status: { state: "confirmed" }
sections:
  SEC-FAIL:
    anchorage: { view: "design", phase: "implementation" }
    occurrences: ["OCC-FAIL"]
structure:
  sections: ["SEC-FAIL"]
```
