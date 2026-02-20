# IdeaMark Background: ideamark CLI v0.1.1（v0.1.0→v0.1.1差分 / 開発版 v0.1）

```yaml
ideamark_version: 1
doc_id: "ideamark.cli.ideamark-cli.background"
doc_type: "background"
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
    - uri: "./ideamark-cli_test-spec_validate_v0.8.ideamark.md"
      relation: "related"
    - uri: "./ideamark-cli_test-spec_compose_v0.8.ideamark.md"
      relation: "related"
constraints:
  - "Strict運用（YAML必須）を前提にする"
  - "外部参照（URL/FQID）は v0.1.0 では解決しない（存在検証のみ）"
```

---

## Section 001 : Context（なぜいま必要か）
```yaml
section_id: "SEC-CONTEXT"
anchorage:
  view: "background"
  phase: "confirmed"
```
### OCC-CONTEXT-1 : 問題設定
```yaml
occurrence_id: "OCC-CONTEXT-1"
entity: "IE-PROBLEM"
role: "primary_statement"
status:
  state: "confirmed"
  confidence: 0.90
```
LLMを使ってIdeaMark文書を作成・編集する場合、トークン幅制限により「一発で大きな文書を整合した形で生成する」ことが難しい。  
その結果、Markdown本文だけが生成され、意図・読み方・制約（=意味の発生条件）が失われるリスクがある。

### OCC-CONTEXT-2 : 解決方針（IdeaMark構造による分割統合）
```yaml
occurrence_id: "OCC-CONTEXT-2"
entity: "IE-APPROACH"
role: "primary_statement"
status:
  state: "confirmed"
  confidence: 0.90
```
IdeaMarkは、Section / Occurrence / Entity を単位として文書を分解し、後から **合成（compose）** と **抽出（extract）** によって統合・再構成できる。  
この分割統合により、生成時だけでなく別文脈・別タイミングで作られた文書の合成、巨大文書からの部分抽出を実現できる。

---

## Section 002 : Hypothesis Intent（仮説意図）
```yaml
section_id: "SEC-HYP-INTENT"
anchorage:
  view: "structural_hypothesis"
  phase: "confirmed"
```
### OCC-HYP-1 : Strict（YAML必須）を採用する仮説意図
```yaml
occurrence_id: "OCC-HYP-1"
entity: "IE-HYP-STRICT"
role: "hypothesis_intent"
status:
  state: "confirmed"
  confidence: 0.85
```
Strict運用（YAML必須）を採用し、各Sectionにanchorageを要求することで、生成・編集の分割統合を行っても「意図・読み方」が失われにくくなり、合成後の検証可能性が上がる。

### OCC-HYP-2 : CLIで“致命的事故”を避ける仮説意図
```yaml
occurrence_id: "OCC-HYP-2"
entity: "IE-HYP-SAFETY"
role: "hypothesis_intent"
status:
  state: "confirmed"
  confidence: 0.85
```
ideamark CLIは、意味解釈に踏み込まず、参照整合・ID衝突などの **致命的事故** を機械的に防ぐ最小コアを提供する。  
重複かもしれない・同一かもしれない、といった議論の余地は人間/AIに委ね、ツールは材料（warning/info）を出すに留める。

---


### OCC-HYP-3 : 内部参照（ideamark://）の準備
```yaml
occurrence_id: "OCC-HYP-3"
entity: "IE-HYP-REF-URI"
role: "hypothesis_intent"
status:
  state: "confirmed"
  confidence: 0.80
```
ローカル作文では外部URLが未確定になりやすいため、参照はまず **ローカルID** または **IdeaMark URI（`ideamark://docs/...`）** の内部表現で書けるようにする。  
将来、外部ストレージへ格納する段階で、必要に応じて内部参照（doc単位など）を格納場所に従う外部参照へ書き換える処理を追加できるよう、v0.1.0 の時点から参照表現の正準形を揃えておく。

