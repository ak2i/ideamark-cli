```yaml
ideamark_version: "1.0.3"
doc_id: "ideamark.guides.builtin.v0.1.3.sample.v0.0.1"
doc_type: "pattern"
status:
  state: "in_progress"
created_at: "2026-03-03T12:44:52.874879+00:00"
updated_at: "2026-03-03T12:44:52.874879+00:00"
lang: "en-US"
```

# Built-in Guides (Sample Source for describe ls / describe routing)

This document is a **sample** built-in guides source used to validate the design of:

- `ideamark describe ls --target guides`
- `ideamark describe routing`

It demonstrates that guides can use **anchorage.view variations** (background/problem/solution/decision),
and that **anchorage.domain** can be used as routing-oriented tags.

---

## IDEAMARK_SCOPE_BACKGROUND

```yaml
section_id: "SEC-IMK-SCOPE-BACKGROUND"
anchorage:
  view: "background"
  phase: "confirmed"
  domain: ["guides", "routing", "scope"]
```

### Overview

IdeaMark is for **knowledge reuse and validation** of structured documents:
- Capture stable sections, occurrences, and entities.
- Maintain stable IDs and references.
- Support split/merge/extract/compose operations and validation tooling.

When your task is primarily *list execution and iteration*, consider FlowMark.

```yaml
occurrences:
  - occurrence_id: "OCC-IMK-SCOPE-001"
    role: "explanation"
    entity_id: "IE-IMK-SCOPE-001"
entities:
  - entity_id: "IE-IMK-SCOPE-001"
    kind: "concept"
    content_lang: "en-US"
    content: |
      IdeaMark focuses on knowledge structure and reuse. It is most effective after ideas are articulated enough
      to be stabilized into sections/entities with references.
```

---

## IDEAMARK_SCOPE_PROBLEM

```yaml
section_id: "SEC-IMK-SCOPE-PROBLEM"
anchorage:
  view: "problem"
  phase: "confirmed"
  domain: ["guides", "routing", "problem-space"]
```

```yaml
occurrences:
  - occurrence_id: "OCC-IMK-PROBLEM-001"
    role: "observation"
    entity_id: "IE-IMK-PROBLEM-001"
entities:
  - entity_id: "IE-IMK-PROBLEM-001"
    kind: "observation"
    content_lang: "en-US"
    content: |
      Use IdeaMark when: (a) requirements/specs are hard to trace, (b) IDs/references are missing,
      (c) you need repeatable extraction/merge, (d) you need validation and evidence.
```

---

## IDEAMARK_SCOPE_NON_GOALS

```yaml
section_id: "SEC-IMK-SCOPE-NONGOALS"
anchorage:
  view: "background"
  phase: "confirmed"
  domain: ["guides", "routing", "non-goals"]
```

```yaml
occurrences:
  - occurrence_id: "OCC-IMK-NONGOAL-001"
    role: "constraint"
    entity_id: "IE-IMK-NONGOAL-001"
entities:
  - entity_id: "IE-IMK-NONGOAL-001"
    kind: "note"
    content_lang: "en-US"
    content: |
      IdeaMark is not optimized for step-by-step task checklists with frequent reordering and iteration.
      For iterative execution lists and repeated cycles, prefer FlowMark.
```

---

## ROUTING_DECISION

```yaml
section_id: "SEC-ROUTING-DECISION"
anchorage:
  view: "decision"
  phase: "confirmed"
  domain: ["guides", "routing", "decision"]
```

```yaml
occurrences:
  - occurrence_id: "OCC-ROUTING-DECISION-001"
    role: "decision"
    entity_id: "IE-ROUTING-DECISION-001"
entities:
  - entity_id: "IE-ROUTING-DECISION-001"
    kind: "decision"
    content_lang: "en-US"
    content: |
      If the user goal is "deepen discussion" or "manage iterative work items", route to FlowMark first.
      If the goal is "stabilize knowledge / validate structure / enable reuse", route to IdeaMark.
      If both are needed: FlowMark → IdeaMark (stabilize the outcome).
```

---

## SOLUTION_BREAKDOWN

```yaml
section_id: "SEC-SOLUTION-BREAKDOWN"
anchorage:
  view: "solution"
  phase: "confirmed"
  domain: ["guides", "breakdown", "solution"]
```

```yaml
occurrences:
  - occurrence_id: "OCC-BREAKDOWN-EN-001"
    role: "enables"
    entity_id: "IE-BREAKDOWN-EN-001"
entities:
  - entity_id: "IE-BREAKDOWN-EN-001"
    kind: "plan"
    content_lang: "en-US"
    content: |
      To split a document into sections/occurrences, use: ideamark extract --section <id> or ideamark extract --occ <id>.
      Use ideamark validate --strict to ensure IDs and references remain consistent.
```

---

End of sample built-in guides.
