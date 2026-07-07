# IdeaMark-CLI v0.3.0 Development Plan

作成日: 2026-07-06  
対象仕様: `docs/specs/V1.2.0/*`(特に Part 4 — Core Specification)  
前バージョン: v0.2.0(IdeaMark Core v1.1.1 / doc-cli contract v1.1.1 準拠)

> 当初 v0.2.1 として起案したが、v1.1.1 → v1.2.0 の追従はドキュメントモデルの破壊的変更であるため **v0.3.0 に昇格**した(§8 D10)。

---

## 1. 目的

v0.3.0 の目的は、IdeaMark Core **v1.2.0(Part 4 Core Specification)** に CLI を追従させることです。

v1.1.1 → v1.2.0 は「局所的なルール変更」ではなく、**ドキュメント表現そのものの置き換え**です。

- v1.1.1: `.ideamark.md`(frontmatter + ```yaml フェンス混在の Markdown ハイブリッド)、keyed-map レジストリ、`payload` 必須の Entity モデル
- v1.2.0: `.ideamark.yaml`(純粋な単一 YAML マッピング)、**array-based object representation**、`meta / sources / sections / occurrences / entities` の 5 必須 namespace

したがって v0.3.0 は v0.2.0 のときと同様に「コアモデルの前提差し替え」であり、パーサ・内部モデル・バリデータを新規に作り直すことを主眼とします。

なお V1.2.0 仕様は **Status: Draft** です。仕様側 README も「今後の焦点は CLI と authoring tool の実装計画」と明言しており、CLI 実装は仕様レビュー(Part 4 `19-open-review-issues.md`)へのフィードバックループを兼ねます。実装中に発見した仕様の曖昧点は `docs/dev/v0.3.0/spec-feedback.md` に記録します。

---

## 2. v1.2.0 で押さえるべき仕様差分

### 2.1 ドキュメント構造(Part 4 §1–§2)

- 単一のトップレベル YAML マッピング。必須 namespace は `meta` / `sources` / `sections` / `occurrences` / `entities`
- 必須 namespace は**空でも Core mode では valid**(draft / template / staged authoring を許容)
- `sources` `sections` `occurrences` `entities` は**オブジェクト配列**が normative。各オブジェクトは非空文字列の `id` を必須とする
- keyed-map 形は normative ではない(migration 対象)
- `structure` / `relations` / `perspectives` / `provenance` / `extensions` は optional
- 推奨 ID prefix(`src-` `sec-` `occ-` `ent-`)は informative。Core mode で reject してはならない
- 推奨拡張子は `.ideamark.yaml` / `.ideamark.yml`

### 2.2 meta(§4)

- MUST: `spec_version`(= `ideamark-core-v1.2.0`)、`document_id`、`status`(いずれも非空文字列)
- `spec_version` 欠落は error。未サポート値は migration/compat mode でない限り SHOULD reject
- 推奨: `title` `description` `created_at` `updated_at` `lang` `profiles`
- `meta.projections`: `role` + `ref` | `inline` を持つ参照オブジェクト配列。inline の中身は Core では**意味検証しない**(構造として parse できればよい)
- `meta.generation` / `meta.migration` / `meta.revision` / `meta.supersedes` / `meta.compatibility` は optional な traceability メタデータ

### 2.3 sources(§5)— 新規の必須 namespace

- MUST: `id` のみ。`type` `title` `uri` 等は SHOULD/推奨
- 推奨 source type: `document` `web_page` `code_file` `repository` `dataset` `image` `audio` `video` `stream` `generated_artifact` `composite` `other`(open vocabulary)
- URI 参照解決・実在確認は Core validation の責務外

### 2.4 anchors(§6)— 新しい共通 anchor モデル

- `anchors` は Section / Occurrence / Entity に置ける**配列**
- 各 anchor は MUST: `source`(既存 `sources[].id` に解決必須)+ `type`
- optional: `precision`(`exact | approximate | inferred | unknown`)、`role` / `purpose`、type 別フィールド(`ranges[].start/end`、`path`、`region` など)
- 推奨 anchor type: `line_range` `character_range` `paragraph` `heading_path` `page_range` `media_time_range` `image_region` `dataset_*` `repository_path` `code_symbol` `composite_fragment` `other`(open vocabulary)
- approximate / inferred を理由に reject してはならない

### 2.5 sections / occurrences / entities(§7–§9)

- Section: MUST `id`。`occurrences` は **ID 参照の順序付き配列**(この順序が reconstruction order)。未解決参照は error。空配列は placeholder として許容(warning)
- Occurrence: MUST `id`。**non-placeholder は `entity` + `role` 必須**。`entity` 未解決は error。`confidence` は 0–1 域外で warning。同一 Occurrence の複数 Section 参照は warning
- Entity: MUST `id`。`content` | `payload` | `ref` の少なくとも 1 つを持つべき(欠くと placeholder warning)。`content` は string、`ref` は非空 string を型チェック。`payload` はスキーマ検証しない(保全のみ)
- role / kind / status は **open vocabulary**(Core mode は warn のみ、strict は reject 可)

### 2.6 バリデーション(§13)

2 つのモード:

- **Core mode**: parse 可能性、必須 namespace とその型、オブジェクト形状、`id`、namespace 内重複 ID、必須参照解決(`sections[].occurrences[]` → occ、`occurrences[].entity` → ent、`anchors[].source` → src)、`meta` 必須フィールド。placeholder・未知語彙・未知 namespace・未知フィールドは **warning に留める**
- **Strict mode**: 未知 namespace / 未知フィールド / 未知語彙 / placeholder / 未宣言 extension / 未サポート spec_version を reject **してもよい**

severity は `error / warning / info`。**診断コードと出力形式は Part 4 の範囲外で、CLI 側が定義する責務**(§19.7)。

### 2.7 シリアライズ・round-trip(§15)

- formatter は unknown namespace / extension field / 配列順序 / optional field を**既定で保全**(silent drop 禁止)
- canonical 整形は明示的なモードとしてのみ提供
- YAML anchor/alias、merge key、multi-doc stream 等は SHOULD NOT(strict で reject 可)
- ID・参照は string。UTF-8

### 2.8 マイグレーション(§14)

v1.1.x / Part 3 実験形からの想定変換:

- keyed map → array(元キーを `id` として保存)
- ヘッダフィールド(`ideamark_version` / `doc_id` / `status` …)→ `meta.*`
- `meta.original_sources` → トップレベル `sources`
- 単数 `anchor` + `line_ranges` + `anchor_type` → `anchors[]` + `ranges` + `role`
- Projection 系データ → `meta.projections`(reference or 限定 inline)
- 未解決参照は silent drop 禁止(warning 付き保全 / placeholder 生成 / strict では fail)
- `meta.migration` に変換記録を残す

---

## 3. 現行実装(v0.2.0)との主なギャップ

| 領域 | 現状 | v1.2.0 要求 |
| --- | --- | --- |
| 入力形式 | `.ideamark.md`(frontmatter + yaml フェンスの segment tokenizer) | 単一 YAML ドキュメント(`.ideamark.yaml`) |
| 内部モデル | keyed-map registry(`entities/occurrences/sections/relations/perspectives`) | 配列 + `id`。`sources` namespace と anchors モデルが存在しない |
| validate | v1.1.1 Core Constraints(payload 必須、`working/strict` モード) | Part 4 §13 の Core/Strict モード。meta 必須 3 フィールド、参照解決の再定義 |
| format | Markdown segment 再構成 | YAML round-trip 保全(unknown/extension/順序/可能ならコメント) |
| extract/compose/publish/diff/ls | v1.1.1 registry 形状前提 | 全て新モデルへの再設計が必要 |
| describe | contract 1.1.1 固定の vocabulary / checklist | v1.2.0 語彙(status/type/role/kind/precision)と checklist |
| `--version --format json` | `contract: 1.1.1` / `document_spec: 1.1.1` | `document_spec: ideamark-core-v1.2.0` 系へ更新 |
| tests | `tests/fixtures/v1.1.1/*`(md 形式) | Part 4 `samples/*.ideamark.yaml` を valid corpus とする新 fixture 群 |
| migration | なし | v1.1.1 md → v1.2.0 yaml 変換(新規) |

---

## 4. v0.3.0 のスコープ

### In Scope

1. v1.2.0 YAML ドキュメントの parser / 内部モデル(新規実装)
2. `validate`: Part 4 §13 準拠の Core mode / Strict mode
3. `format`: round-trip 保全 + `--canonical`
4. `migrate`(新コマンド): v1.1.1 `.ideamark.md` → v1.2.0 `.ideamark.yaml`
5. `ls`: 新モデル対応(sources / sections / occurrences / entities / vocab)
6. `describe`: v1.2.0 語彙・checklist・capabilities への更新
7. CLI 診断コードレジストリの策定(Part 4 §19.7 で CLI 側責務とされたもの)
8. Part 4 samples を含む conformance fixture / regression test 整備
9. README / guides / package.json の v1.2.0 追従
10. 仕様フィードバックの記録(`spec-feedback.md`)

### Out of Scope(v0.3.1 以降へ後送り)

1. `extract` / `compose` / `publish` / `diff` の v1.2.0 対応(新モデルでの意味論を再設計してから実装する。v0.3.0 では v1.2.0 入力に対し明示的な `unsupported` エラーを返す)
2. profile 定義・profile 検証(`meta.profiles` は「宣言の保全 + 未サポート warning」まで)
3. Projection Library / Part 5 関連ツーリング
4. 外部 URI の到達確認、source content 検証、canonical JSON 表現
5. `lint` の v1.2.0 プロファイル再設計(validate の warning 群で v0.3.0 は代替。lint 独自ルールは v0.3.1 で再検討)

---

## 5. 実装方針

### 方針 A: v1.2.0 エンジンは新規モジュールとして実装する

既存 `src/parser.js` / `src/validate.js` は Markdown segment モデルと v1.1.1 制約に深く結合しているため、改修ではなく `src/core/`(仮)に v1.2.0 用の loader / model / validator / formatter を新規実装します。

- `src/core/load.js` — YAML → Document(単一マッピング検査、parse error 収集)
- `src/core/model.js` — 配列 → 内部 index(id → object)構築、重複検出はここで
- `src/core/validate.js` — Core/Strict モード
- `src/core/format.js` — round-trip / canonical
- `src/core/migrate.js` — v1.1.1 → v1.2.0

`yaml` パッケージの Document API(CST/コメント保持)を用い、format は**テキスト→テキスト**の round-trip として実装します(JS オブジェクト経由の再シリアライズはコメント・スタイルを失うため)。

### 方針 B: v1.1.1 コードパスは migrate の入力専用として凍結する

v0.2.0 の「後方互換を持たない」方針を踏襲しつつ、v1.1.1 資産の救済路として `migrate` を提供します。

- `validate` / `format` / `ls` は v1.2.0 ドキュメントのみを対象とする
- 入力の判別は `meta.spec_version` を第一に、なければ v1.1.1 構造(frontmatter / `ideamark_version`)のヒューリスティクスで「これは v1.1.1 です。`ideamark migrate` を使ってください」という actionable なエラーを返す
- 既存 v1.1.1 パーサは `migrate` の入力読み取りにのみ再利用し、新規修正は行わない

### 方針 C: validate を最初に完成させる

v0.2.0 と同じ順序原則です。loader / model / validator を先に固め、Part 4 samples が Core mode で pass することを最初のマイルストーンにします。formatter / migrate はその内部モデルの上に実装します。

### 方針 D: 診断コードを最初に確定し、仕様章と対応付ける

Part 4 は診断コードを CLI に委譲しています(§19.7.1)。v0.3.0 で `docs/dev/v0.3.0/diagnostic-codes.md` をレジストリとして起こし、コード → Part 4 章番号の対応を明記します。命名は現行の snake_case を踏襲します。

想定エラーコード(§13.6 対応):

```
yaml_parse_error            top_level_not_mapping
required_namespace_missing  required_namespace_wrong_type
meta_field_missing          meta_field_invalid
object_not_mapping          object_id_invalid
duplicate_id
occurrence_entity_missing   occurrence_role_missing
unresolved_reference        anchor_source_missing
anchor_field_missing        spec_version_unsupported
```

想定 warning コード(§13.7 対応):

```
placeholder_object          empty_namespace
unknown_namespace           unknown_field
unknown_status              unknown_source_type
unknown_anchor_type         unknown_precision
unknown_projection_role     confidence_out_of_range
occurrence_unreferenced     entity_unreferenced
occurrence_multi_section    structure_section_unresolved
structure_section_omitted   structure_section_duplicate
source_metadata_missing     anchor_range_invalid
cross_namespace_id_reuse    null_optional_field
profile_unsupported
```

出力は現行 NDJSON(meta 行 + diagnostics + summary)形式を維持し、`severity / code / message / path / object_id / field` を必須メンバーとします(§13.13 の推奨に一致)。

---

## 6. 優先実装順

### Phase 0. 仕様固定と CLI 契約ドラフト

- Part 4 MUST / SHOULD / MAY を検証チェックリスト化(`validation-checklist.md`)
- 診断コードレジストリ確定(`diagnostic-codes.md`)
- コマンド仕様(フラグ・exit code・入出力)を `cli-contract-v1.2.0.md` としてドラフト
  - `validate [--mode core|strict] [--fail-on-warn] [--allow-unsupported-spec]`(既定 core)
  - `format [--canonical]`
  - `migrate <in> [-o out] [--from v1.1.1] [--strict]`
  - exit code: 0 = ok / 1 = validation・処理失敗 / 2 = usage(現行踏襲)
- Part 4 samples 6 本 + manifest を fixture 化し、期待診断(warning 含む)を確定

### Phase 1. Core loader / model / validator

- `src/core/load.js` + `src/core/model.js`
- Core mode validator: §13.6 の error 全件 → §13.7 の warning 全件の順で実装
- anchors 共通検証(§6.15)、structure 検証(§10.9)
- Part 4 samples が Core mode で error 0 になることをマイルストーンとする
- invalid / warning fixture 群(`tests/fixtures/v1.2.0/{valid,invalid,warnings}/`)を並行整備

### Phase 2. Strict mode

- 未知 namespace / 未知フィールド / 未知語彙 / placeholder / 未宣言 extension の reject
- warning → error への昇格マトリクスをチェックリストに明記
- YAML 制限機能(anchor/alias、merge key、multi-doc)の検出と strict reject

### Phase 3. formatter(round-trip / canonical)

- round-trip: unknown / extension / 順序 / コメントの保全検証(fixture の byte-level または semantic-level 安定性テスト)
- `--canonical`: namespace を推奨順(`meta, sources, sections, occurrences, entities, structure, extensions`)に整列、インデント・quote スタイル統一。データ削除は行わない

### Phase 4. migrate

- v1.1.1 `.ideamark.md` reader(既存 parser 再利用)→ v1.2.0 変換
- §14.6–§14.11 の変換規則(keyed map→array、header→meta、original_sources→sources、anchor→anchors、`meta.migration` 記録)
- 変換後に Core mode validate を自動実行し、診断を併せて出力
- v1.1.1 fixture corpus を migrate → validate する regression test

### Phase 5. 周辺コマンドとドキュメント

- `ls` の新モデル対応、`describe` の語彙・checklist・capabilities 更新
- `extract/compose/publish/diff/lint` に v1.2.0 入力時の明示的 unsupported エラーを実装
- `--version --format json` の `document_spec` を `ideamark-core-v1.2.0` へ
- README / guides / `package.json`(`files` に `docs/dev/v0.3.0/` を追加)更新
- `spec-feedback.md` を仕様リポジトリへの報告形式に整理

---

## 7. テスト計画

1. **Conformance(valid)**: Part 4 `samples/*.ideamark.yaml` 6 本 — Core mode で error 0。期待 warning はスナップショット固定
2. **Invalid fixtures**: §13.6 の各 error を 1 fixture 1 論点で網羅(必須 namespace 欠落 / 型不正 / id 不正 / 重複 / 未解決参照 / anchor 不正 / meta 欠落 / non-mapping item)
3. **Warning fixtures**: §13.7 の主要 warning(placeholder / 未知語彙 / unreferenced / multi-section / confidence 域外 / structure 不整合)
4. **Round-trip**: format 前後で unknown namespace・extension field・配列順序・コメントが保全されること
5. **Strict mode**: Core で warning のものが strict で error に昇格すること
6. **Migration**: v1.1.1 fixture → migrate → Core mode valid。ID・参照・extension の保全確認
7. **Smoke**: `tests/run-smoke-v0.3.0.js` として CLI E2E(validate / format / migrate / ls / describe)

---

## 8. 決定事項

当初オープン課題として挙げた O1–O6 は 2026-07-06 のレビューで以下の通り決定した。

- **D1**: v0.3.0 は v1.2.0 を唯一の正規仕様とし、v1.1.1 は `migrate` 入力としてのみ扱う(v0.2.0 方針 A の踏襲)
- **D2**: `extract/compose/publish/diff/lint` の v1.2.0 再設計は v0.3.1 以降(スコープ肥大の回避)
- **D3**: validate の既定モードは Core mode。旧 `working` モード名は廃止
- **D4**: 診断コードは CLI レジストリで管理し、Part 4 章番号と対応付ける
- **D5**(旧 O1): placeholder 判定は**フィールド欠落のみ**で行う(`status: draft` を要件にしない)。`placeholder_object` warning のメッセージに「意図的な placeholder なら `status: draft` の付与を推奨」を含め、authoring 側の意図表明を促す
- **D6**(旧 O2): `meta.projections.inline` はサイズ・スコープを**検証しない**(YAML として parse できれば警告なし)。警告基準は仕様側の決着(§19.4.2)を待つ
- **D7**(旧 O3): 未知 `spec_version` は既定で error(`spec_version_unsupported`)。`--allow-unsupported-spec` フラグで warning に降格可能とする(SHOULD reject への適合を保ちつつ運用の逃げ道を提供)
- **D8**(旧 O4): `--mode strict` は仕様上 MAY の reject 項目を**全て有効**にする(未知 namespace / フィールド / 語彙、placeholder、undeclared extension、YAML 制限機能)。中間段階は `--mode core --fail-on-warn` が担う 3 段構成とし、個別 opt-out フラグは需要が確認されてから追加する
- **D9**(旧 O5): anchor の `role` / `purpose` は open vocabulary として**警告なしで通す**(§6.3.1 で OPTIONAL と明記済み)。Part 4 samples の期待診断もこれを前提に固定する
- **D10**(旧 O6): モデル破壊的変更のため、リリースは v0.2.1 ではなく **v0.3.0** とする

### 仕様側へのフィードバック事項(spec-feedback.md へ記録)

- F1(D5 関連): placeholder の判定条件が例示のみ(§3.14)。「意図的 placeholder の明示マーカー(例: `status: draft`)を推奨事項として明文化するか」を提起する
- F2(D6 関連): `meta.projections.inline` のスコープガイダンス(§19.4.2)の決着を待つ。CLI 側の暫定挙動(無検証)を報告する

---

## 9. リリースチェックリスト

- [ ] Part 4 samples 6 本が `validate --mode core` で error 0
- [ ] invalid / warning fixture の期待診断が全件一致
- [ ] round-trip format の保全テスト green
- [ ] migrate: v1.1.1 corpus 全件が変換後 Core valid
- [ ] `describe capabilities` / `checklist` / `vocab` が v1.2.0 語彙を返す
- [ ] `--version --format json` が v1.2.0 系を報告
- [ ] README / guides 更新、`package.json` version = 0.3.0
- [ ] `spec-feedback.md` を IdeaMark Core リポジトリへ報告できる形で確定