## Section 003 : Success Criteria（成功の定義）
```yaml
section_id: "SEC-SUCCESS"
anchorage:
  view: "plan"
  phase: "confirmed"
```
### OCC-SUCCESS-1 : v0.1.0で達成すべきこと
```yaml
occurrence_id: "OCC-SUCCESS-1"
entity: "IE-SUCCESS"
role: "success_criteria"
status:
  state: "confirmed"
  confidence: 0.90
```
v0.1.0は、次を満たすことで仮説検証の土台になる：
- Strict（YAML必須）のvalidateが実用レベルで動く
- extract/composeが参照整合を壊さずに動く
- 生成を分割しても、compose後に「抜け・切れ」をvalidateで検出できる

---

---

## Section 004 : Implementation Clarifications（実装方針の確定）
```yaml
section_id: "SEC-IMPL"
anchorage:
  view: "background"
  phase: "confirmed"
```

### OCC-IMPL-1 : v0.1.0で確定した実装方針
```yaml
occurrence_id: "OCC-IMPL-1"
entity: "IE-IMPL"
role: "primary_statement"
status:
  state: "confirmed"
  confidence: 0.85
```

- Ref（参照追跡）は **YAML内参照のみ**（Markdown本文中のID/リンクは追跡しない）
- 参照表現はローカルIDに加え `ideamark://docs/{doc_id}#...`（内部の正準形）と FQID（`<doc_id>#<local_id>`）を許容し、v0.1.0 は外部解決を行わない（formatで正準化余地を残す）
- 将来、文書を外部へ格納する段階で `ideamark://`（内部参照）→ 外部URL へ変換する“export”処理を追加できるよう、参照表現の区別（プロトコル）を先に固定する
- extract は参照グラフの **推移閉包**を取り、出力を自己完結（単体でStrict validate通過）させる
- Strict validate の Document Header 必須は YAML Spec v1 の必須項目に合わせる
- compose の `structure.sections` は A順序維持 + B末尾追加（重複除外）


---

## Section 005 : Test Strategy（検証の進め方）
```yaml
section_id: "SEC-TEST-STRATEGY"
anchorage:
  view: "plan"
  phase: "confirmed"
```
### OCC-TEST-STR-1 : 最小セットに絞らず fixtures を先に作る
```yaml
occurrence_id: "OCC-TEST-STR-1"
entity: "IE-TEST-STRATEGY"
role: "primary_statement"
status:
  state: "confirmed"
  confidence: 0.80
```
v0.1.0 の機能的テストは、まずケース一覧を **網羅的に fixtures 化**し、実際に生成・運用してみてから「無理がある/意味がない」ものを削る。  
これにより、設計上の曖昧さ（Ref範囲、閉包境界、rename追随など）を早期に露出させ、CLI実装の受け入れ基準を固定できる。


---

## Section 006 : Test Artifacts Split（v0.8での分業明確化）
```yaml
section_id: "SEC-TEST-SPLIT"
anchorage:
  view: "background"
  phase: "confirmed"
```
v0.8 以降、テスト資産は次の三層で管理する。

1. **FlowMark Test Catalog**  
   - 網羅列挙と漏れ検出（coverage）を担う  
2. **IdeaMark Test Spec**  
   - 判定基準・受け入れ条件（diagnostics契約、rename/参照追随ルール等）を定義する  
3. **fixtures**  
   - 実行可能な入力・期待結果の最小単位

Background文書は「なぜその分業が必要か」という仮説意図と前提を保持し、  
テストケースの完全列挙は FlowMark を正とする。

