# IdeaMark Spec: ideamark CLI v0.1.1（v0.1.0→v0.1.1差分設計 / 開発版 v0.1）

```yaml
ideamark_version: 1
doc_id: "ideamark.cli.ideamark-cli.spec"
doc_type: "spec"
target_software: "ideamark-cli"
target_release: "v0.1.1"
status: "draft"
created_at: "2026-02-17"
updated_at: "2026-02-21"
lang: "ja-JP"
refs:
  sources: []
  derived_from: []
related:
    - uri: "./ideamark-cli_test-catalog_v0.8.flowmark.md"
      relation: "related"
      description: "FlowMark形式の網羅テストカタログ（batch/refs付き）"
    - uri: "./ideamark-cli_test-spec_validate_v0.8.ideamark.md"
      relation: "related"
      description: "validateの受け入れ基準（diagnostics契約・グルーピング）"
    - uri: "./ideamark-cli_test-spec_compose_v0.8.ideamark.md"
      relation: "related"
      description: "composeの受け入れ基準（rename/参照追随）"
constraints:
  - "Strict運用（YAML必須）を前提にする"
  - "外部参照（URL/FQID）は本書では使用しない"
  - "意味解釈はしない（heuristicのみ）"
```

---

## Section 001 : Scope（スコープ）
```yaml
section_id: "SEC-SCOPE"
anchorage:
  view: "solution"
  phase: "confirmed"
```
### OCC-SCOPE-1 : v0.1.0で入れるもの
```yaml
occurrence_id: "OCC-SCOPE-1"
entity: "IE-SCOPE-IN"
role: "requirement"
status:
  state: "confirmed"
  confidence: 0.90
```
- `ideamark validate --strict`
- `ideamark extract`
- `ideamark compose`
- `ideamark format`（最低限：YAMLブロックの正規化と安定出力）
- `ideamark describe`（最低限：Strictの“必須要素チェックリスト”を出力）

### OCC-SCOPE-2 : v0.1.0で入れないもの
```yaml
occurrence_id: "OCC-SCOPE-2"
entity: "IE-SCOPE-OUT"
role: "non_goal"
status:
  state: "confirmed"
  confidence: 0.85
```
- 意味解釈（要約・分類・同一性の確定）
- dedupe（似ているものを統合）
- 外部参照の解決（FQID/URL resolve）
- GUI/IDE統合

---

## Section 002 : Data Model（内部モデル）
```yaml
section_id: "SEC-DATA"
anchorage:
  view: "solution"
  phase: "confirmed"
```
### OCC-DATA-1 : AST + Symbol Table + Ref
```yaml
occurrence_id: "OCC-DATA-1"
entity: "IE-DATA-MODEL"
role: "design"
status:
  state: "confirmed"
  confidence: 0.90
```
内部表現は以下の三層：
- AST（Document/Section/Blocksのツリー）
- Symbol Table（Entity/Occurrence/Sectionメタの辞書）
- Ref（Section内からSymbolを指す参照）

### OCC-DATA-2 : IDポリシー
```yaml
occurrence_id: "OCC-DATA-2"
entity: "IE-ID-POLICY"
role: "design"
status:
  state: "confirmed"
  confidence: 0.90
```
- `doc_id`: UUID v4（extract/composeの出力は新規）
- `local_id`: 既存を保持（衝突時のみrename）
- 衝突rename: UUID v4（デフォ）

---

## Section 003 : Strict Validation（Strict検証）
```yaml
section_id: "SEC-STRICT"
anchorage:
  view: "decision"
  phase: "confirmed"
```
### OCC-STRICT-1 : 必須条件（Strict）
```yaml
occurrence_id: "OCC-STRICT-1"
entity: "IE-STRICT-REQ"
role: "requirement"
status:
  state: "confirmed"
  confidence: 0.90
```
Strictで必須：
- Documentメタ（frontmatter相当）：`doc_id`, `ideamark_version`, `doc_type`
- 各Sectionのfenced YAMLに **`anchorage` が存在**
- Occurrenceが最低限でも明示される（Registry or 各Section内）
- Sectionに列挙されたoccurrencesが解決できる（参照整合）

### OCC-STRICT-2 : エラー/警告の分類
```yaml
occurrence_id: "OCC-STRICT-2"
entity: "IE-STRICT-DIAG"
role: "design"
status:
  state: "confirmed"
  confidence: 0.85
```
- Error（処理停止）：YAML欠落、anchorage欠落、ID重複、参照切れ
- Warning（処理継続）：同一候補（本文一致）、未参照Entity、未使用Occurrence

---

## Section 004 : Extract（抽出）
```yaml
section_id: "SEC-EXTRACT"
anchorage:
  view: "solution"
  phase: "confirmed"
```
### OCC-EXTRACT-1 : 抽出の入力/出力
```yaml
occurrence_id: "OCC-EXTRACT-1"
entity: "IE-EXTRACT-IO"
role: "spec"
status:
  state: "confirmed"
  confidence: 0.90
```
- 入力：IdeaMark文書（Strict）
- 出力：新しいIdeaMark文書（新規doc_id）
- local_id：原則保持（借り物）

### OCC-EXTRACT-2 : 閉包ルール（自己完結）
```yaml
occurrence_id: "OCC-EXTRACT-2"
entity: "IE-EXTRACT-CLOSURE"
role: "spec"
status:
  state: "confirmed"
  confidence: 0.90
```
抽出結果は単体でvalidateが通る必要がある。  
そのため、抽出対象Section/Occurrenceが参照するEntity/Occurrence定義は閉包として同梱する。

---

## Section 005 : Compose（合成）
```yaml
section_id: "SEC-COMPOSE"
anchorage:
  view: "solution"
  phase: "confirmed"
```
### OCC-COMPOSE-1 : 和集合合成
```yaml
occurrence_id: "OCC-COMPOSE-1"
entity: "IE-COMPOSE-UNION"
role: "spec"
status:
  state: "confirmed"
  confidence: 0.90
```
composeは原則和集合：
- 異なるIDは別物として併記
- dedupeしない（意味解釈をしない）

### OCC-COMPOSE-2 : 衝突（同一local_idで定義差）
```yaml
occurrence_id: "OCC-COMPOSE-2"
entity: "IE-COMPOSE-CONFLICT"
role: "spec"
status:
  state: "confirmed"
  confidence: 0.90
```
同一local_idで定義が異なる場合：
- warningを出す
- 片方をUUID v4でrename（デフォ）
- 参照（Ref/Link等）を追随更新

---

