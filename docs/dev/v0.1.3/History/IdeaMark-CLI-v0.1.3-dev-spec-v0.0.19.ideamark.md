```yaml
ideamark_version: "1.0.3"
doc_id: "ideamark.cli.v0.1.3.dev-spec.v0.0.19.2026-03-04"
doc_type: "evolving"
status:
  state: "in_progress"
created_at: "2026-03-01T00:00:00Z"
updated_at: "2026-03-03T22:37:40.598090+00:00"
lang: "ja-JP"
```
# IdeaMark-CLI v0.1.3 Development Spec (v0.0.19)
v0.0.18 を基準に、v0.0.17 に存在していた仕様要素の欠落がないかを再点検し、
不足していた「継続処理 / refs / detail_doc / attribution / derived_from / relations / structure 明示」系を補強した版。

---

## SEC-META-REFS

```yaml
section_id: "SEC-META-REFS"
anchorage:
  view: "background"
  phase: "confirmed"
  domain: ["meta", "refs", "template", "continuation"]
occurrences:
  - occurrence_id: "OCC-META-REFS-001"
    role: "explanation"
    entity_id: "IE-META-REFS-001"
entities:
  - entity_id: "IE-META-REFS-001"
    kind: "concept"
    content: |
      v0.0.17 で明示していた Header/refs/template/continuation の扱いを
      v0.0.18 で簡素化しすぎていたため復元・整理する。
      本仕様書も doc_type: evolving として continuation を持つ前提とする。
```

### Header拡張（保持）
- `refs.sources`（role: template / background など）
- `template` ブロック（テンプレート由来時）
- `continuation` ブロック（evolving時）

---

## SEC-DETAIL-DOC-POLICY

```yaml
section_id: "SEC-DETAIL-DOC-POLICY"
anchorage:
  view: "solution"
  phase: "design"
  domain: ["detail_doc", "parent_ref", "elaboration"]
occurrences:
  - occurrence_id: "OCC-DETAIL-DOC-001"
    role: "decision"
    entity_id: "IE-DETAIL-DOC-001"
entities:
  - entity_id: "IE-DETAIL-DOC-001"
    kind: "decision"
    content: |
      describe routing / describe ls の設計説明が肥大化する場合、
      detail_doc を用いて詳細仕様へ分離できる設計とする。
      親側は detail_doc、子側は refs.parent を必須とする。
```

---

## SEC-OCCURRENCE-ATTRIBUTION

```yaml
section_id: "SEC-OCCURRENCE-ATTRIBUTION"
anchorage:
  view: "solution"
  phase: "design"
  domain: ["occurrence", "attribution", "generated_by"]
occurrences:
  - occurrence_id: "OCC-ATTR-001"
    role: "plan"
    entity_id: "IE-ATTR-001"
entities:
  - entity_id: "IE-ATTR-001"
    kind: "plan"
    content: |
      describe 系出力は attribution.generated_by を large_llm / human で区別可能とする。
      CLI 自動生成JSONには generated_by: human を既定値として付与可能。
```

---

## SEC-DERIVED-FROM

```yaml
section_id: "SEC-DERIVED-FROM"
anchorage:
  view: "solution"
  phase: "design"
  domain: ["derived_from", "extraction", "merge"]
occurrences:
  - occurrence_id: "OCC-DERIVED-001"
    role: "explanation"
    entity_id: "IE-DERIVED-001"
entities:
  - entity_id: "IE-DERIVED-001"
    kind: "concept"
    content: |
      merge シミュレーション（v0.0.17→v0.0.18→v0.0.19）は
      derived_from.operation: synthesized とみなせる。
      将来的に ideamark merge 実装時は operation を
      extraction / synthesis / refinement などで明示する。
```

---

## SEC-RELATIONS-STRUCTURE

```yaml
section_id: "SEC-RELATIONS-STRUCTURE"
anchorage:
  view: "background"
  phase: "confirmed"
  domain: ["relations", "structure", "order"]
occurrences:
  - occurrence_id: "OCC-REL-001"
    role: "explanation"
    entity_id: "IE-REL-001"
entities:
  - entity_id: "IE-REL-001"
    kind: "concept"
    content: |
      本仕様書でも relations / structure を明示可能とする。
      routing は background → problem → decision → solution の
      推奨順を構造的に持てる。
```

---

## SEC-CAPABILITIES-COMPLETE

```yaml
section_id: "SEC-CAPABILITIES-COMPLETE"
anchorage:
  view: "decision"
  phase: "confirmed"
  domain: ["capabilities", "contract", "completeness"]
occurrences:
  - occurrence_id: "OCC-CAPS-COMP-001"
    role: "decision"
    entity_id: "IE-CAPS-COMP-001"
entities:
  - entity_id: "IE-CAPS-COMP-001"
    kind: "decision"
    content: |
      v0.0.17 に存在した要素のうち、
      - languages.available/default/topics
      - routing.discovery(entrypoints/selectors/fallback)
      - describe topics 一覧
      - 後方互換ポリシー
      は v0.0.18 で保持されていることを確認。
      欠落していた meta/continuation/detail_doc/derived_from/attribution を
      本版で補完した。
```

---

## continuation（実験的保持）

```yaml
continuation:
  last_processed_at: "2026-03-03T22:37:40.598090+00:00"
  open_threads:
    - "ideamark merge コマンド正式仕様化"
    - "routing JSON schema 固定化"
  suggested_next:
    - "v0.1.3 実装開始"
    - "describe ls 実装→テスト"
  pending_decisions:
    - question: "merge を CLI 標準機能にするか？"
      options: ["v0.2.0 で実装", "外部ツールとして提供"]
```

---

End of v0.0.19