## Registry（Entities / Occurrences / Sections）
```yaml
entities:
  IE-TEST-STRATEGY: { kind: "plan", content: "v0.1.0 テストを網羅的にfixtures化してから取捨選択する", atomic_state: true }
  IE-PROBLEM: { kind: "background", content: "LLMトークン制約とYAML欠落リスク", atomic_state: true }
  IE-APPROACH: { kind: "background", content: "Section/Occurrence/Entityの分割統合（extract/compose）", atomic_state: true }
  IE-HYP-STRICT: { kind: "hypothesis_intent", content: "Strict（YAML必須）で意図を保持し検証可能性を上げる", atomic_state: true }
  IE-HYP-SAFETY: { kind: "hypothesis_intent", content: "意味解釈せず致命的事故を避ける最小コア", atomic_state: true }
  IE-HYP-REF-URI: { kind: "hypothesis_intent", content: "内部参照（ideamark://）を先に揃え、将来の外部参照書き換えに備える", atomic_state: true }
  IE-SUCCESS: { kind: "success_criteria", content: "v0.1.0の成功条件", atomic_state: true }
  IE-IMPL: { kind: "background", content: "v0.1.0で確定した実装方針（Ref=YAMLのみ、extract=推移閉包など）", atomic_state: true }

occurrences:
  OCC-TEST-STR-1: { entity: "IE-TEST-STRATEGY", role: "primary_statement", status: { state: "confirmed" } }
  OCC-CONTEXT-1: { entity: "IE-PROBLEM", role: "primary_statement", status: { state: "confirmed" } }
  OCC-CONTEXT-2: { entity: "IE-APPROACH", role: "primary_statement", status: { state: "confirmed" } }
  OCC-HYP-1: { entity: "IE-HYP-STRICT", role: "hypothesis_intent", status: { state: "confirmed" } }
  OCC-HYP-2: { entity: "IE-HYP-SAFETY", role: "hypothesis_intent", status: { state: "confirmed" } }
  OCC-HYP-3: { entity: "IE-HYP-REF-URI", role: "hypothesis_intent", status: { state: "confirmed", confidence: 0.8 } }
  OCC-SUCCESS-1: { entity: "IE-SUCCESS", role: "success_criteria", status: { state: "confirmed" } }
  OCC-IMPL-1: { entity: "IE-IMPL", role: "primary_statement", status: { state: "confirmed" } }

sections:
  SEC-TEST-SPLIT: { anchorage: { view: "background", phase: "confirmed" }, occurrences: [] }
  SEC-TEST-STRATEGY: { anchorage: { view: "plan", phase: "confirmed" }, occurrences: ["OCC-TEST-STR-1"] }
  SEC-CONTEXT: { anchorage: { view: "background", phase: "confirmed" }, occurrences: ["OCC-CONTEXT-1","OCC-CONTEXT-2"] }
  SEC-HYP-INTENT: { anchorage: { view: "structural_hypothesis", phase: "confirmed" }, occurrences: ["OCC-HYP-1","OCC-HYP-2","OCC-HYP-3"] }
  SEC-SUCCESS: { anchorage: { view: "plan", phase: "confirmed" }, occurrences: ["OCC-SUCCESS-1"] }
  SEC-IMPL: { anchorage: { view: "background", phase: "confirmed" }, occurrences: ["OCC-IMPL-1"] }


structure:
  sections: ["SEC-CONTEXT","SEC-HYP-INTENT","SEC-SUCCESS","SEC-IMPL", "SEC-TEST-STRATEGY","SEC-TEST-SPLIT"]
```

---

## SEC-REGISTRY-POLICY

```yaml
section_id: "SEC-REGISTRY-POLICY"
anchorage:
  view: "concept"
  phase: "validation"
```

本プロジェクトでは Registry を source of truth とする設計方針を採用する。
validate / format は Registry を基準に動作する。


---

## SEC-ID-POLICY

```yaml
section_id: "SEC-ID-POLICY"
anchorage:
  view: "concept"
  phase: "validation"
```

本プロジェクトでは `doc_id` を概念IDとして固定し、版管理はファイル名で行う。
Entity/Occurrence/Section のIDは文書内一意を原則とし、compose衝突時はUUID短縮サフィックスで rename する。
rename は `aliases` として旧IDを保持する。

---

## SEC-WORKING-PUBLISHED-MODEL

