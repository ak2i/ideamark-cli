# ADR-0003: doc_id モデルと外部参照の正規形

日付: 2026-07-02
状態: 採用
関連: [issue #9](https://github.com/ak2i/ideamark-cli/issues/9)、ADR-0001、ADR-0002

## 背景

「同じentity IDで参照すれば同一Entity」(設計哲学3)と「利用ログの再帰蓄積」(哲学6)の基盤となる文書間参照の規約が仕様に無かった。v1.1.1 Core は文書ヘッダ(doc_id)を定義せず、CLI の `ideamark://docs/<doc_id>#/entities/<id>` は v1.0.x 由来のツール拡張のままだった。ADR-0001(typed form の正規規約)と ADR-0002(外部 perspective カタログの参照形)の宿題もここに合流していた。

### doc_id の3つの役割(コード上の棚卸し)

1. **自己同定** — `parseRef(ref, docId)` が「参照中の doc_id が自文書と一致するか」で local/external を判定する
2. **参照の名前空間** — `canonicalUri()` が文書内の全ローカル参照に doc_id を焼き込む(publish / format --canonical)
3. **来歴の記録** — extract / compose が派生文書の `header.refs.sources` に元文書の doc_id を記録する

役割2により、**doc_id を後から変更すると自文書内の canonical 参照も外部からの被参照も全て壊れる**。これがローカル→グローバル昇格シナリオの核心的制約。

## 決定

### 1. doc_id モデル(Core Spec §9.1)

- **opaque な文字列**: Core は内部構造を規定しない。人間可読名(`DOC-1`)、UUID、authority 付きパスのいずれも参照構文上は等価
- **一意性のスコープは解決文脈(コーパス/レジストリ)**: 担保はコーパス運用者・レジストリの責務であり、Core validation は関与しない
- **生成時から不変(immutable)**: 昇格時にIDを変えない。これによりローカルで作られた文書がIDを保ったままグローバルに登録でき、「ローカル/グローバルの柔軟な両対応」が成立する
- 公開・グローバル登録を意図する文書には衝突耐性ID(UUID等)を **SHOULD** で推奨
- 表示名は doc_id ではなく他フィールド(title 等)で持つ(IDと表示名の分離)

### 2. 外部参照の正規形(Core Spec §9.2)

```
ideamark://docs/{doc_id}#/{entities|occurrences|sections|perspectives}/{element_id}
```

を Core の正規形に昇格。短縮形 `{doc_id}#{element_id}` は MAY(型情報なし)。

### 3. 同一性判定(Core Spec §9.2、Core Model §3.6)

要素の同一性は **(doc_id, element_id) ペアの文字列完全一致のみ**。URI 正規化なし、sameAs 的同値推論なし。「同一性は著者が参照によって宣言するものであり、ツールが推論するものではない」を規範化(anti-owl:sameAs の割り切りの言語化)。

### 4. 解決は Core の外(Core Spec §9.3)

doc_id → 文書実体の解決はローカル索引・グローバルレジストリいずれも tooling concern。同じ参照構文に対する異なるリゾルバとして扱い、文書は書き換えなしに文脈間を移動できる。外部参照は validation に opaque(§7.16 と整合)。他 URI スキームの出現は許容するが §9.2 の同一性判定の対象外。

## 却下した選択肢

- **任意URI(https等)の正規化**: URI 等価性(大文字小文字・末尾スラッシュ・%エンコード)の泥沼と、到達可能であるべきという期待を生み §7.16 と緊張
- **aliasマップ(旧ID→新ID)の仕様化**: 昇格時のID付け替えを救済できるが、sameAs 的複雑さの入り口。不変原則で発生源を断つ方が哲学と整合
- **UUID/ULID の必須化**: グローバル一意性は機械的に担保されるが、人間可読な doc_id が全滅し既存文書・サンプルに破壊的
- **発行機関・登録制**: 「著者の宣言」哲学に対して過重

## 影響箇所

- `src/validate.js` / `src/refs.js` の parseRef・canonicalUri は既に §9 に準拠(v1.0.x 拡張の昇格のため挙動変更なし)
- `src/refs.js`: perspective 参照(section.perspectives / entity.perspective_scope / perspective.base)の canonical化を entities/occurrences/sections と同等に追加
- フィクスチャ: `valid/external-shorthand-ref.ideamark.md`(短縮形外部参照)、既存 `valid/external-entity-reuse.ideamark.md`(完全形)

## 運用ノート

- extract / compose が生成する文書は従来どおり UUID の doc_id を持つ(§9.1 の SHOULD に適合)
- 手書きのローカル文書は人間可読IDでよいが、公開する可能性があるなら最初から衝突耐性IDを使う(後からの付け替えはアンチパターン)
