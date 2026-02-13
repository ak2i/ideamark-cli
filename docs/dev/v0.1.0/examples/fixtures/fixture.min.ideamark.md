# Minimal Fixture

```yaml
ideamark_version: 1
doc_id: "fixture.min.001"
doc_type: "evolving"
status: "in_progress"
created_at: "2026-02-14"
updated_at: "2026-02-14"
lang: "ja-JP"
domain: [fixture, ideamark]
tags: [test]
refs:
  sources: []
```

## Background

```yaml
section_id: SEC-001
anchorage:
  view: background
  phase: exploration
  domain: [flowmark, ai, guides]
```

背景セクション本文。

## Rules

```yaml
section_id: SEC-002
anchorage:
  view: rules
  phase: decision
  domain: [flowmark, ai, guides]
```

ルールセクション本文。

```yaml
sections:
  SEC-001: { title: "Background" }
  SEC-002: { title: "Rules" }
structure:
  sections: [SEC-001, SEC-002]
```
