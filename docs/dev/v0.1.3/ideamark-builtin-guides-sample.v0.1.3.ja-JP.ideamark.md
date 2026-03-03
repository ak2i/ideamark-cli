```yaml
ideamark_version: "1.0.3"
doc_id: "ideamark.guides.builtin.v0.1.3.sample.ja.v0.0.1"
doc_type: "pattern"
status:
  state: "in_progress"
created_at: "2026-03-03T12:51:57.630540+00:00"
updated_at: "2026-03-03T12:51:57.630540+00:00"
lang: "ja-JP"
```

# 内蔵 Guides（describe ls / describe routing 用サンプル：ja-JP）

この文書は以下の設計を検証するための最小サンプルです：

- `ideamark describe ls --target guides`
- `ideamark describe routing`

anchorage.view のバリエーション（background / problem / solution / decision）と、
anchorage.domain を routing 用タグとして利用する例を示します。

---

## IDEAMARK_SCOPE_BACKGROUND_JA

```yaml
section_id: "SEC-IMK-SCOPE-BACKGROUND-JA"
anchorage:
  view: "background"
  phase: "confirmed"
  domain: ["guides", "routing", "scope"]
```

IdeaMark は、構造化された知識の再利用と検証のための文書形式です。

- Section / Occurrence / Entity を安定したIDで管理
- 参照整合性の維持
- 分割・統合・抽出・検証を支援

反復的な作業項目管理が主目的の場合は FlowMark を検討してください。

```yaml
occurrences:
  - occurrence_id: "OCC-IMK-SCOPE-JA-001"
    role: "explanation"
    entity_id: "IE-IMK-SCOPE-JA-001"
entities:
  - entity_id: "IE-IMK-SCOPE-JA-001"
    kind: "concept"
    content_lang: "ja-JP"
    content: |
      IdeaMark は、議論や仕様がある程度固まり、再利用可能な知識構造として
      安定化させたい段階で最も効果を発揮する。
```

---

## IDEAMARK_SCOPE_PROBLEM_JA

```yaml
section_id: "SEC-IMK-SCOPE-PROBLEM-JA"
anchorage:
  view: "problem"
  phase: "confirmed"
  domain: ["guides", "routing", "problem-space"]
```

```yaml
occurrences:
  - occurrence_id: "OCC-IMK-PROBLEM-JA-001"
    role: "observation"
    entity_id: "IE-IMK-PROBLEM-JA-001"
entities:
  - entity_id: "IE-IMK-PROBLEM-JA-001"
    kind: "observation"
    content_lang: "ja-JP"
    content: |
      要件や仕様の追跡が困難である、IDや参照が不安定である、
      分割・統合を繰り返しながら整合を取りたい、といった場合に IdeaMark を使用する。
```

---

## ROUTING_DECISION_JA

```yaml
section_id: "SEC-ROUTING-DECISION-JA"
anchorage:
  view: "decision"
  phase: "confirmed"
  domain: ["guides", "routing", "decision"]
```

```yaml
occurrences:
  - occurrence_id: "OCC-ROUTING-DECISION-JA-001"
    role: "decision"
    entity_id: "IE-ROUTING-DECISION-JA-001"
entities:
  - entity_id: "IE-ROUTING-DECISION-JA-001"
    kind: "decision"
    content_lang: "ja-JP"
    content: |
      「議論の深化」や「反復的な作業項目管理」が主目的であれば FlowMark を先に利用する。
      「知識構造の安定化」や「再利用・検証」が主目的であれば IdeaMark を利用する。
      両方必要な場合は FlowMark → IdeaMark の順で適用する。
```

---

## SOLUTION_BREAKDOWN_JA

```yaml
section_id: "SEC-SOLUTION-BREAKDOWN-JA"
anchorage:
  view: "solution"
  phase: "confirmed"
  domain: ["guides", "breakdown", "solution"]
```

```yaml
occurrences:
  - occurrence_id: "OCC-BREAKDOWN-JA-001"
    role: "enables"
    entity_id: "IE-BREAKDOWN-JA-001"
entities:
  - entity_id: "IE-BREAKDOWN-JA-001"
    kind: "plan"
    content_lang: "ja-JP"
    content: |
      文書を分割するには ideamark extract --section <id> または
      ideamark extract --occ <id> を使用する。
      ideamark validate --strict により整合性を確認する。
```

---

End of ja-JP sample built-in guides.
