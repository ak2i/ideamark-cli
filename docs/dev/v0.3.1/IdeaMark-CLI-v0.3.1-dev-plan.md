# IdeaMark-CLI v0.3.1 Development Plan

作成日: 2026-07-07  
対象仕様: `docs/specs/V1.2.0/*` の v0.3.0 計画後追加・修正分  
前バージョン: v0.3.0(IdeaMark Core v1.2.0 draft baseline)

## 1. 目的

v0.3.1 は、v0.3.0 で Core v1.2.0 の基礎対応として後送りした領域を、最新の V1.2.0 仕様修正に合わせて CLI に取り込むためのパッチリリースです。

特に今回の仕様更新では、Core 本体の必須 5 namespace だけでなく、次の「Core-adjacent」な要素が実装計画上の対象になりました。

- Part 4 §20 の optional `skeletons` namespace と Skeleton Graph shape
- Part 5 の Projection Profile / Projection Skeleton Graph guidance
- Part 6 の authoring loop、sample corpus、retrieval test suite guidance

v0.3.1 では、これらを **Core validation を壊さない additive support** として扱います。つまり、`skeletons` や Projection Profile は v1.2.0 Core の必須条件にはせず、round-trip 保全・基本形状診断・describe/ls での発見可能性・テスト素材化を優先します。

## 2. v0.3.0 からの方針差分

v0.3.0 計画では `extract` / `compose` / `publish` / `diff` / `lint`、Projection Library、retrieval evaluation は v0.3.1 以降へ後送りしていました。今回の V1.2.0 追記により、v0.3.1 ではそれら全てを本格実装するのではなく、以下のように段階化します。

| 領域 | v0.3.0 方針 | v0.3.1 方針 |
| --- | --- | --- |
| `skeletons` | unknown namespace として保全 | 既知 optional namespace として基本形状を warning validation |
| Projection Profile | scope out | `describe` で支援範囲を公開し、`meta.projections.inline` の最低限の shape hint を追加 |
| retrieval | scope out | Skeleton Graph match の fixture/test harness を追加。ただし検索エンジン化はしない |
| samples | Part 4 samples 中心 | Part 6 retrieval test suite pattern を fixture catalog に追加 |
| `ls` | Core object IDs と vocab | `--skeletons` / graph summary を追加 |
| `lint` | 再設計待ち | authoring guidance warning を任意 lint rule として復活検討 |
| `diff` | unsupported | YAML-preserving structural diff の設計だけ確定し、実装可否を切る |

## 3. スコープ

### 3.1 In Scope

1. **Skeleton Graph namespace support**
   - `skeletons` を既知 optional top-level namespace として扱う。
   - Core mode では malformed な `skeletons` を error にせず warning に留める。
   - Strict/profile mode では将来 profile rule に昇格できるよう診断 rule ID を分離する。
   - `format` は `skeletons` の順序・未知フィールド・コメントを保全する。

2. **Skeleton Graph diagnostics**
   - `skeletons` が配列でない。
   - graph object の `id` が欠落または非文字列。
   - `nodes` / `links` が配列でない。
   - node/link の duplicate id。
   - `links[].from` / `links[].to` が同一 graph 内 node id に解決しない。
   - `ref.kind` / `ref.id` が同一 document 内 Core object に解決しない場合は warning。ただし external/profile-defined ref は将来拡張として残す。

3. **`ls` extension**
   - `ideamark ls --skeletons` を追加する。
   - graph id、role、projection、node/link count、missing ref count を出力する。
   - `--vocab` に skeleton role / status / slot / link type を含める。

4. **`describe` extension**
   - `describe vocab` に skeleton link type 推奨語彙を追加する。
   - `describe checklist` に Skeleton Graph basic-shape checks を追加する。
   - `describe ai-authoring` / `prompt-authoring` に Part 6 の authoring loop と retrieval test suite の扱いを追記する。
   - `describe capabilities` に「Core validation」「Skeleton Graph basic validation」「Projection Profile は discovery only」を明示する。

5. **Retrieval test fixture harness**
   - Part 6 §18 の retrieval test case shape を `tests/fixtures/v1.2.0/retrieval/` に追加する。
   - CLI は retrieval engine ではなく、fixture を load して required_skeleton と document-side skeletons の基本一致を検査する小さな test utility を用意する。
   - テスト対象は「slot/link の完全一致・部分一致・missing slot visibility」までに限定する。

