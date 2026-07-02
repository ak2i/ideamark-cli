# ADR-0002: perspective_ref の解決規則

日付: 2026-07-02
状態: 採用
関連: [issue #8](https://github.com/ak2i/ideamark-cli/issues/8)、ADR-0001

## 背景

perspective_ref は `perspectives.{id}.base` / `sections.{id}.perspectives` / `entities.{id}.perspective_scope` の3箇所に現れるが、参照先が文書内 `perspectives` に限定されるのか、外部参照や自由文字列(タグ的用法)が許されるのかが未規定だった。Core Constraints §7.4 の参照整合の対象一覧に perspective_ref が含まれない一方、§7.5 は perspective_id の一意性を要求しており、この非対称が意図か漏れか判別できなかった。

## 決定

**§7.4 の除外は意図的な設計であると確定**し、次を仕様(core-spec §2.4 新設、core-constraints §7.4 / §7.15)に明記した。

1. 裸の perspective_ref は同一文書内の perspective に解決されることが **SHOULD**(MUSTではない)
2. 未解決の裸 perspective_ref は **error にしない**。実装は warning を出すことが SHOULD(CLI: `perspective_ref_unresolved`)
3. 外部参照形は Core validation の対象外(opaque)
4. 自由文字列のタグ的用法は結果として許容される(未解決 warning が出るだけで文書は有効)

根拠: Perspective は「意味の保証ではなく射影の手がかり」(core-spec §2.3 "Perspective does not guarantee future meaning outcomes")であり、構造参照(occurrence.entity 等)と同じ整合性を要求するのは位置づけに反する。検索層では perspective は絞り込みシグナルの一つであり、warning の有無に関係なく機能する(recall 重視の設計哲学と整合)。

## 却下した選択肢

- **§7.4 に追加して error 化**: 参照健全性は最も高いが、タグ的用法が全滅し、perspective 定義が authoring の義務になる。「手がかり」という位置づけと矛盾。
- **形式で区別(裸ID=error、自由記述は別フィールド)**: 厳密さと自由さを両立できるがスキーマ追加が必要で、v1.1.1 の Draft 改訂としては過大。

## 影響箇所

- `src/validate.js`: 従来の section.perspectives / entity.perspective_scope に加え、チェック漏れだった **perspectives.{id}.base** も同じ warning の対象に追加
- フィクスチャ: `tests/fixtures/v1.1.1/invalid/warn-unresolved-perspective-ref.ideamark.md`(3箇所すべての未解決ケース)

## 未決事項(スコープ外)

外部 perspective カタログ(組織共通語彙)を参照する正規URI規約は、entity 参照の規約と合わせて [issue #9](https://github.com/ak2i/ideamark-cli/issues/9) で扱う。