## Section 006 : Same-definition Heuristic（重複“予兆”）
```yaml
section_id: "SEC-HEURISTIC"
anchorage:
  view: "decision"
  phase: "confirmed"
```
### OCC-HEUR-1 : リテラル一致のみ
```yaml
occurrence_id: "OCC-HEUR-1"
entity: "IE-HEURISTIC"
role: "spec"
status:
  state: "confirmed"
  confidence: 0.90
```
- fenced YAMLを除いたMarkdown本文が完全一致 → 同一候補（warning/info）
- anchorage差異 → 別定義扱い
- “解釈結果同一”は判定しない

---

## Section 006B : Reference Policy（参照ポリシー）
```yaml
section_id: "SEC-REF"
anchorage:
  view: "decision"
  phase: "confirmed"
```
### OCC-REF-1 : 参照表現（v0.1.0）
```yaml
occurrence_id: "OCC-REF-1"
entity: "IE-REF-FORM"
role: "decision"
status:
  state: "confirmed"
  confidence: 0.90
```
v0.1.0 における参照（`entity_ref` / `occurrence_ref` / `section_ref`）は、**YAML内の明示フィールド**に限定して扱う。  
Markdown本文中のID文字列やリンクは参照対象に含めない。

参照の表現は次の3種を許可する（ただし v0.1.0 は外部解決を行わない）：

- **ローカルID参照（推奨）**：`IE-...` / `OCC-...` / `SEC-...`（同一文書内を指す）
- **IdeaMark URI（内部の正準表現）**：`ideamark://docs/{doc_id}#/entities/{id}` 等（YAML Spec v1 準拠）
- **外部URL/URI（将来用）**：`https://...` 等（v0.1.0 では解決しない、存在検証のみ）

また、`<doc_id>#<local_id>` 形式（FQID）は **参照文脈の表現**としてのみ許容し、format により可能な限り `ideamark://` 正準形へ正規化できる余地を残す。

### OCC-REF-2 : 参照追随（rename時）
```yaml
occurrence_id: "OCC-REF-2"
entity: "IE-REF-REWRITE"
role: "decision"
status:
  state: "confirmed"
  confidence: 0.90
```
compose/extract によって ID の rename が発生した場合、参照追随（書き換え）の対象は **YAML内の参照フィールド**に限定する。

書き換え対象（YAMLパス）：
- `occurrences.*.entity`
- `occurrences.*.target`
- `occurrences.*.supporting_evidence[]`
- `occurrences.*.derived_from.entity`
- `sections.*.occurrences[]`
- `structure.sections[]`
- `relations[].from` / `relations[].to`（存在する場合）

書き換えルール：
- ローカルID参照（`IE-*`等）は rename 後IDに置換
- `ideamark://docs/...` は `#/entities/{id}` 等の **末尾ID部分**を rename 後に置換（doc_idは保持）
- `https://` 等の外部参照は v0.1.0 では **不変**（解決・更新しない）

---

## Section 007 : CLI Interface（引数と出力）
```yaml
section_id: "SEC-CLI"
anchorage:
  view: "solution"
  phase: "plan"
```
### OCC-CLI-1 : validate
```yaml
occurrence_id: "OCC-CLI-1"
entity: "IE-CLI-VALIDATE"
role: "spec"
status:
  state: "confirmed"
  confidence: 0.85
```
例：
- `ideamark validate --strict in.md`
- 出力：人間向け診断（stderr）＋機械向けJSON（`--format=json`）

### OCC-CLI-2 : extract
```yaml
occurrence_id: "OCC-CLI-2"
entity: "IE-CLI-EXTRACT"
role: "spec"
status:
  state: "confirmed"
  confidence: 0.85
```
例：
- `ideamark extract --section SEC-DECISIONS in.md > out.md`
- `ideamark extract --occ OCC-D1 in.md > out.md`

### OCC-CLI-3 : compose
```yaml
occurrence_id: "OCC-CLI-3"
entity: "IE-CLI-COMPOSE"
role: "spec"
status:
  state: "confirmed"
  confidence: 0.85
```
例：
- `ideamark compose a.md b.md > merged.md`

### OCC-CLI-4 : describe
```yaml
occurrence_id: "OCC-CLI-4"
entity: "IE-CLI-DESCRIBE"
role: "spec"
status:
  state: "confirmed"
  confidence: 0.85
```
例：
- `ideamark describe --strict-checklist`
- `ideamark describe --format=json --strict-schema`（将来拡張余地）

---

## Section 008 : Test Plan（検証計画）
```yaml
section_id: "SEC-TEST"
anchorage:
  view: "plan"
  phase: "plan"
```
### OCC-TEST-1 : 最小テストセット
```yaml
1. 同一Entityが複数Sectionで参照される文書 → extractしても壊れない  
2. composeで異なるIDの似たEntity → 併記される  
3. composeで同一local_id衝突（定義差）→ warning + UUID rename + 参照追随  

加えて、v0.1.0 の機能的テスト観点を以下のケースIDで固定する：

### Validate（Strict）
- **TC-VAL-001**: Header 必須欠落 → error（停止）
- **TC-VAL-002**: Section `anchorage` 欠落 → error
- **TC-VAL-003**: ID 重複（Entity/Occurrence/Section）→ error
- **TC-VAL-004**: 参照切れ（Ref対象フィールド）→ error
- **TC-VAL-005**: 未参照Entity / 未使用Occurrence → warning
- **TC-VAL-006**: “同一定義候補”ヒューリスティック（本文リテラル一致）→ warning/info

### Extract（閉包・自己完結）
- **TC-EXT-001**: `--section` 抽出 → 参照閉包を含めて単体 validate(strict) 通過
- **TC-EXT-002**: 閉包が推移的（トランジティブ）に解決される（参照の参照まで同梱）
- **TC-EXT-003**: 出力 `doc_id` は新規 UUID v4（入力の `doc_id` は保持しない）

### Compose（和集合・衝突・参照追随）
- **TC-COM-001**: 異なるIDは別物として併記（dedupeしない）
- **TC-COM-002**: 同一IDかつ同一定義 → そのまま（または info）
- **TC-COM-003**: 同一local_id衝突（定義差）→ warning + UUID rename + 参照追随
- **TC-COM-004**: 参照追随対象は YAML内参照フィールドのみ（Markdown本文は対象外）
- **TC-COM-005**: 参照表現の差分（ローカルID / ideamark:// / FQID）を含む追随更新

### Format（決定論的整形）
- **TC-FMT-001**: YAML正規化（キー順/インデント）で安定出力（再実行で差分なし）

成功条件：
- extract出力が単体でvalidate(strict)通過
- compose出力がvalidate(strict)通過
- renameが発生しても参照が切れない（追随更新が完了している）

---

---

## Section 009 : Implementation Clarifications（実装確定事項）
```yaml
section_id: "SEC-IMPL"
anchorage:
  view: "decision"
  phase: "confirmed"
