---
created_at: "2026-02-28T12:00:00+09:00"
doc_id: ideamark.cli.v0.1.3.dev-spec.v0.0.8.2026-02-28
doc_type: spec
ideamark_version: 1
lang: ja-JP
status: in_progress
template:
  description: v0.0.6 内容を Occurrence 単位で保持し再編した v0.0.8
  file: Decision6-WorkCell.ideamark.template.v1.0.3.md
  id: imtpl.decision6.workcell
  name: Decision6 WorkCell Template
  version: 1.0.3
updated_at: "2026-02-27T23:48:15.832974"
---

# Overview

v0.0.6 の内容を Occurrence 単位で保持しつつ、 Decision6 WorkCell
骨格へ再編した v0.0.8。

------------------------------------------------------------------------

# Section 000 : Routing & Inbox Operating Model

``` yaml
section_id: "SEC-ROUTING"
anchorage:
  view: "decision"
  phase: "design"
  domain: ["workcell", "routing"]
```

Section骨格固定、INBOX運用、merge定期、refactorはpivot時のみ。

------------------------------------------------------------------------

# Section 001 : Intent

``` yaml
section_id: "SEC-INTENT"
anchorage:
  view: "decision"
  phase: "plan"
  domain: ["ideamark", "cli"]
```

guides改修、直交I/F確立、breakdown導入、自走フロー確立。

------------------------------------------------------------------------

# Section 002 : Hypotheses

``` yaml
section_id: "SEC-HYPOTHESIS"
anchorage:
  view: "problem"
  phase: "hypothesis"
```

H1 guides最小化で修正ループ削減\
H2 直交I/Fで自走安定\
H3 copy既定で衝突低減

------------------------------------------------------------------------

# Section 004 : Design

``` yaml
section_id: "SEC-DESIGN"
anchorage:
  view: "solution"
  phase: "design"
```

describe直交I/F、ai-small/ai-large、breakdown copy既定。

------------------------------------------------------------------------

# Section 005 : Capabilities & Recipes

``` yaml
section_id: "SEC-CAPABILITIES"
anchorage:
  view: "solution"
  phase: "design"
```

capabilities=indexのみ、guides二段階。

------------------------------------------------------------------------

# Section 006 : Metrics

``` yaml
section_id: "SEC-METRICS"
anchorage:
  view: "observation_series"
  phase: "plan"
```

M1〜M4検証指標。

------------------------------------------------------------------------

# Section 007 : Decision Log

``` yaml
section_id: "SEC-DECISION"
anchorage:
  view: "decision"
  phase: "confirmed"
```

D1〜D4確定。

------------------------------------------------------------------------

# Entities Registry

``` yaml
entities:

  IE-INTENT:
    kind: "decision_package"
    content: "v0.1.3でguides改修とbreakdownを確定"
    atomic_state: false

  IE-H1:
    kind: "hypothesis"
    content: "guides最小化で修正ループ削減"

  IE-H2:
    kind: "hypothesis"
    content: "直交I/Fで自走安定"

  IE-H3:
    kind: "hypothesis"
    content: "copy既定で衝突低減"

  IE-DESIGN:
    kind: "design"
    content: "describe直交I/F＋guides階層化＋breakdown policy"

  IE-METRICS:
    kind: "metric"
    content: "LLM検証指標セット"
    measure_type: "quality"

occurrences:

  OCC-INTENT:
    entity: "IE-INTENT"
    role: "problem_core"
    status:
      state: "confirmed"

  OCC-H1:
    entity: "IE-H1"
    role: "hypothesis"
    status:
      state: "provisional"

  OCC-H2:
    entity: "IE-H2"
    role: "hypothesis"
    status:
      state: "provisional"

  OCC-H3:
    entity: "IE-H3"
    role: "hypothesis"
    status:
      state: "provisional"

  OCC-DESIGN:
    entity: "IE-DESIGN"
    role: "solution"
    status:
      state: "confirmed"

  OCC-METRICS:
    entity: "IE-METRICS"
    role: "measures"
    status:
      state: "confirmed"

sections:

  SEC-INTENT:
    anchorage:
      view: "decision"
      phase: "plan"
    occurrences: ["OCC-INTENT"]

  SEC-HYPOTHESIS:
    anchorage:
      view: "problem"
      phase: "hypothesis"
    occurrences: ["OCC-H1", "OCC-H2", "OCC-H3"]

  SEC-DESIGN:
    anchorage:
      view: "solution"
      phase: "design"
    occurrences: ["OCC-DESIGN"]

  SEC-METRICS:
    anchorage:
      view: "observation_series"
      phase: "plan"
    occurrences: ["OCC-METRICS"]

relations:
  - type: "supports"
    from: "IE-H2"
    to: "IE-DESIGN"
  - type: "supports"
    from: "IE-H3"
    to: "IE-DESIGN"
  - type: "measures"
    from: "IE-METRICS"
    to: "IE-H1"

structure:
  sections:
    - "SEC-ROUTING"
    - "SEC-INTENT"
    - "SEC-HYPOTHESIS"
    - "SEC-DESIGN"
    - "SEC-CAPABILITIES"
    - "SEC-METRICS"
    - "SEC-DECISION"
    - "SEC-INBOX"
```

------------------------------------------------------------------------

End of v0.0.8
