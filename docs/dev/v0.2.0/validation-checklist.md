# Core Constraints §7 準拠チェックリスト(v0.2.0 / spec v1.1.1)

作成日: 2026-07-01
対象: `docs/specs/V1.1.1/ideamark-core-constraints-v1.1.1.md`

`src/validate.js` / `src/parser.js` の §7 監査結果。各項目の実装状況、診断コード、
対応テスト(`tests/internal/validate.test.js`, `tests/internal/validate-v111-corpus.test.js`,
フィクスチャは `tests/fixtures/v1.1.1/`)を示す。

## §7 対応表

| 仕様 | 実装 | 診断コード | 重大度 | テスト |
|---|---|---|---|---|
| §7.3/§7.14 entities/occurrences/sections 必須・非空 | ✅ | `entities_required` / `occurrences_required` / `sections_required` | strict: error / working: warning | validate.test.js |
| §7.4 occurrence.entity 参照整合 | ✅ | `entity_ref_invalid` | error | err-ref-occurrence-entity |
| §7.4 section.occurrences 参照整合 | ✅ | `occurrence_ref_invalid` | error | err-ref-section-occurrence |
| §7.4 relations.from / relations.to 参照整合 | ✅ | `relation_from_invalid` / `relation_to_invalid` / `relation_from_required` / `relation_to_required` | error | err-ref-relation-from / err-ref-relation-to |
| §7.5 識別子一意性(entity/occurrence/section/relation/perspective) | ✅ | `id_duplicate` | error | err-dup-* ×5 |
| §7.6 occurrence.entity / occurrence.role 必須 | ✅ | `occurrence_entity_required` / `occurrence_role_required` | error | err-missing-occurrence-* |
| §7.6 section.occurrences 非空配列必須 | ✅ | `section_occurrences_required` | error | err-empty-section-occurrences |
| §7.7 payload 必須 | ✅ | `payload_required` | error | err-missing-payload |
| §7.7 payload に body/ref/cache のいずれか必須(`payload: {}` 不正) | ✅ | `payload_content_required` | error | err-empty-payload |
| §7.7 有効な組み合わせ body / ref / cache / body+ref / ref+cache / body+ref+cache | ✅ | (診断なし) | — | valid/payload-* ×6 |
| §7.8 media_type SHOULD | ✅ | `payload_media_type_missing` | warning | warn-missing-media-type |
| §7.9 ref があれば ref.uri 必須(selector 任意) | ✅ | `payload_ref_uri_required` | error | err-ref-without-uri / valid/payload-ref-only |
| §7.10 cache.captured_at SHOULD | ✅ | `payload_captured_at_missing` | warning | warn-missing-captured-at |
| §7.11 atomicity_basis 省略時 default = interpretive | ✅ | (診断なし、`getAtomicityBasis()` で解決) | — | validate.test.js |
| §7.11 atomicity_basis enum 外の値 | ✅ | `atomicity_basis_unknown` | warning(§7.15 の error 一覧に無いため) | validate.test.js |
| §7.11 anchorage / perspective / discourse_frame 省略可 | ✅ | (旧 `anchorage_required` エラーを削除) | — | validate.test.js |
| §7.12 語彙非統制(kind/role/type/view/phase/profile) | ✅ 値の検証を一切行わない | — | — | valid/unknown-fields-profile |
| §7.13 多値フィールドの配列必須・単一値正規化 | ✅ parser で正規化、mapping は正規化不能のためエラー | `multi_value_field_invalid` | error | valid/normalization-single-values / validate.test.js |
| §7.14 relations / perspectives は空・欠落可 | ✅ | — | — | valid/minimal-body |
| §7.15 unused entities | ✅ | `entity_unused` | warning | warn-unused-entity |
| §7.15 unused sections | ⚠️ 「使用」の定義が仕様に無い。CLI 解釈: `structure.sections`(CLI 拡張の順序リスト)があり、そこに載っていない section を警告 | `section_unused` | warning | warn-unused-section(ambiguity issue 参照) |
| §7.16 payload 意味検証・profile 意味論・URI 到達性の禁止 | ✅ validate は payload.body の中身を一切解釈しない | — | — | valid/unknown-fields-profile |
| §7.18 未知フィールド無視・未知 profile で無効化しない | ✅ | — | — | valid/unknown-fields-profile |

## CLI レベル(Core §7 の範囲外)の検査

Core v1.1.1 は文書ヘッダを規定しないため、以下は CLI 契約としての検査:

- `yaml_parse_error` — YAML 破損(YAML 内の重複キーもここで検出される)
- `header_required` / `header_singleton` — 文書同一性(doc_id)の確保。strict では必須ヘッダフィールドも検査
- `section_ref_invalid` — `structure.sections`(CLI 拡張)内の迷子参照
- `relations_mapping_required` / `perspectives_mapping_required` — v1.1.1 の id キー付きマップ形の強制
- `perspective_ref_unresolved`(warning)— §7.4 の参照整合対象に perspective_ref が含まれないため error にしない(ambiguity issue 参照)
- `evidence_mapping` — Evidence Block(v0.1.2 CLI 拡張)
- `occurrence_unused`(warning)— §7.15 に無い実装警告(hygiene)

## v1.1.1 対応で削除した旧仕様チェック

- `anchorage_required` / `anchorage_mapping`(v1.0.x: anchorage 必須) → v1.1.1 では optional
- occurrence の `target` / `supporting_evidence` 参照検査(v1.0.x occurrence 周辺構造)
- lint `IM-LINT-104` の `anchorage.domain`(v1.0.x 語彙)依存 → view/phase の検索シグナル有無の警告に置換(語彙自体は非統制のまま)

## 外部参照の扱い(設計哲学 3・6)

`ideamark://docs/<doc>#/entities/<id>` 等で他文書の entity を参照する occurrence は
正常系であり、参照解決は行わない(opaque)。エンティティの名寄せ・sameAs 推論は
実装しない。回帰テスト: `valid/external-entity-reuse.ideamark.md`。
