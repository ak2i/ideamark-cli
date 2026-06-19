---
ideamark_version: "1.1.1"
doc_id: "ideamark.guides.builtin.v0.2.0.sample.ja.v0.0.1"
doc_type: "pattern"
status:
  state: "in_progress"
created_at: "2026-06-19T00:00:00Z"
updated_at: "2026-06-19T00:00:00Z"
lang: "ja-JP"
---

# Built-in Guides Sample for v0.2.0 ja-JP

## SEC-IMK-SCOPE-BACKGROUND-JA
```yaml
section_id: "SEC-IMK-SCOPE-BACKGROUND-JA"
title: "IdeaMark の適用背景"
anchorage:
  view: "background"
  phase: "confirmed"
  domain: ["guides", "routing", "scope"]
occurrences: ["OCC-IMK-SCOPE-JA-001"]
```

## SEC-IMK-SCOPE-PROBLEM-JA
```yaml
section_id: "SEC-IMK-SCOPE-PROBLEM-JA"
title: "IdeaMark の問題設定"
anchorage:
  view: "problem"
  phase: "confirmed"
  domain: ["guides", "routing", "problem-space"]
occurrences: ["OCC-IMK-PROBLEM-JA-001"]
```

## SEC-ROUTING-DECISION-JA
```yaml
section_id: "SEC-ROUTING-DECISION-JA"
title: "Routing 判断"
anchorage:
  view: "decision"
  phase: "confirmed"
  domain: ["guides", "routing", "decision"]
occurrences: ["OCC-ROUTING-DECISION-JA-001"]
```

## SEC-SOLUTION-BREAKDOWN-JA
```yaml
section_id: "SEC-SOLUTION-BREAKDOWN-JA"
title: "Breakdown 方針"
anchorage:
  view: "solution"
  phase: "confirmed"
  domain: ["guides", "breakdown", "solution"]
occurrences: ["OCC-BREAKDOWN-JA-001"]
```

## Registry
```yaml
entities:
  IE-IMK-SCOPE-JA-001:
    kind: "concept"
    payload:
      body: "IdeaMark は再利用可能な構造の安定化に向いている。"
      format:
        media_type: "text/plain"
    atomicity_basis: "interpretive"
  IE-IMK-PROBLEM-JA-001:
    kind: "observation"
    payload:
      body: "追跡性や構造検証が重要な場合に IdeaMark を使う。"
      format:
        media_type: "text/plain"
    atomicity_basis: "interpretive"
  IE-ROUTING-DECISION-JA-001:
    kind: "decision"
    payload:
      body: "知識構造の安定化を優先するなら IdeaMark を先に使う。"
      format:
        media_type: "text/plain"
    atomicity_basis: "interpretive"
  IE-BREAKDOWN-JA-001:
    kind: "plan"
    payload:
      body: "extract と strict validate を組み合わせて breakdown を進める。"
      format:
        media_type: "text/plain"
    atomicity_basis: "interpretive"
occurrences:
  OCC-IMK-SCOPE-JA-001:
    entity: "IE-IMK-SCOPE-JA-001"
    role: "explanation"
  OCC-IMK-PROBLEM-JA-001:
    entity: "IE-IMK-PROBLEM-JA-001"
    role: "observation"
  OCC-ROUTING-DECISION-JA-001:
    entity: "IE-ROUTING-DECISION-JA-001"
    role: "decision"
  OCC-BREAKDOWN-JA-001:
    entity: "IE-BREAKDOWN-JA-001"
    role: "objective"
sections:
  SEC-IMK-SCOPE-BACKGROUND-JA:
    title: "IdeaMark の適用背景"
    anchorage:
      view: "background"
      phase: "confirmed"
      domain: ["guides", "routing", "scope"]
    occurrences: ["OCC-IMK-SCOPE-JA-001"]
  SEC-IMK-SCOPE-PROBLEM-JA:
    title: "IdeaMark の問題設定"
    anchorage:
      view: "problem"
      phase: "confirmed"
      domain: ["guides", "routing", "problem-space"]
    occurrences: ["OCC-IMK-PROBLEM-JA-001"]
  SEC-ROUTING-DECISION-JA:
    title: "Routing 判断"
    anchorage:
      view: "decision"
      phase: "confirmed"
      domain: ["guides", "routing", "decision"]
    occurrences: ["OCC-ROUTING-DECISION-JA-001"]
  SEC-SOLUTION-BREAKDOWN-JA:
    title: "Breakdown 方針"
    anchorage:
      view: "solution"
      phase: "confirmed"
      domain: ["guides", "breakdown", "solution"]
    occurrences: ["OCC-BREAKDOWN-JA-001"]
relations: {}
perspectives: {}
structure:
  sections:
    - "SEC-IMK-SCOPE-BACKGROUND-JA"
    - "SEC-IMK-SCOPE-PROBLEM-JA"
    - "SEC-ROUTING-DECISION-JA"
    - "SEC-SOLUTION-BREAKDOWN-JA"
```