6. **Projection Profile discovery**
   - `meta.projections` の `role` / `ref` / `inline` は v0.3.0 と同じく Core では深い意味検証しない。
   - ただし `inline` が Projection Profile らしい shape を持つ場合、`describe` と `ls --vocab` で主要 area を観測可能にする。
   - 外部 Projection resolution、private projection store、compatibility scoring は実装しない。

7. **ドキュメント更新**
   - `cli-contract-v1.2.0.md` を `1.2.0-draft.2` として additive 更新する。
   - `diagnostic-codes.md` と `validation-checklist.md` に skeleton 系 rule/code を追加する。
   - `spec-feedback.md` に、Core validation と optional skeleton validation の境界について実装上の疑問を記録する。

### 3.2 Out of Scope

1. graph database / index / ranking engine の実装
2. LLM を使った reconstruction quality 評価
3. Projection Profile の完全 schema 定義・外部 resolvers・private policy enforcement
4. `extract` / `compose` / `publish` の v1.2.0 semantic redesign 完了
5. `diff` の完全実装。v0.3.1 では設計または実験フラグまで
6. source URI の到達確認や source content の照合
7. domain ontology、closed vocabulary enforcement、profile-specific strict validation の標準化

## 4. CLI 契約変更案

### 4.1 Contract version

- `contract.version`: `1.2.0-draft.1` → `1.2.0-draft.2`
- `tool.version`: `0.3.0` → `0.3.1`

### 4.2 `validate`

既存フラグは維持し、追加フラグは原則不要です。`skeletons` は optional namespace なので、既定 Core mode で warning diagnostics として出します。

新規診断コード案:

```text
skeletons_wrong_type
skeleton_object_invalid
skeleton_id_invalid
skeleton_duplicate_id
skeleton_nodes_wrong_type
skeleton_links_wrong_type
skeleton_node_id_invalid
skeleton_link_id_invalid
skeleton_link_endpoint_unresolved
skeleton_ref_unresolved
skeleton_unknown_link_type
```

severity 方針:

- Core mode: 全て warning。ただし YAML parse / top-level structure error は既存 loader error。
- Strict mode: shape 系は error 昇格候補。unknown vocabulary は warning のまま、または profile 設定がある場合のみ error。

### 4.3 `format`

- canonical top-level order に `skeletons` を追加する。
- 推奨 order: `meta, sources, sections, occurrences, entities, structure, skeletons, extensions, <others>`
- default round-trip mode は v0.3.0 と同じく保全優先。

### 4.4 `ls`

追加:

```text
ideamark ls [<infile>|-] [--skeletons] [--vocab] [--format json|md]
```

JSON 出力案:

```json
{
  "skeletons": [
    {
      "id": "skel-001",
      "role": "retrieval",
      "projection": "projection://example/v1",
      "nodes": 4,
      "links": 3,
      "unresolved_refs": 1,
      "unresolved_link_endpoints": 0
    }
  ]
}
```

### 4.5 `describe`

追加 topic は増やさず、既存 topic を拡張します。

- `describe capabilities`: skeleton basic validation supported を追記。
- `describe checklist`: `SKEL-*` rule group を追加。
- `describe vocab`: skeleton role/status/link type/slot examples を追加。
- `describe ai-authoring`: authoring loop、missing slot visibility、retrieval sample の作り方を追記。
- `describe params`: `ls --skeletons` と retrieval fixture runner を追記。

### 4.6 retrieval fixture runner

正式 CLI コマンドとしてはまだ追加しません。まず npm script または test helper に留めます。

候補:

```text
node tests/run-retrieval-fixtures-v0.3.1.js
```

将来 `ideamark test retrieval` のようなサブコマンドへ昇格するかは v0.3.1 の実装結果で判断します。

## 5. 実装フェーズ

### Phase 0. 仕様差分整理と契約更新

- Part 4 §20 / Part 5 §10, §14 / Part 6 §18 をチェックリストに反映する。
- `diagnostic-codes.md` に skeleton 系コードを追加する。
- `cli-contract-v1.2.0.md` を draft.2 に更新する。
- `spec-feedback.md` に optional namespace を「unknown」から「known optional」へ昇格する際の境界を記録する。

Exit criteria:

- ドキュメントだけで v0.3.1 の additive change が説明できる。
- v0.3.0 の既存 command/flag/code を破壊しないことが明記されている。

### Phase 1. Loader/model の skeleton index