```

### OCC-IMPL-1 : YAMLブロック分類ヒューリスティック
```yaml
occurrence_id: "OCC-IMPL-1"
entity: "IE-IMPL-PARSE"
role: "design"
status:
  state: "confirmed"
  confidence: 0.85
```
実装では fenced YAML を以下で分類する：
- Document Header：`ideamark_version` + `doc_id` + `doc_type` を含む最初のブロック
- Section：`section_id` と `anchorage` を含むブロック
- Occurrence：`occurrence_id` を含むブロック
- Registry：トップレベルに `entities` / `occurrences` / `sections` / `structure` のいずれかを含むブロック
- それ以外：人間向けメタとして無視（Strict必須要件に数えない）

### OCC-IMPL-2 : Strict必須ヘッダはYAML Spec v1に準拠
```yaml
occurrence_id: "OCC-IMPL-2"
entity: "IE-IMPL-STRICT-HEADER"
role: "requirement"
status:
  state: "confirmed"
  confidence: 0.85
```
Strict validate では Document Header の必須を YAML Spec v1 の必須項目に合わせる：
`ideamark_version`, `doc_id`, `doc_type`, `status`, `created_at`, `updated_at`, `lang`。

### OCC-IMPL-3 : 参照（Ref）として追跡する範囲（v0.1.0）
```yaml
occurrence_id: "OCC-IMPL-3"
entity: "IE-IMPL-REF-SCOPE"
role: "decision"
status:
  state: "confirmed"
  confidence: 0.85
```
v0.1.0 では **YAML内参照のみ**をRefとして扱う（Markdown本文中のID/リンクは追跡しない）。
対象例：
- Occurrence：`entity`, `target`, `supporting_evidence`
- Registry：`sections.*.occurrences`, `structure.sections`
- relations を実装する場合：`relations[].from/to`

### OCC-IMPL-4 : extract閉包は推移閉包（トランジティブ）で自己完結を保証
```yaml
occurrence_id: "OCC-IMPL-4"
entity: "IE-IMPL-EXTRACT-CLOSURE"
role: "decision"
status:
  state: "confirmed"
  confidence: 0.85
```
extract は抽出対象（Section/Occurrence）から参照グラフを辿り、必要な定義が揃うまで **推移閉包**を取る。  
出力は単体でStrict validateを通過し、`structure.sections` は抽出されたSectionのみで構成する。

### OCC-IMPL-5 : composeのstructureマージ規則（v0.1.0）
```yaml
occurrence_id: "OCC-IMPL-5"
entity: "IE-IMPL-COMPOSE-STRUCTURE"
role: "decision"
status:
  state: "confirmed"
  confidence: 0.80
```
`structure.sections` は **Aの順序を維持し、Bの未出現Sectionを末尾に追加**（重複は除外）する。

### OCC-IMPL-6 : local_idの解釈（v0.1.0）
```yaml
occurrence_id: "OCC-IMPL-6"
entity: "IE-IMPL-LOCAL-ID"
role: "decision"
status:
  state: "confirmed"
  confidence: 0.80
```
v0.1.0 では `IE-*` / `OCC-*` / `SEC-*` の **ID文字列そのものを local_id とみなす**。  
「衝突」は同一IDで定義が異なる場合を指し、UUID v4 rename + 参照追随を適用する。


---

## Section 010 : Test Design（網羅ケース一覧とフィクスチャ規約）
```yaml
section_id: "SEC-TEST-DESIGN"
anchorage:
  view: "plan"
  phase: "plan"
```
### OCC-TEST-DESIGN-1 : 方針（最小セットにせず全件作る）
```yaml
occurrence_id: "OCC-TEST-DESIGN-1"
entity: "IE-TEST-DESIGN-POLICY"
role: "plan"
status:
  state: "confirmed"
  confidence: 0.85
```
v0.1.0 の機能的テストは **最小セットに絞らず**、ケース一覧にあるものを原則すべて fixtures として作成する。  
生成してみて「無理がある / 意味がない」と判明したものは、後から削除・統合する。

### OCC-TEST-DESIGN-2 : フィクスチャ配置規約
```yaml
occurrence_id: "OCC-TEST-DESIGN-2"
entity: "IE-TEST-FIXTURE-LAYOUT"
role: "design"
status:
  state: "confirmed"
  confidence: 0.85
```
ケースごとの入力/期待は独立ファイルとして管理する（ドキュメント本文には“説明”のみ置く）。

推奨配置：
```
tests/
  fixtures/
    validate/
    extract/
    compose/
    format/
    describe/
    ops/
```

命名：
- 入力：`<case_id>_in.ideamark.md`
- 期待（validate）：`<case_id>_expected.json`
- 期待（extract/compose/format）：`<case_id>_expected.ideamark.md` または `<case_id>_expected.yml`（propertyベースの場合はJSONでも可）

### OCC-TEST-DESIGN-3 : 期待結果の書き方（validate / extract / compose / format）
```yaml
occurrence_id: "OCC-TEST-DESIGN-3"
entity: "IE-TEST-EXPECTATIONS"
role: "design"
status:
  state: "confirmed"
  confidence: 0.85
```
- **validate**：`diagnostics` の JSON（骨子）で期待を表現する。  
  - `level`（error/warning/info）
  - `code`
  - `location.path`（YAMLパス中心。lineは任意）
- **extract / compose**：完全一致よりも **properties（性質）** を優先して検証可能にする。例：
  - 出力が strict validate を通過
  - `doc_id` が新規
  - rename が発生した場合に参照追随が完了
  - `structure.sections` のマージ規則が仕様どおり
- **format**：idempotent（2回適用して差分ゼロ）を必須とし、YAML正規化・空行正規化を検証する。

### OCC-TEST-DESIGN-4 : ケースID一覧（網羅）
```yaml
occurrence_id: "OCC-TEST-DESIGN-4"
entity: "IE-TEST-CASELIST"
role: "plan"
status:
  state: "confirmed"
  confidence: 0.80
