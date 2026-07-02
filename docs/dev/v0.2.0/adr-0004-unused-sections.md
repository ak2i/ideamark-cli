# ADR-0004: §7.15「unused sections」の削除

日付: 2026-07-02
状態: 採用
関連: [issue #10](https://github.com/ak2i/ideamark-cli/issues/10)

## 背景

Core Constraints §7.15 は warning に「unused sections」を挙げていたが、v1.1.1 のモデルには section を「使う」側の要素が存在せず、定義不能だった。

- entity の unused は自明(entity を使うのは occurrence)だが、section は最上位の解釈単位であり、参照されて初めて意味を持つ要素ではない
- section を参照しうるのは relations の from/to のみで、「relations に現れない = unused」と定義すると relations を持たない普通の文書で全 section が警告される
- v1.0.x には `structure.sections`(文書構成リスト)があり「構成に載っていない section」という自然な解釈があったが、v1.1.1 Core から structure は意図的に落とされた

つまり v1.0.x の語彙が §7.15 に残った化石であり、実装間で解釈が割れることが確実だった。

## 決定

**§7.15 の Warnings 一覧から「unused sections」を削除する。**

- §7.15 に「実装は §7.17 の範囲で独自の hygiene warning を追加してよい(Core 一覧の外)」と明記
- CLI の `section_unused` warning は **実装拡張として現状の挙動を維持**: CLI 拡張の `structure.sections` リストが存在し、そこに載っていない section に warning。リストが無い文書では警告しない
- 位置づけのみ変更: 「Core §7.15 の項目」→「CLI 拡張(structure.sections 連動)の hygiene warning」

## 却下した選択肢

- **structure の Core 昇格**: 「構成に載らない section」で unused を厳密に定義できるが、v1.1.1 が意図的に落とした要素を warning のためだけに戻すのは本末転倒。最小制約の原則(§7.2)に逆行
- **tooling concern と注記して項目を残す**: 実装依存の項目が「実装粒度で規定する」はずの Core 一覧に残り続ける
- **relations 基準の定義**: 「relations が存在する場合のみ、どの relation からも参照されない section を警告」等の条件付き定義は複雑で、警告の意味が文書の他の部分に依存してしまう

## 影響箇所

- `docs/specs/V1.1.1/ideamark-core-constraints-v1.1.1.md` §7.15(1行削除+実装拡張の許容を明記)
- `src/validate.js` の `section_unused`: 挙動不変。コメント・メッセージの参照先を §7.15 から本 ADR へ変更
- `tests/fixtures/v1.1.1/invalid/warn-unused-section.ideamark.md`: 分類の記述を実装拡張に更新(warning であって error にしない、という回帰テストの役割は不変)