```yaml
section_id: "SEC-WORKING-PUBLISHED-MODEL"
anchorage:
  view: "concept"
  phase: "implementation"
```

本プロジェクトでは Working と Published を明確に分離する。

- Working: local ID 参照、編集・議論・生成用。
- Published: canonical 参照（URI形式）、DB登録・共有用。
- extract は常に新規 doc_id。
- compose は Create（新規）と Update（既存更新）を区別する。

---

## SEC-VALIDATE-DIAGNOSTICS

```yaml
section_id: "SEC-VALIDATE-DIAGNOSTICS"
anchorage:
  view: "concept"
  phase: "implementation"
```

validate は JSON Lines（NDJSON）で diagnostics を出力する。
severity は error/warning/info、code は snake_case、location（scope/path/id）と mode を必須とする。

---

## SEC-COMPOSE-CONFLICT-AND-ORDER

```yaml
section_id: "SEC-COMPOSE-CONFLICT-AND-ORDER"
anchorage:
  view: "concept"
  phase: "implementation"
```

compose は dedupe せず rename で吸収する。
RegistryはIDソートで安定化し、Section順は structure.sections を正とする。

---

## SEC-FORMAT-SCOPE

```yaml
section_id: "SEC-FORMAT-SCOPE"
anchorage:
  view: "concept"
  phase: "implementation"
```

format は整形のみを担い、sync はオプションで分離する。
YAML表記の厳密一致は要求せず、構文的に有効であることを重視する。
Section順は structure.sections を正とし、formatではupdated_atを更新しない。

---

## SEC-TEMPLATE-REFERENCE-AND-LINT

```yaml
section_id: "SEC-TEMPLATE-REFERENCE-AND-LINT"
anchorage:
  view: "concept"
  phase: "implementation"
```

template は必須ではなく、適合性は将来の lint で warning として評価する。
参照は refs.template に記録し、formatはtemplate強制を行わない。

---

## SEC-PUBLISH-COMMAND

```yaml
section_id: "SEC-PUBLISH-COMMAND"
anchorage:
  view: "concept"
  phase: "implementation"
```

publish は Working を Published に正規化するまでを責務とし、DB登録や配置は呼び出し側に委ねる。
デフォルトは `format --canonical` → `validate --strict`。syncは含めず、updated_atを更新する。

---

## SEC-COMMAND-IO-CONVENTIONS

```yaml
section_id: "SEC-COMMAND-IO-CONVENTIONS"
anchorage:
  view: "concept"
  phase: "implementation"
```

v0.1.0では、infile省略時はstdin、成果物はstdout、validate以外のdiagnosticsはstderrを基本とする。

---

## SEC-CLI-SIGNATURES

```yaml
section_id: "SEC-CLI-SIGNATURES"
anchorage:
  view: "concept"
  phase: "implementation"
```

v0.1.0 の CLI シグネチャを確定した（validate/format/extract/compose/publish と I/O 規約）。

---

## SEC-DESCRIBE-COMMAND

```yaml
section_id: "SEC-DESCRIBE-COMMAND"
anchorage:
  view: "concept"
  phase: "implementation"
```

describe は仕様・語彙・チェックリストを出力する自己記述コマンドとして復活。
v0.1.0 ではフィルタ無しの静的照会のみを扱う。

---

## SEC-V0-1-1-RATIONALE

```yaml
section_id: "SEC-V0-1-1-RATIONALE"
anchorage:
  view: "concept"
  phase: "implementation"
```

### v0.1.1 の狙い

- v0.1.0 の中核機能（validate/format/extract/compose/publish/describe）を維持しつつ、
  実運用で詰まりやすい “使い勝手” を改善して、ideamark を後工程で継続利用できる状態にする。
- 追加内容は「沼りにくい」範囲に限定する：
  - help/version
  - LLMプロンプト部品（describe: ai-authoring/params）
  - extract前の下見（ls）
- `--spec`/`--pattern` による spec 抽出は将来（v0.2+）で検証し、まずは固定テンプレ運用で足場を作る。