```
以下は v0.1.0 のテスト観点を、後続の fixture 生成のために **ケースIDとして固定**した一覧である。

#### Validate（Strict）
- TC-VAL-HDR-001〜007（Header必須/型/複数Header）
- TC-VAL-SEC-001〜007（Section/anchorage/重複）
- TC-VAL-OCC-001〜006（Occurrence必須/重複）
- TC-VAL-ENT-001〜005（Entity解決/未参照/inline/衝突）
- TC-VAL-STR-001〜005（structure/registry整合）
- TC-VAL-REF-001〜004（detail_doc/refs.parent の存在検証）
- TC-VAL-HEUR-001〜003（同一定義候補ヒューリスティック）

#### Extract
- TC-EXT-SEC-001（section抽出）
- TC-EXT-OCC-001（occ抽出）
- TC-EXT-MULTI-001（複数指定：将来/保留でも可）
- TC-EXT-CLO-001〜005（推移閉包：entity/target/evidence/derived_from/relations）
- TC-EXT-OUT-001〜004（出力整合：strict通過/doc_id新規/local_id保持/structure最小）
- TC-EXT-ERR-001〜003（エラー系）

#### Compose
- TC-COM-UNI-001〜003（和集合/structureマージ/dedupeしない）
- TC-COM-CON-ENT-001 / OCC-001 / SEC-001 / MIX-001（衝突rename）
- TC-COM-REF-LOC-001 / TGT-001 / EVI-001 / DFE-001 / SEC-001 / STR-001 / REL-001（参照追随のパス別）
- TC-COM-REF-URI-001 / FQID-001 / URL-001（参照表現別）
- TC-COM-ERR-001〜002（rename漏れ検出など）

#### Format
- TC-FMT-YAML-001〜003（YAML正規化）
- TC-FMT-MD-001〜003（Markdown最小正規化/idempotent）

#### Describe / Ops
- TC-DES-001〜003（describe出力/整合/JSON安定）
- TC-OPS-001〜003（パイプ/順序依存/性能スモーク）


---

## Section 011 : Test Artifacts Split（FlowMark Catalog と IdeaMark Test Spec）
```yaml
section_id: "SEC-TEST-SPLIT"
anchorage:
  view: "plan"
  phase: "confirmed"
```
v0.8 以降、テスト資産は次の分業で管理する。

- **FlowMark Test Catalog**：網羅列挙と漏れ検出（registryでcoverageを担保）
- **IdeaMark Test Spec**：判定基準・受け入れ条件（diagnostics契約、rename/参照追随ルール等）
- **fixtures**：個別入力/期待（別ファイル。生成・更新しやすい形で保持）

本書（spec）は「CLIの仕様」と「テスト資産の配置・参照の正」を保持し、  
テストケースの完全列挙は FlowMark Test Catalog を正とする。

## Registry（Entities / Occurrences / Sections）
```yaml
entities:
  IE-TEST-DESIGN-POLICY:
    kind: plan
    content: テストは最小セットにせず全件fixture化してから取捨選択する
    atomic_state: true
  IE-TEST-FIXTURE-LAYOUT:
    kind: design
    content: fixturesの配置・命名規約（tests/fixtures/...）
    atomic_state: true
  IE-TEST-EXPECTATIONS:
    kind: design
    content: 期待結果の書き方（validateはJSON、extract/composeはproperty優先、formatはidempotent）
    atomic_state: true
  IE-TEST-CASELIST:
    kind: plan
    content: v0.1.0 網羅ケースID一覧（VAL/EXT/COM/FMT/DES/OPS）
    atomic_state: true
  IE-SCOPE-IN:
    kind: requirement
    content: v0.1.0 in-scope
    atomic_state: true
  IE-SCOPE-OUT:
    kind: non_goal
    content: v0.1.0 out-of-scope
    atomic_state: true
  IE-DATA-MODEL:
    kind: design
    content: AST + Symbol Table + Ref
    atomic_state: true
  IE-ID-POLICY:
    kind: design
    content: ID policy (UUID v4, preserve unless conflict)
    atomic_state: true
  IE-STRICT-REQ:
    kind: requirement
    content: Strict validation requirements (anchorage required)
    atomic_state: true
  IE-STRICT-DIAG:
    kind: design
    content: 'Diagnostics: error vs warning'
    atomic_state: true
  IE-EXTRACT-IO:
    kind: spec
    content: extract IO and doc_id minting
    atomic_state: true
  IE-EXTRACT-CLOSURE:
    kind: spec
    content: extract closure rule for self-contained output
    atomic_state: true
  IE-COMPOSE-UNION:
    kind: spec
    content: compose as set union (no dedupe)
    atomic_state: true
  IE-COMPOSE-CONFLICT:
    kind: spec
    content: 'compose conflict: warn + uuid rename + ref rewrite'
    atomic_state: true
  IE-HEURISTIC:
    kind: spec
    content: 'same-definition heuristic: markdown literal equality'
    atomic_state: true
  IE-REF-FORM:
    kind: decision
    content: 'ref forms: local id / ideamark:// uri / external url (no resolve in
      v0.1.0)'
    atomic_state: true
  IE-REF-REWRITE:
    kind: decision
    content: ref rewrite scope and rules on rename
    atomic_state: true
  IE-CLI-VALIDATE:
    kind: spec
    content: CLI validate interface
    atomic_state: true
  IE-CLI-EXTRACT:
    kind: spec
    content: CLI extract interface
    atomic_state: true
  IE-CLI-COMPOSE:
    kind: spec
    content: CLI compose interface
    atomic_state: true
  IE-CLI-DESCRIBE:
    kind: spec
    content: CLI describe interface
    atomic_state: true
  IE-TEST-PLAN:
    kind: plan
    content: minimal test plan for v0.1.0
    atomic_state: true
  IE-IMPL-PARSE:
    kind: implementation
    content: IE-IMPL-PARSE（実装論点）
    atomic_state: true
  IE-IMPL-STRICT-HEADER:
    kind: implementation
    content: IE-IMPL-STRICT-HEADER（実装論点）
    atomic_state: true
  IE-IMPL-REF-SCOPE:
    kind: implementation
    content: IE-IMPL-REF-SCOPE（実装論点）
    atomic_state: true
  IE-IMPL-EXTRACT-CLOSURE:
    kind: implementation
    content: IE-IMPL-EXTRACT-CLOSURE（実装論点）
    atomic_state: true
  IE-IMPL-COMPOSE-STRUCTURE:
    kind: implementation
    content: IE-IMPL-COMPOSE-STRUCTURE（実装論点）
    atomic_state: true
  IE-IMPL-LOCAL-ID:
    kind: implementation
    content: IE-IMPL-LOCAL-ID（実装論点）
    atomic_state: true
IE-IMPL-PARSE:
  kind: design
  content: YAML block classification heuristic for parsing
  atomic_state: true
IE-IMPL-STRICT-HEADER:
  kind: requirement
  content: Strict header required fields aligned to YAML Spec v1
  atomic_state: true
IE-IMPL-REF-SCOPE:
  kind: decision
  content: Ref scope is YAML-only in v0.1.0
  atomic_state: true
