```yaml
ideamark_version: "1.0.3"
doc_id: "ideamark.cli.v0.1.3.dev-spec.v0.0.20.2026-03-04"
doc_type: "evolving"
status:
  state: "in_progress"
created_at: "2026-03-01T00:00:00Z"
updated_at: "2026-03-03T22:42:49.454083+00:00"
lang: "ja-JP"
```

# IdeaMark-CLI v0.1.3 Development Spec (v0.0.20)
v0.0.17 の網羅性を完全保持しつつ、v0.0.19 の構造整理を統合した完成版。
目的・背景・設計理由・決定事項・非目標・後方互換・来歴管理をすべて明示する。

---

## SEC-PURPOSE-AND-RATIONALE

```yaml
section_id: "SEC-PURPOSE-AND-RATIONALE"
anchorage:
  view: "background"
  phase: "confirmed"
  domain: ["purpose", "rationale", "v0.1.3"]
occurrences:
  - occurrence_id: "OCC-PURPOSE-001"
    role: "explanation"
    entity_id: "IE-PURPOSE-001"
entities:
  - entity_id: "IE-PURPOSE-001"
    kind: "concept"
    content: |
      v0.1.3 の目的は、Doc-CLI-Contract v1.0.3 に整合しつつ、
      内蔵 guides を探索可能にする describe 拡張（ls / routing）を正式設計することである。
      なぜ必要か：
      - 複数Doc系CLI環境でLLMが自律探索できる必要がある
      - ファイル名に依存しない資産列挙が必要
      - routing概念を共通化しつつツール固有設計を許容するため
```

---

## SEC-SCOPE-AND-NONGOALS

```yaml
section_id: "SEC-SCOPE-AND-NONGOALS"
anchorage:
  view: "problem"
  phase: "confirmed"
  domain: ["scope", "non_goals"]
occurrences:
  - occurrence_id: "OCC-SCOPE-001"
    role: "explanation"
    entity_id: "IE-SCOPE-001"
entities:
  - entity_id: "IE-SCOPE-001"
    kind: "concept"
    content: |
      Scope:
      - describe capabilities v1.0.3対応
      - describe ls / describe routing 実装仕様確定
      - guides 内蔵・言語切替設計
      - ls 後方互換拡張（domain追加）
      
      Non-goals:
      - mergeコマンドの正式実装（v0.2.0以降）
      - routing JSON schemaの厳密固定（将来課題）
```

---

## SEC-CONTRACT-ALIGNMENT

```yaml
section_id: "SEC-CONTRACT-ALIGNMENT"
anchorage:
  view: "solution"
  phase: "confirmed"
  domain: ["doc-cli-contract", "alignment"]
occurrences:
  - occurrence_id: "OCC-CONTRACT-001"
    role: "decision"
    entity_id: "IE-CONTRACT-001"
entities:
  - entity_id: "IE-CONTRACT-001"
    kind: "decision"
    content: |
      Doc-CLI-Contract v1.0.3 に準拠。
      SHOULD topics として describe ls / describe routing を追加。
      capabilities.features に routing / languages を追加。
      既存 consumer 互換を壊さない（フィールド追加のみ）。
```

---

## SEC-CAPABILITIES-COMPLETE

```yaml
section_id: "SEC-CAPABILITIES-COMPLETE"
anchorage:
  view: "solution"
  phase: "design"
  domain: ["capabilities", "features"]
occurrences:
  - occurrence_id: "OCC-CAPS-001"
    role: "plan"
    entity_id: "IE-CAPS-001"
entities:
  - entity_id: "IE-CAPS-001"
    kind: "plan"
    content: |
      describe capabilities 完成版は以下を含む：
      - topics: ai-authoring, params, capabilities, checklist, vocab, ls, routing
      - features.routing.discovery(entrypoints/selectors/fallback_search)
      - features.languages.available/default/topics
      - backward compatibility policy
```

---

## SEC-GUIDES-ASSETS

```yaml
section_id: "SEC-GUIDES-ASSETS"
anchorage:
  view: "solution"
  phase: "design"
  domain: ["guides", "builtin", "lang"]
occurrences:
  - occurrence_id: "OCC-GUIDES-001"
    role: "decision"
    entity_id: "IE-GUIDES-001"
entities:
  - entity_id: "IE-GUIDES-001"
    kind: "decision"
    content: |
      内蔵 guides は1言語1doc方式。
      describe --lang で切替。
      物理パスは公開しない。
      anchorage.view は background/problem/decision/solution を有効活用。
      anchorage.domain は routing探索タグとして利用。
```

---

## SEC-DESCRIBE-LS

```yaml
section_id: "SEC-DESCRIBE-LS"
anchorage:
  view: "solution"
  phase: "design"
  domain: ["describe", "ls"]
occurrences:
  - occurrence_id: "OCC-LS-001"
    role: "plan"
    entity_id: "IE-LS-001"
entities:
  - entity_id: "IE-LS-001"
    kind: "plan"
    content: |
      describe ls は内蔵 guides の catalog 抽出。
      既存 ls ルーチンを再利用。
      sections[].domain を追加（後方互換維持）。
```

---

## SEC-DESCRIBE-ROUTING

```yaml
section_id: "SEC-DESCRIBE-ROUTING"
anchorage:
  view: "solution"
  phase: "design"
  domain: ["describe", "routing"]
occurrences:
  - occurrence_id: "OCC-ROUTING-001"
    role: "plan"
    entity_id: "IE-ROUTING-001"
entities:
  - entity_id: "IE-ROUTING-001"
    kind: "plan"
    content: |
      describe routing は guides から routing関連section抽出。
      出力項目：scope, non_goals, complementary_tools, recommended_flow, discovery。
      推奨探索順：background→problem→decision→solution。
```

---

## SEC-PROVENANCE-AND-CONTINUATION

```yaml
section_id: "SEC-PROVENANCE-AND-CONTINUATION"
anchorage:
  view: "background"
  phase: "confirmed"
  domain: ["provenance", "continuation", "derived_from"]
occurrences:
  - occurrence_id: "OCC-PROV-001"
    role: "explanation"
    entity_id: "IE-PROV-001"
entities:
  - entity_id: "IE-PROV-001"
    kind: "concept"
    content: |
      本版は v0.0.17 と v0.0.19 を synthesized したもの。
      continuation を保持し、将来の merge 実装へ接続。
      detail_doc / refs.parent / attribution / derived_from を維持。
```

---

## SEC-IMPLEMENTATION-PLAN

```yaml
section_id: "SEC-IMPLEMENTATION-PLAN"
anchorage:
  view: "plan"
  phase: "design"
  domain: ["implementation"]
occurrences:
  - occurrence_id: "OCC-IMPL-001"
    role: "plan"
    entity_id: "IE-IMPL-001"
entities:
  - entity_id: "IE-IMPL-001"
    kind: "plan"
    content: |
      実装順序：
      1) capabilities更新
      2) describe ls 実装
      3) ls domain追加
      4) describe routing 実装
      5) スモークテスト自動化
```

---

## continuation

```yaml
continuation:
  last_processed_at: "2026-03-03T22:42:49.454083+00:00"
  open_threads:
    - "merge CLI化"
    - "routing schema固定"
  suggested_next:
    - "v0.1.3実装"
    - "テスト実行"
```

---

End of v0.0.20
