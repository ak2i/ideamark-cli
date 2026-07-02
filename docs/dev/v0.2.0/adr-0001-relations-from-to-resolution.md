# ADR-0001: relations.from / relations.to の裸ID解決規則

日付: 2026-07-02
状態: 採用
関連: [issue #7](https://github.com/ak2i/ideamark-cli/issues/7)

## 背景

Core Spec v1.1.1 §6.2 は relations の from/to に entity_ref と section_ref の両方を許すが、裸のローカルID(例: `from: "X-1"`)がどちらの名前空間を指すかを決める規則が無かった。§7.5 の識別子一意性は名前空間ごとであり、entity と section が同じIDを持つ文書は合法なため、衝突時に参照先が非決定になる。また §7.4 の参照整合検査自体が、どの名前空間を探すかに依存する。

## 決定

次の規則を採用し、仕様文書(core-spec §6.3、core-constraints §7.4 / §7.15)に明記した。

1. **裸IDは引き続き許可する。** 解決順序は決定的に **entity 名前空間 → section 名前空間**。
2. **両名前空間にIDが存在する場合は ambiguous。** 実装は warning を出す(CLI: `relation_ref_ambiguous`)。error にはしない(§7.15 の error 一覧は不変)。
3. **著者は typed form(型を示す参照形)で曖昧性を解消できる。** CLI では `ideamark://docs/<doc>#/entities/<id>` / `#/sections/<id>`。
4. **canonical化(publish / format --canonical)は同じ解決順序で typed form に書き換える。** 公開文書からは曖昧さが消える。

## 却下した選択肢

- **和集合解決のみ(旧実装)**: 衝突時に非決定のまま通り、graph 構築や compose のリネーム伝播で型を確定できない。
- **明示型の必須化**: 決定的だが、既存文書に破壊的で記述コストが高い。軽量に書けることは authoring 上重要。
- **ID命名規約(prefix)**: §7.12 の語彙非統制と緊張関係にあり、規約違反文書の扱いという新たな曖昧さを生む。

## 影響箇所

- `src/validate.js`: relations 検査を entity→section の順に解決し、両方に存在する裸IDに `relation_ref_ambiguous` warning を追加
- `src/refs.js`: from/to の canonical化は従来から entity優先→section であり、本規則と一致(挙動変更なし)
- フィクスチャ / テスト: `tests/fixtures/v1.1.1/invalid/warn-ambiguous-relation-ref.ideamark.md` ほか

## 未決事項(スコープ外)

typed form の正規URI規約(`ideamark://docs/...` を Core に昇格させるか、doc_id の一意性担保を含む)は [issue #9](https://github.com/ak2i/ideamark-cli/issues/9) で別途扱う。本ADRは「typed form で曖昧性を解消できる」ことだけを規定する。

→ **ADR-0003 で解決**(2026-07-02): `ideamark://docs/{doc_id}#/{type}/{id}` を Core Spec §9.2 の正規形に昇格。