IE-IMPL-EXTRACT-CLOSURE:
  kind: decision
  content: extract uses transitive closure to be self-contained
  atomic_state: true
IE-IMPL-COMPOSE-STRUCTURE:
  kind: decision
  content: compose merges structure.sections by appending unique sections
  atomic_state: true
IE-IMPL-LOCAL-ID:
  kind: decision
  content: IDs (IE/OCC/SEC) are treated as local_id in v0.1.0
  atomic_state: true
occurrences:
  OCC-TEST-DESIGN-1:
    entity: IE-TEST-DESIGN-POLICY
    role: plan
    status:
      state: confirmed
  OCC-TEST-DESIGN-2:
    entity: IE-TEST-FIXTURE-LAYOUT
    role: design
    status:
      state: confirmed
  OCC-TEST-DESIGN-3:
    entity: IE-TEST-EXPECTATIONS
    role: design
    status:
      state: confirmed
  OCC-TEST-DESIGN-4:
    entity: IE-TEST-CASELIST
    role: plan
    status:
      state: confirmed
  OCC-SCOPE-1:
    entity: IE-SCOPE-IN
    role: requirement
    status:
      state: confirmed
  OCC-SCOPE-2:
    entity: IE-SCOPE-OUT
    role: non_goal
    status:
      state: confirmed
  OCC-DATA-1:
    entity: IE-DATA-MODEL
    role: design
    status:
      state: confirmed
  OCC-DATA-2:
    entity: IE-ID-POLICY
    role: design
    status:
      state: confirmed
  OCC-STRICT-1:
    entity: IE-STRICT-REQ
    role: requirement
    status:
      state: confirmed
  OCC-STRICT-2:
    entity: IE-STRICT-DIAG
    role: design
    status:
      state: confirmed
  OCC-EXTRACT-1:
    entity: IE-EXTRACT-IO
    role: spec
    status:
      state: confirmed
  OCC-EXTRACT-2:
    entity: IE-EXTRACT-CLOSURE
    role: spec
    status:
      state: confirmed
  OCC-COMPOSE-1:
    entity: IE-COMPOSE-UNION
    role: spec
    status:
      state: confirmed
  OCC-COMPOSE-2:
    entity: IE-COMPOSE-CONFLICT
    role: spec
    status:
      state: confirmed
  OCC-HEUR-1:
    entity: IE-HEURISTIC
    role: spec
    status:
      state: confirmed
  OCC-REF-1:
    entity: IE-REF-FORM
    role: decision
    status:
      state: confirmed
  OCC-REF-2:
    entity: IE-REF-REWRITE
    role: decision
    status:
      state: confirmed
  OCC-CLI-1:
    entity: IE-CLI-VALIDATE
    role: spec
    status:
      state: confirmed
  OCC-CLI-2:
    entity: IE-CLI-EXTRACT
    role: spec
    status:
      state: confirmed
  OCC-CLI-3:
    entity: IE-CLI-COMPOSE
    role: spec
    status:
      state: confirmed
  OCC-CLI-4:
    entity: IE-CLI-DESCRIBE
    role: spec
    status:
      state: confirmed
  OCC-TEST-1:
    entity: IE-TEST-PLAN
    role: plan
    status:
      state: confirmed
  OCC-IMPL-1:
    entity: IE-IMPL-PARSE
    role: design
    status:
      state: confirmed
  OCC-IMPL-2:
    entity: IE-IMPL-STRICT-HEADER
    role: requirement
    status:
      state: confirmed
  OCC-IMPL-3:
    entity: IE-IMPL-REF-SCOPE
    role: decision
    status:
      state: confirmed
  OCC-IMPL-4:
    entity: IE-IMPL-EXTRACT-CLOSURE
    role: decision
    status:
      state: confirmed
  OCC-IMPL-5:
    entity: IE-IMPL-COMPOSE-STRUCTURE
    role: decision
    status:
      state: confirmed
  OCC-IMPL-6:
    entity: IE-IMPL-LOCAL-ID
    role: decision
    status:
      state: confirmed
sections:
  SEC-TEST-SPLIT:
    anchorage:
      view: plan
      phase: confirmed
    occurrences: []
  SEC-TEST-DESIGN:
    anchorage:
      view: plan
      phase: plan
    occurrences:
    - OCC-TEST-DESIGN-1
    - OCC-TEST-DESIGN-2
    - OCC-TEST-DESIGN-3
    - OCC-TEST-DESIGN-4
  SEC-SCOPE:
    anchorage:
      view: solution
      phase: confirmed
    occurrences:
    - OCC-SCOPE-1
    - OCC-SCOPE-2
  SEC-DATA:
    anchorage:
      view: solution
      phase: confirmed
    occurrences:
    - OCC-DATA-1
    - OCC-DATA-2
  SEC-STRICT:
    anchorage:
      view: decision
      phase: confirmed
    occurrences:
    - OCC-STRICT-1
    - OCC-STRICT-2
  SEC-EXTRACT:
    anchorage:
      view: solution
      phase: confirmed
    occurrences:
    - OCC-EXTRACT-1
    - OCC-EXTRACT-2
  SEC-COMPOSE:
    anchorage:
      view: solution
      phase: confirmed
    occurrences:
    - OCC-COMPOSE-1
    - OCC-COMPOSE-2
  SEC-HEURISTIC:
    anchorage:
      view: decision
      phase: confirmed
    occurrences:
    - OCC-HEUR-1
  SEC-REF:
    anchorage:
      view: decision
      phase: confirmed
    occurrences:
    - OCC-REF-1
    - OCC-REF-2
  SEC-CLI:
    anchorage:
      view: solution
      phase: plan
    occurrences:
    - OCC-CLI-1
    - OCC-CLI-2
    - OCC-CLI-3
    - OCC-CLI-4
  SEC-TEST:
    anchorage:
      view: plan
      phase: plan
    occurrences:
    - OCC-TEST-1
  SEC-IMPL:
    anchorage:
      view: decision
      phase: confirmed
    occurrences:
    - OCC-IMPL-1
    - OCC-IMPL-2
    - OCC-IMPL-3
    - OCC-IMPL-4
    - OCC-IMPL-5
    - OCC-IMPL-6
structure:
  sections:
  - SEC-SCOPE
  - SEC-DATA
  - SEC-STRICT
  - SEC-EXTRACT
  - SEC-COMPOSE
  - SEC-HEURISTIC
  - SEC-CLI
  - SEC-TEST
  - SEC-IMPL
  - SEC-REF
  - SEC-TEST-DESIGN
  - SEC-TEST-SPLIT
