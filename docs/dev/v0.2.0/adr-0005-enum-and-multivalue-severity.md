# ADR-0005: enum外のatomicity_basisと正規化不能な多値フィールドの重大度

日付: 2026-07-02
状態: 採用
関連: [issue #11](https://github.com/ak2i/ideamark-cli/issues/11)

## 背景

Core Constraints §7.15 の error/warning 一覧に、実装で遭遇する2つの逸脱ケースが載っていなかった。

1. **atomicity_basis に enum 外の値**(例: `atomicity_basis: "creative"`)
   §7.11 は `interpretive | lexical | structural` の enum を定義し、§7.12 の非統制語彙リストに atomicity_basis は含まれない(=統制対象)。しかし逸脱時の重大度が未規定
2. **多値フィールドに正規化不能な値**(例: `anchorage.view: { nested: true }`)
   §7.13 は「配列必須、単一値は単一要素配列に正規化」と言うが、mapping は正規化できない。error / warning / 無視(§7.18)のいずれかが未規定

## 決定

**現行CLIの区分を仕様に明文化する。**

| ケース | 重大度 | CLI 診断コード |
|---|---|---|
| enum 外の atomicity_basis | **warning**(値は保存、Coreは意味を与えない) | `atomicity_basis_unknown` |
| 正規化不能な多値フィールド | **error** | `multi_value_field_invalid` |

判断原則として §7.15 冒頭に次を明記した:

> Errors protect structural processability; warnings flag deviations in interpretive metadata.
> (error は構造の処理可能性を守るためのもの、warning は解釈系メタデータの逸脱を知らせるもの)

- atomicity_basis の逸脱は構造の処理可能性を壊さない(ツールは「Coreが解釈しない著者拡張値」として扱える)→ warning。値は §7.17 の traceability に従い保存する
- 多値フィールドの mapping は、view/phase/perspectives を配列として走査する全消費側(検索層を含む)を壊す → §7.2「processability に必要な制約は強制する」に該当し error
- なお §7.18(未知フィールドの無視)は「未知**フィールド**」の規定であり、既知フィールドの不正な形には適用しない

この原則は ADR-0001(曖昧参照=warning)・ADR-0002(未解決perspective_ref=warning)の判断とも一貫する。

## 却下した選択肢

- **両方 error**: atomicity_basis の typo で文書全体が invalid になるのは、最小制約の原則(§7.2)と不釣り合い
- **両方 warning**: mapping 値の多値フィールドを消費側がどう読むかが未定義のまま残り、§7.13 の「MUST be arrays」と矛盾する

## 影響箇所

- `docs/specs/V1.1.1/ideamark-core-constraints-v1.1.1.md`: §7.11(enum と warning の明記)、§7.13(正規化不能は error)、§7.15(両項目を一覧に追加+判断原則の明文化)
- `src/validate.js`: 挙動変更なし(現行実装が仕様になった)
- フィクスチャ: `invalid/warn-unknown-atomicity-basis.ideamark.md` / `invalid/err-multi-value-mapping.ideamark.md` を追加(従来は inline テストのみだった2ケースをコーパスに昇格)
