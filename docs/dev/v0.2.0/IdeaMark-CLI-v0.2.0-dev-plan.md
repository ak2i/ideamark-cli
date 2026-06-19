# IdeaMark-CLI v0.2.0 Development Plan

作成日: 2026-06-19  
対象仕様: `docs/specs/V1.1.1/*`

---

## 1. 目的

v0.2.0 の目的は、IdeaMark Core v1.1.1 に CLI を追従させ、旧 v1.0.3 前提の構造依存を解消することです。  
今回の開発は機能追加よりも先に、`Entity / Occurrence / Section / Relation / Validation` のコアモデルを v1.1.1 に合わせて再定義することを主眼に置きます。

---

## 2. v1.1.1 で押さえるべき仕様差分

### 2.1 コア方針

- IdeaMark は knowledge-representation format ではなく、payload-agnostic meaning-structure framework
- validate が担保するのは meaning ではなく structure
- payload の意味解釈、profile semantics、外部 URI 到達性は Core validation の責務外

### 2.2 モデル上の重要点

- `entities.*.payload` が必須
- `payload` は `body | ref | cache` の少なくとも 1 つを持つ必要がある
- `payload.format.media_type` は SHOULD、`profile/version/definition_ref` は MAY
- `payload.ref.uri` は MUST、`selector` は MAY
- `payload.cache.body/captured_at/source_hash` は推奨項目
- `atomicity_basis` は `interpretive | lexical | structural`、省略時 default は `interpretive`
- `perspective_scope` は Entity の extraction provenance
- `sections.*.occurrences` は non-empty array 必須
- `relations` は `relation_id` を持つ名前空間として扱う必要がある

---

## 3. 現行実装との主なギャップ

### 3.1 validate / lint

- `src/validate.js` が `anchorage_required` を error にしており、v1.1.1 の optional 方針と不一致
- `src/validate.js` は `payload` 必須や `payload.body/ref/cache` の充足を検証していない
- `src/validate.js` / `src/lint.js` は `relations` を `relation_id` 名前空間として扱っていない
- strict checklist が `v1.0.3` 由来の項目に寄っている

### 3.2 parser / internal model

- `src/parser.js` の section 判定が `section_id && anchorage` 前提
- `src/parser.js` の registry 初期値が `relations: []` で、v1.1.1 の map 形に合っていない
- `classifyBlock` が新しい Entity payload 中心モデルを前提にしていない

### 3.3 transform commands

- `src/extract.js` は `target/supporting_evidence/derived_from` など旧 occurrence 周辺構造に依存
- `src/compose.js` は旧 registry 形状前提で merge しており、relations/perspectives の扱いが不完全
- `breakdown` は v0.1.3 から未完了のまま

### 3.4 describe / docs

- `src/describe.js` の contract version / vocabulary / checklist が `1.0.3` 固定
- `README.md` が v0.1.3 前提の strict-valid 例を載せている
- `package.json` の配布対象に `docs/dev/v0.2.0` が含まれていない

---

## 4. v0.2.0 のスコープ

### In Scope

1. Core v1.1.1 に合わせた parser / internal registry 再設計
2. `validate` の v1.1.1 structural validation 追従
3. `lint` の rule/profile 再定義
4. `extract` / `compose` / `breakdown` のコアモデル追従
5. `describe` / `README` / capabilities / guides の更新
6. v1.1.1 用 smoke / regression / golden test の整備

### Out of Scope

1. payload profile ごとの意味論検証
2. 外部 URI の到達確認
3. 大規模な merge semantic dedupe
4. v1.1.1 を超える新コマンド追加

---

## 5. 実装方針

### 方針 A: 後方互換は持たない

v0.2.0 では `v1.0.3` 系との後方互換は考慮せず、`v1.1.1` を唯一の正規仕様として扱います。

実施方針:

1. parse / validate / render / transform の内部前提を `v1.1.1` に一本化する
2. 旧 `anchorage` 中心設計、旧 occurrence 周辺項目、旧 registry 形状への追従コードは削除または置換する
3. `README` / guides / tests / examples も旧仕様ベースの記述を残さない

理由:

- 既存成果物が少なく、互換維持コストに対する効果が低い
- 旧仕様の吸収層を残すと、`extract/compose/diff/lint/describe` 全体の実装判断が複雑化する
- 今回の変更は局所修正ではなく、コアモデルの前提差し替えに近い

### 方針 B: validate を最初に直す

変換系より先に validate と parser を直し、以後の作業を v1.1.1 の正しい内部モデル上で進めます。  
変換系を先に触ると、旧前提のままロジックが増えて後で再修正になります。

---

## 6. 優先実装順

## Phase 0. 仕様固定と破壊的移行方針の明文化

目的:
- v0.2.0 が何を strict に見るかを固定する

作業:
1. v1.1.1 Core MUST / SHOULD / MAY をチェックリスト化
2. `v1.0.3` 非互換を明示し、移行対象外とする
3. internal canonical model を文書化

成果物:
- `docs/dev/v0.2.0/breaking-changes-policy.md`
- `docs/dev/v0.2.0/validation-checklist.md`

完了条件:
- validate/lint/transform の判断基準が共有される

## Phase 1. parser / internal model の更改

目的:
- v1.1.1 を自然に表現できる内部表現へ移す