```

---

## SEC-REGISTRY-POLICY

```yaml
section_id: "SEC-REGISTRY-POLICY"
anchorage:
  view: "design"
  phase: "validation"
```

### Registry を正（source of truth）とする原則

- 文末 Registry YAML（entities / occurrences / sections / structure）は本ドキュメントの正規定義とする。
- 本文中の Section / Occurrence YAML は編集単位・可読性・LLM支援のための断片表現である。
- validate および format は Registry を基準に整合性を判定・再構成する。

### 不一致の分類

(A) 自動修復可能（warning）
- 本文に存在し Registry に無い ID
- Registry に存在し本文に無い ID（スタブ生成可能）
- structure と本文順序の不一致

(B) 自動修復が危険（error）
- 同一 ID で内容衝突
- anchorage 不一致
- 参照追随に影響する差分

(C) 表記差（info）
- Markdown本文差分
- YAMLキー順などの正規化可能差分


---

## SEC-ID-POLICY

```yaml
section_id: "SEC-ID-POLICY"
anchorage:
  view: "design"
  phase: "validation"
```

### ID 運用方針（v0.9.4）

#### doc_id（固定）
- `doc_id` は **概念IDとして固定**する（ファイル名側のバージョンで版管理する）。
- compose/extract で新規文書を生成する場合は **新規 doc_id** を発行する（固定とは「同一文書の版」である場合）。

#### local ID のスコープ（基本：文書内一意）
- `entity_id` / `occurrence_id` / `section_id` は **文書内で一意**であればよい（local ID）。
- 参照は原則 local ID（例：`IE-XXX`）で表現する。

#### compose の衝突解決（UUID短縮サフィックス）
- compose で **同一IDの定義衝突**が発生した場合、後から取り込まれる側を rename する。
- rename は次の形式：`<OLD>__<uuid8>`
  - `uuid8` は UUIDv4 の先頭 8 hex（例：`OCC-001__a1b2c3d4`）
- rename 後は、参照追随（occ.entity/target/supporting_evidence/sections.occurrences/structure/relations 等）を必ず実施する。

#### rename の追跡（aliases を保持）
- rename した要素（Entity/Occurrence/Section）は、新ID側の Registry エントリに `aliases` を保持する。
  - 例：`aliases: ["OCC-001"]`
- `aliases` はヒューマン追跡・差分検証・デバッグ用途であり、参照の正規形は **常に新ID** を用いる。

（注）`aliases` は v1.0.1 YAML Spec の必須項目ではないが、追加メタデータとして許容する運用とする。

---

## SEC-EXTRACT-POLICY

```yaml
section_id: "SEC-EXTRACT-POLICY"
anchorage:
  view: "design"
  phase: "implementation"
```

### extract の doc_id 方針

- `ideamark extract` の出力は **常に新規 doc_id を発行する**。
- extract 出力は「素材（working snippet）」であり、元文書の版とはみなさない。
- provenance として、元文書は `refs.sources` に必ず記録する。
- extract 時点では最終成果物（doc_C / doc_D 等）が確定していない前提で設計する。

---

## SEC-COMPOSE-MODEL

```yaml
section_id: "SEC-COMPOSE-MODEL"
anchorage:
  view: "design"
  phase: "implementation"
```

### compose のモード

compose には 2 つのモードを持つ。

#### 1) Create（デフォルト）

- 出力は **新規 doc_id** を発行する。
- 入力複数の場合も継承は行わない（デフォルトは `--inherit none`）。
- 入力文書は `refs.sources` に記録する。

#### 2) Update

- `--update` 指定時、既存成果物の doc_id を固定する。
- `--base <file>` を更新対象とみなし、その doc_id を継承する。
- `--doc-id <ID>` を明示指定することも可能。

### doc_id 継承ポリシー

- `--inherit none`（デフォルト）: 新規 doc_id を発行
- `--inherit first` : 最初の入力の doc_id を採用
- `--inherit base` : `--base` の doc_id を採用
- `--doc-id <ID>` : 明示指定を優先

衝突時は v0.9.4 の rename 規則（UUID短縮サフィックス + aliases）を適用する。

---

## SEC-REFERENCE-CANONICAL

```yaml
section_id: "SEC-REFERENCE-CANONICAL"
anchorage:
  view: "design"
  phase: "implementation"
```

### 参照表記の二層モデル

#### Working 表記

- 文書内参照は **local ID** を使用する（例: `IE-001`）。
- LLM 編集および人間可読性を優先する。

#### Published（canonical）表記

- `format --canonical` 実行時、参照は以下に正規化する：
  `ideamark://docs/<doc_id>#/entities/<ID>` 等の URI 形式。
- canonical 表記は publish 前提の安定参照とする。

### publish の責務

- `format --canonical`
- `validate --strict`
- 参照整合と Registry 正規化の完了確認

Working と Published を明確に分離する。

---

## SEC-VALIDATE-DIAGNOSTICS

```yaml
section_id: "SEC-VALIDATE-DIAGNOSTICS"
anchorage:
  view: "design"
  phase: "implementation"
```

### validate diagnostics の出力契約（JSON Lines）

`ideamark validate` は diagnostics を **JSON Lines（NDJSON）** 形式で出力する。

- 出力は 1 行 = 1 JSON オブジェクト。
- 先頭行は `type: "meta"` のメタ情報。
- 続く行は `type: "diagnostic"` の診断情報。
- 最終行は `type: "summary"` の集計情報。

### exit code

- `error` が 1 件でもあれば exit code = 1
- `warning` のみの場合は exit code = 0
- `--fail-on-warn` 指定時、warning が 1 件でもあれば exit code = 1

### severity（語彙）

- `error` / `warning` / `info`

### code（命名）

- `snake_case` 固定（例: `yaml_parse_error`, `id_duplicate`, `ref_missing`）

### location（必須）

`diagnostic.location` は最低限次を含む：

- `scope`: `header|registry|section|occurrence|entity|relation|structure`
- `path`: YAML/JSON Path（例: `registry.occurrences.OCC-001.entity`）
- `id`: 該当ID（例: `SEC-...` / `OCC-...` / `IE-...`）。該当が無い場合は `null` を許容。

（任意）`doc_id`, `file`, `line`, `col` を追加してよい。

### mode

validate はモードを持つ。diagnostics には `mode` を必ず含める。

- `working`
- `strict`

### JSON Lines 例

```jsonl
{"type":"meta","tool":"ideamark","command":"validate","mode":"working","version":"v0.1.0"}
{"type":"diagnostic","severity":"error","code":"yaml_parse_error","message":"Failed to parse YAML block.","location":{"scope":"header","path":"$","id":null,"doc_id":"ideamark.cli.ideamark-cli.spec","file":"doc.md"}}
{"type":"summary","ok":false,"counts":{"errors":1,"warnings":0,"infos":0}}
```