- `src/core/model.js` に `skeletonsById`、graph-local `nodesById` / `linksById` index を追加する。
- 既存 Core object index とは分離し、Core required namespace の validation に影響させない。
- duplicate id は graph scope と document scope を分けて扱う。

Exit criteria:

- `skeletons` なしの既存 v1.2.0 fixture が完全に同じ結果になる。
- `skeletons` あり fixture が parse/model 化できる。

### Phase 2. Validator diagnostics

- `SKEL-*` rule group を実装する。
- Core mode warning / strict mode promotion のテストを追加する。
- unresolved `links[].from/to`、unresolved `ref`、unknown link type の fixture を追加する。

Exit criteria:

- Skeleton Graph example が warning 0 で通る。
- malformed skeleton fixture が expected warning を出す。
- `--fail-on-warn` で exit 1 になる。

### Phase 3. `format` / `ls` / `describe`

- canonical order に `skeletons` を追加する。
- `ls --skeletons` と `--vocab` 集計を実装する。
- describe guide JSON/Markdown を同期更新し、`npm run check:describe` を通す。

Exit criteria:

- `ideamark ls --skeletons --format json` が fixture に対して安定 snapshot を返す。
- describe generated artifacts がソースと同期する。

### Phase 4. Retrieval fixture harness

- Part 6 §18 の test case shape を fixtures として作成する。
- required_skeleton と document-side skeletons の slot/link matching を最小実装する。
- complete / partial / non-match / missing-slot-visible の期待結果を snapshot 化する。

Exit criteria:

- keyword-independent retrieval の「構造だけを使う」テストが存在する。
- partial match が missing slot を隠さず出力する。
- reconstruction quality は評価しないことがテスト名・README に明記されている。

### Phase 5. Release polish

- `package.json` version を `0.3.1` に更新する。
- README と release note を更新する。
- `npm test`、`npm run check:describe`、v0.3.0 smoke、v0.3.1 retrieval fixture test を実行する。

## 6. テスト計画

### Unit / node:test

- skeleton model indexing
- duplicate graph/node/link id detection
- link endpoint resolution
- Core vs strict severity mapping
- canonical order containing `skeletons`
- `ls --skeletons` JSON/Markdown output

### Fixture suites

```text
tests/fixtures/v1.2.0/skeletons/valid/
tests/fixtures/v1.2.0/skeletons/warnings/
tests/fixtures/v1.2.0/retrieval/
```

Fixture categories:

- valid recipe substitution skeleton
- valid heapq performance skeleton
- malformed `skeletons` namespace
- missing graph id
- duplicate node id
- unresolved link endpoint
- unresolved Core object ref
- unknown link type
- partial retrieval match with visible missing slot
- cross-domain structural match sample

### Regression

- v0.3.0 valid Core fixtures must not change diagnostics.
- v1.1.x migration tests must not produce skeletons unless source extension data explicitly maps to them.
- unknown top-level namespace preservation must still work for namespaces other than `skeletons`.

## 7. リスクと判断ポイント

1. **Core-adjacent warning が多すぎるリスク**  
   `skeletons` は optional なので、v0.3.1 では warning を最小限の shape / reference resolution に絞る。

2. **Projection Profile を schema 化しすぎるリスク**  
   Part 5 はまだ illustrative な領域が多い。CLI は discovery と describe に留め、validation はしない。

3. **retrieval test が検索エンジン実装に膨らむリスク**  
   v0.3.1 は fixture harness のみ。index/ranking/LLM reconstruction は明示的に対象外。

4. **Strict mode の意味が揺れるリスク**  
   skeleton shape の error 昇格は `strict` で行ってよいが、unknown slots / roles / link types は profile がない限り closed vocabulary とみなさない。

5. **v0.3.0 契約破壊リスク**  
   draft.2 は additive のみ。既存診断コードの severity 変更や flag 削除は行わない。

## 8. 完了条件

v0.3.1 は次を満たしたら完了とします。

- `skeletons` を含む v1.2.0 document を validate / format / ls できる。
- malformed skeletons は Core mode warning として説明可能な diagnostics を出す。
- `describe` が Skeleton Graph / Projection Profile / retrieval fixture support の境界を明示する。
- Part 6 §18 に沿った retrieval fixture harness があり、partial match と missing slot visibility を検査できる。
- v0.3.0 の Core validation / format / migrate / describe の既存テストが regression しない。
- release note が「v0.3.1 は additive skeleton/retrieval-fixture support であり、full retrieval engine ではない」と明記している。
