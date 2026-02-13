# Broken YAML Fixture

```yaml
ideamark_version: 1
doc_id: "fixture.broken.001"
doc_type: "evolving"
status: "in_progress"
created_at: "2026-02-14"
updated_at: "2026-02-14"
lang: "ja-JP"
domain: [fixture]
tags: [test]
refs:
  sources: []
```

## Bad Section

```yaml
section_id SEC-001   # <- colon missing (invalid YAML)
anchorage:
  view: background
  phase: exploration
  domain: [flowmark, ai, guides]
```

この文書は validate で検出されるべき。