---

## SEC-COMPOSE-CONFLICT-AND-ORDER

```yaml
section_id: "SEC-COMPOSE-CONFLICT-AND-ORDER"
anchorage:
  view: "design"
  phase: "implementation"
```

### 衝突ポリシー

- 同一内容で ID が異なる場合は **dedupe しない**。
- 同一 ID で内容が異なる場合は **rename（UUID短縮サフィックス）で吸収**する。
- rename 後は `aliases` に旧 ID を保持する。
- 参照追随は以下すべてを対象とする：
  - occurrences.*.entity
  - occurrences.*.target
  - occurrences.*.supporting_evidence[]
  - occurrences.*.derived_from.*
  - sections.*.occurrences[]
  - structure.sections[]
  - relations[].from / relations[].to
  - refs.* 内の内部ID参照

### 順序の正（deterministic ordering）

- Registry の `entities` / `occurrences` / `sections` は **IDソート**で安定化する。
- 本文の Section 出力順は `structure.sections` を正とする。

### compose 時の structure 更新規則

#### Create（新規doc）

- 入力Aの `structure.sections` を優先。
- Aに存在しないSectionは、B以降の `structure.sections` の順に末尾追加。
- `structure` が無い入力は本文出現順を使用。

#### Update（--update）

- `--base` の `structure.sections` を正として維持。
- patch 側の新規Sectionのみを末尾追加（将来拡張可能）。
- 同一ID衝突時は base を優先し、patch側を rename する。

---

## SEC-FORMAT-SCOPE

```yaml
section_id: "SEC-FORMAT-SCOPE"
anchorage:
  view: "design"
  phase: "implementation"
```

### format の責務（v0.9.8）

#### モード
- `format` : Working 整形（参照は local ID のまま）
- `format --canonical` : Published 整形（参照を URI 形式へ正規化）

#### 同期（sync）
- `format` は **整形のみ**を行う。
- Registry 同期（本文→Registryの取り込み、Registry→本文スタブ生成）は別オプションで行う：
  - `format --sync-registry`
  - `format --emit-stubs`

#### YAML整形の厳密性
- YAML ブロックはパース可能であることを必須とする。
- YAML のダンプ表現（キー順、クォート、配列表記など）は **厳密な一致を要求しない**。
  - 例：pyyaml 等での再ダンプによる表記差は validate 的には error としない。
- ただし YAML として無効（構文違反）の場合は format の修正対象とする。

#### 本文の再構成
- 本文は極力保持する（Markdown本文は改変しない）。
- Section の並び順は `structure.sections` を正とし、必要に応じて並べ替える。
- `structure.sections` に存在しない本文 Section があれば、`structure.sections` の末尾へ追加し warning を出す。

#### Registry の安定化
- Registry の `entities` / `occurrences` / `sections` は ID ソートで安定化する。

#### canonical（Published）で行うこと
- local ID 参照を `ideamark://docs/<doc_id>#/...` へ正規化する。
- `refs.sources` は重複排除し、並びを安定化してよい。
- `aliases` は保持する（差分・追跡用途）。

#### 冪等性
- `format` / `format --canonical` は冪等であることを目標とする。
- `updated_at` は format では更新しない（compose/extract/publish で更新する）。

---

## SEC-TEMPLATE-REFERENCE-AND-LINT

```yaml
section_id: "SEC-TEMPLATE-REFERENCE-AND-LINT"
anchorage:
  view: "design"
  phase: "implementation"
```

### template の位置づけ

- template は IdeaMark 文書の必須要素ではない。
- template 適合性は **validate では扱わず**、将来の `lint` コマンドで評価する。
- template 適合は原則 **lint warning**（強制ではない）。

### template 参照表現

- template 参照はヘッダ YAML の `refs.template` に記録する。
- 表現は URI/URN/ファイル名などの文字列を許容する（解決は v0.1.0 では行わない）。

例：

```yaml
refs:
  template: "ideamark://templates/decision6.workcell@1.0.0"
```

### format / compose への影響

- `format` は template による強制（並び替え、必須Section生成など）を行わない。
- `compose` は template を参照情報として保持してよいが、適合性の解釈は lint に委ねる。

---

## SEC-PUBLISH-COMMAND

```yaml
section_id: "SEC-PUBLISH-COMMAND"
anchorage:
  view: "design"
  phase: "implementation"
```

### publish コマンドの目的

`ideamark publish` は IdeaMark 文書（Working）を **Published として配布・登録可能な状態**へ正規化するまでを責務とする。
DB登録や配置ディレクトリ管理などの運用は、呼び出し側（上位ツール / パイプライン）に委ねる。

### 形式

- `ideamark publish <infile> [-o <outfile>]`
- stdin/stdout にも対応する（`-` を指定可能）。

### publish の標準パイプライン（デフォルト）

1. `format --canonical`
2. `validate --strict`（NDJSON diagnostics）
3. 成果物を出力（`-o` または stdout）

（注）Registry 同期は publish に含めない。必要な場合は事前に `format --sync-registry` を実行する。

### publish が更新するメタ情報

- `updated_at` を更新する。
- `status.state` を `published` に設定する（存在する場合）。
- `refs.parent` の自動設定は v0.1.0 では行わない（将来検討）。

### canonical 参照のURI形式

Published では local 参照を以下のURI形式へ正規化する：

- `ideamark://docs/<doc_id>#/entities/<ID>`
- `ideamark://docs/<doc_id>#/occurrences/<ID>`
- `ideamark://docs/<doc_id>#/sections/<ID>`

### 失敗時の挙動

- `validate --strict` で `error` が出た場合、publish は失敗（exit code = 1）とし、成果物は出力しない。
- diagnostics は NDJSON で出力する（v0.1.0 では stdout を基本とする）。

---

## SEC-COMMAND-IO-CONVENTIONS

```yaml
section_id: "SEC-COMMAND-IO-CONVENTIONS"
anchorage:
  view: "design"
  phase: "implementation"
```

### コマンドI/Oの共通規約（v0.1.0）

#### 入力（stdin / file）
- `<infile>` に `-` を指定した場合は stdin を読む。
- `<infile>` を省略した場合も stdin を読む（Unix流）。

#### 出力（stdout / file）
- 成果物（生成・変換後の IdeaMark 文書）は stdout に出力する。
- `-o <outfile>` でファイル出力する。
- `-o -` は stdout 明示指定として扱う。