作業:
1. `src/parser.js` の section 判定から `anchorage` 必須前提を除去
2. registry 初期値を `relations: {}` ベースへ見直す
3. `perspectives` / `relations` / entity payload を安定して読めるようにする
4. 旧 `v1.0.3` 特有の分類・補完ロジックを削除する
5. render 側も新しい registry 形状へ追従させる

対象:
- `src/parser.js`
- `src/render.js`
- 必要に応じて `src/utils.js`

完了条件:
- v1.1.1 最小文書を parse/render round-trip できる

## Phase 2. validate の v1.1.1 追従

目的:
- CLI の基礎検証を新 Core に合わせる

作業:
1. `entities / occurrences / sections` 必須を実装
2. `occurrence.entity` / `section.occurrences` / `relations.from/to` の参照整合を実装
3. `entity.payload` 必須と `body|ref|cache` 充足を実装
4. `payload.ref.uri` 必須を実装
5. `atomicity_basis` default / enum を扱う
6. `anchorage` と `perspectives` を optional として扱う
7. 旧 `structure.sections` 依存の厳格チェックを削除または縮退する
8. 旧仕様起因の validation code を整理し、不要ルールを削除する

対象:
- `src/validate.js`
- `src/diagnostics.js`
- `tests/internal/validate.test.js`

完了条件:
- v1.1.1 必須制約に対して false negative / false positive が目立たない

## Phase 3. lint の再設計

目的:
- Core validation 外の品質診断を lint に寄せる

作業:
1. 旧 `anchorage.domain` 依存 warning を削除する
2. payload format の SHOULD を warning 化
3. unreferenced entity / occurrence などの hygiene rule を整理
4. strict / diagnostic / minimal profile を再設計

対象:
- `src/lint.js`
- `src/describe.js`
- lint smoke / golden tests

完了条件:
- validate と lint の責務境界が明確になる

## Phase 4. transform commands の追従

目的:
- 新コアモデル上で extract / compose / breakdown を成立させる

作業:
1. `extract` の closure 計算を v1.1.1 参照モデルへ合わせる
2. `compose` で entities / occurrences / sections / relations / perspectives を統合する
3. `breakdown` を正式実装し、`copy/ref/hybrid` を提供する
4. lineage は `doc_id + section_id + operation=breakdown` を最低記録する
5. 旧仕様依存の closure / merge 前提を除去する
6. round-trip 回帰試験を追加する

対象:
- `src/extract.js`
- `src/compose.js`
- 新規 `src/breakdown.js` または extract の mode 拡張
- `tests/run-smoke-v0.2.0.js`

完了条件:
- split -> refine -> compose の最小 round-trip が通る

## Phase 5. diff / describe / docs 更新

目的:
- CLI の外部契約と説明を実装実態に一致させる

作業:
1. `describe capabilities` の contract version 更新
2. `describe checklist` と `vocab` を v1.1.1 に合わせる
3. `README.md` の最小サンプルを payload-based へ更新
4. diff の比較単位に `payload`, `perspective_scope`, `relations map` を反映
5. guides を `v1.1.1 + v0.2.0` 前提へ更新
6. 旧仕様の説明、例、コマンド契約の残骸を削除する

対象:
- `src/describe.js`
- `src/diff.js`
- `README.md`
- `docs/guides/ideamark/*`

完了条件:
- ユーザー向け説明と実装の不整合が解消される

## Phase 6. テスト / リリース準備

目的:
- v0.2.0 の回帰確認を自動化する

作業:
1. v1.1.1 最小正常系 fixture 追加
2. payload invalid / broken refs / duplicate ids の異常系追加
3. breakdown copy/ref/hybrid の golden 化
4. round-trip / diff / lint / validate の smoke を一本化
5. release note と breaking changes note を作成

対象:
- `tests/internal/*`
- `tests/run-smoke-v0.2.0.js`
- `docs/release/v0.2.0.md`

完了条件:
- `npm test` と v0.2.0 smoke が安定して再現できる

---

## 7. 優先度の結論

`handover-to-v0.2.md` では breakdown が最優先ですが、v1.1.1 対応を前提にすると実装順は次へ修正するのが妥当です。

1. parser / validate の Core 追従
2. lint の責務整理
3. breakdown 本実装
4. extract / compose round-trip 強化
5. diff 高精度化
6. describe ai-authoring / docs 更新

理由:
- Core model がずれたまま breakdown を進めると、来歴や payload の持ち方を二度直す可能性が高い

---

## 8. 主要リスク

1. `relations` の内部表現変更は parser / render / diff / compose に波及する
2. `payload.ref` と `payload.cache` の両立をどう render するかでフォーマット方針が必要
3. 旧仕様の前提がテストや docs に残ると、実装判断を誤らせる
4. guides / checklist だけ先に更新すると、実装との差分が再発する

---

## 9. Definition of Done

v0.2.0 を完了とみなす条件は次の通りです。

1. v1.1.1 最小文書が `validate --strict` を通る
2. `entity.payload` 系の制約違反を validate が検出できる
3. `extract / compose / breakdown` が v1.1.1 モデルで動作する
4. `describe` / `README` / release note が v0.2.0 実装と一致する
5. v0.2.0 用 smoke / internal test が通る

---

## 10. 最初の着手順

最初の 1 スプリントでは次だけに絞るのが妥当です。

1. `breaking-changes-policy.md` を作る
2. `src/parser.js` と `src/validate.js` を v1.1.1 最小対応にする
3. v1.1.1 最小 fixture と internal validate test を追加する

これが終われば、その後の `lint / breakdown / compose / diff` は同じ土台で進められます。