#### diagnostics の出力先
- `validate` 以外のコマンドは、diagnostics を **stderr** に出力する（成果物と分離）。
- `validate` は diagnostics を **stdout** に NDJSON（JSON Lines）で出力する（仕様済み）。
- `--diagnostics <path|- >` をサポートし、`-` は stderr を意味する。
  - v0.1.0 の最小実装では `--diagnostics -`（stderr）のみでもよい。

#### 終了コード（exit code）
- `0`: 成功（error無し）
- `1`: 失敗（処理不能 / strict error 等）
- `2`: 使い方エラー（引数不正）

### サブコマンド別の要点

- `validate`: stdout に NDJSON（meta/diagnostic/summary）
- `format` / `extract` / `compose` / `publish`: stdout に成果物、stderr に diagnostics

---

## SEC-CLI-SIGNATURES

---

## SEC-V0-1-1-CHANGES

```yaml
section_id: "SEC-V0-1-1-CHANGES"
anchorage:
  view: "design"
  phase: "implementation"
```

### v0.1.1 で追加する機能（v0.1.0との差分）

#### 1) 共通オプション（ヘルプ / バージョン）
- `-h, --help`：ルートおよび全サブコマンドで利用可能。表示後は exit code `0`。
- `--version`：ルート（`ideamark --version`）で利用可能。表示後は exit code `0`。
- 引数の誤りは exit code `2`（usage error）。

#### 2) describe の topic 追加（LLMプロンプト部品の出力）
v0.1.1 では `--spec` / `--pattern` は **保留**し、固定テンプレの出力を提供する。

- `ideamark describe ai-authoring [--format md|json|yaml]`
  - LLMへ貼り付けるための “AI authoring guide”（記述ガイド）を出力する。
  - default format: `md`

- `ideamark describe params [--format md|json|yaml]`
  - YAML成分の正規化と語彙制約のための “params normalize”（正規化指針）を出力する。
  - default format: `json`

既存 topic（`checklist` / `vocab` / `capabilities`）も維持する。

#### 3) `ideamark ls`（文書インデックス / 下見）
extract/compose 前に、IDや語彙を素早く確認するための調査コマンドを追加する。

```bash
ideamark ls [<infile>|-]
            [--sections] [--occurrences] [--entities] [--vocab]
            [--format json|md]
```

- デフォルトは全カテゴリ出力（sections/occurrences/entities/vocab）。
- 解析は working 相当でよい（strict を要求しない）。
- stdout：ls結果（json または md）。
- stderr：必要に応じて diagnostics（NDJSON）。
- exit code：`0` 成功 / `1` 解析不能 / `2` usage error。

### v0.1.1 では扱わない（保留）
- `describe --spec`（IdeaMark spec 文書からの機械抽出）
- `describe --pattern`（柔軟な抽出・合成テンプレ）
- anchorage等による任意フィルタリング describe
- lint/diff（v0.2.x）

```yaml
section_id: "SEC-CLI-SIGNATURES"
anchorage:
  view: "design"
  phase: "implementation"
```

### v0.1.0 CLI シグネチャ（確定）

#### 共通
- `<infile>` は省略可。省略時は stdin。`-` も stdin を意味する。
- `-o <outfile>` は省略可。省略時は stdout。`-o -` は stdout 明示。
- `--diagnostics <path|- >` は省略可。省略時は `validate` 以外 stderr（`-`）。
- exit code: `0` success / `1` failure / `2` usage error

#### ideamark validate
```
ideamark validate [<infile>|-] [--strict] [--fail-on-warn] [--mode working|strict]
```
- 出力: stdout に NDJSON（meta/diagnostic/summary）
- `--strict` は `--mode strict` の alias（両方ある場合は strict 優先）
- `--mode` default: `working`
- `--fail-on-warn` default: false

#### ideamark format
```
ideamark format [<infile>|-] [-o <outfile>|-] [--canonical]
```
- 出力: stdout（または `-o`）に整形済み文書
- diagnostics: stderr（または `--diagnostics`）に NDJSON
- `updated_at` は更新しない（冪等）

（将来予約）
- `--sync-registry`（v0.2.x）
- `--emit-stubs`（v0.2.x）

#### ideamark extract
```
ideamark extract [<infile>|-] [-o <outfile>|-] (--section <SEC_ID> | --occ <OCC_ID>)
```
- v0.1.0 は抽出ターゲットを単一指定（`--section` または `--occ` のどちらか 1 つ）
- 出力: 抽出成果物（新規 `doc_id`）
- メタ: `updated_at` 更新、`refs.sources` 記録

#### ideamark compose
```
ideamark compose <fileA> <fileB> [<fileN>...] [-o <outfile>|-]
                [--update --base <basefile>] [--doc-id <DOC_ID>] [--inherit none|first|base]
```
- default: Create（新規 `doc_id`、`--inherit none`）
- Update: `--update --base <basefile>`（base doc_id 継承、base優先）
- `--doc-id` があれば最優先
- 衝突: rename + aliases、参照追随、registry IDソート、Section順は structure.sections を正

#### ideamark publish
```
ideamark publish [<infile>|-] [-o <outfile>|-]
```
- pipeline: `format --canonical` → `validate --strict`
- success: Published文書を stdout（または `-o`）へ
- failure: 成果物は出力しない。diagnostics を stderr（NDJSON）へ
- メタ: `updated_at` 更新、`status.state=published`（存在する場合）

---

## SEC-DESCRIBE-COMMAND

```yaml
section_id: "SEC-DESCRIBE-COMMAND"
anchorage:
  view: "design"
  phase: "implementation"
```

### 目的

`ideamark describe` は、IdeaMark および CLI の仕様・語彙・チェックリストを
**機械可読かつ人間可読で出力する自己記述コマンド**である。

validate / format / compose などの実処理には影響しない。

### v0.1.0 スコープ（フィルタ無し・仕様照会特化）

#### 形式

```
ideamark describe <topic> [--format json|yaml|md]
```

#### topic

- `checklist`
  - Strict validate の必須項目一覧を出力する。
- `vocab`
  - anchorage.view / anchorage.phase / 主要フィールド語彙一覧を出力する。
- `capabilities`
  - この CLI が提供するコマンド一覧とバージョン情報を出力する。

#### 出力形式

- default: `md`
- `--format json` 推奨（AIエージェント利用想定）
- `--format yaml` も許容

### 非スコープ（v0.2.x 以降）

- anchorage 等によるフィルタリング describe
- template 適合度評価（lint 側で実装）
- 外部テンプレート解決

### I/O

- stdout に結果を出力する。
- diagnostics は原則発生しない（usage error のみ exit code 2）。
