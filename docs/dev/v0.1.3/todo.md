# v0.1.3 実装 Todo（初版）

対象: `IdeaMark-CLI-v0.1.3-dev-spec.ideamark.md` と `docs/specs/v1.0.3/*` 準拠の改修計画  
方針: `describe` 契約整合を先に固め、次に guides / breakdown / validate 最小要件を実装し、最後に lint/diff と回帰テストを追加する。

---

## 0. 参照仕様の固定と差分基線作成
Status: In Progress

目的: v0.1.3 の作業対象と非対象を固定し、途中で仕様解釈がぶれない状態にする。  
参照:
- `docs/dev/v0.1.3/IdeaMark-CLI-v0.1.3-dev-spec.ideamark.md`
- `docs/specs/v1.0.3/doc-cli-contract_v1.0.3.md`
- `docs/specs/v1.0.3/doc-cli-contract_v1.0.3_*.md`

詳細設計:
1. v0.1.3 Scope / Non-goals を実装タスクへ写像する（merge正式実装は除外）。
2. MUST/SHOULD を `describe/validate/capabilities` 単位で一覧化する。
3. v0.1.2 実装との差分観点（I/F, topics, diagnostics）をチェックリスト化する。

完了条件:
1. 本 Todo の各章に参照仕様と完了条件が紐づく。
2. Non-goals が明文化され、実装対象に混入しない。

---

## 1. describe I/F の直交化（audience/lang/model + profile 正規化）
Status: Done

目的: `describe` を v0.1.3 の正規I/Fへ寄せ、呼び出し側が意図分解しやすい形にする。  
対象: `describe` 実装、CLI引数解釈層

詳細設計:
1. `--audience human|ai`, `--lang ja|en`, `--model small|large` を追加。
2. profile 指定は内部で直交I/Fへ正規化する。
3. `--format json` の既定を `audience=ai, model=small` に合わせる。
4. `--format md` の既定を `audience=human, lang=ja` に合わせる。
5. `--model` は `audience=ai` 以外で無効化または無視方針を統一する。

完了条件:
1. 直交I/Fで `describe` 出力が分岐する。
2. profile 指定と直交指定の結果が矛盾しない。
実装メモ (2026-03-04):
1. `describe` に `--audience/--lang/--model/--profile` を追加。
2. `format=json` 時の既定を `audience=ai, model=small`、`format=md` 時の既定を `audience=human, lang=ja-JP` とした。
3. `audience=human` で `--model` 指定時は usage error (exit 2) とした。

---

## 2. describe トピック拡張（ls / routing）
Status: Done

目的: Doc CLI Contract v1.0.3 の SHOULD topic を実装し、探索性を上げる。  
対象: `describe ls`, `describe routing`, capabilities 宣言

詳細設計:
1. `describe ls --target guides` を実装（物理パス非公開）。
2. `describe routing` を実装（適用領域 / 非適用領域 / 補完ツールの説明）。
3. ルーティング選択軸（view/domain/role 等）を機械可読に出力する。
4. ja-JP / en-US ガイドの在庫を discovery 出力へ反映する。

完了条件:
1. `describe capabilities` に `ls` / `routing` が宣言される。
2. `describe ls` と `describe routing` がサンプルガイドを基に一貫した情報を返す。
実装メモ (2026-03-04):
1. `describe ls --target guides` を実装（出力に物理パスは含めない）。
2. `describe routing` を実装し、内蔵 guides サンプルから routing セクションを抽出して応答。
3. `--lang ja|en|ja-JP|en-US` で ja/en のガイド切替に対応。

---

## 3. guides 再設計（ai-small / ai-large / human）
Status: In Progress

目的: v0.1.3 方針に沿って、LLMサイズ別に迷いにくいガイドを提供する。  
対象: guides テンプレート、`describe ai-authoring` 出力

詳細設計:
1. ai-small 向けに固定手順（generate→validate→breakdown(copy)）を定義。
2. ai-large 向けに `PLAN/AUTHOR/VALIDATE/TRANSFORM` と Decision Points を定義。
3. human 向け md（easy/advanced）の構成を調整。
4. `minimal_validation`, `forbidden_patterns`, `followup_topics` をガイド構造へ含める。
5. `describe ai-authoring --format md|json` を契約構造へ整合させる。

完了条件:
1. ai-small / ai-large で期待挙動が分離される。
2. `describe ai-authoring` が v1.0.3 契約に準拠する。
進捗メモ (2026-03-04):
1. `docs/guides/ideamark/ai-authoring.{md,json}` を更新し、ai-small 固定手順・ai-large フレームワーク・routing hints を追加。
2. `minimal_validation` / `forbidden_patterns` / `followup_topics` を JSON に追加。
3. 残課題: `describe ai-authoring` の audience/model 連動出し分け。

---

## 4. breakdown 仕様実装（copy/ref/hybrid）
Status: Todo

目的: Section分割の正式仕様を実装し、来歴・再統合前提を満たす。  
対象: extract/breakdown 系処理

詳細設計:
1. `copy/ref/hybrid` の3モードを実装する（既定: copy）。
2. `refs.derived_from` に `doc_id + section_id + operation=breakdown` を記録する。
3. copy モードで既存 entity ID を維持する。
4. 新規 entity 生成時は新ID採番ルールを適用する。
5. round-trip 前提（split→refine→merge）を壊さないデータ保持を確認する。

完了条件:
1. 3モードの出力差が仕様通り。
2. 来歴情報と参照整合が維持される。

---

## 5. minimal validation 実装
Status: Todo

目的: v0.1.3 最低検証ラインを `validate` / guides 手順に反映する。  
対象: validate エンジン

詳細設計:
1. `header_singleton`
2. `yaml_parseable`
3. `id_unique_within_doc`
4. `references_resolvable`

完了条件:
1. 正常入力で false positive がない。
2. 意図的破壊入力で再現性のある diagnostic が出る。

---

## 6. lint 実装（diagnostic / non-blocking default）
Status: Todo

目的: v0.1.3 追加要素として lint を診断ツール化する。  
対象: `ideamark lint`

詳細設計:
1. CLI: `ideamark lint <file> [--format ndjson|json|md] [--strict] [--profile <name>]`
2. 既定は non-blocking（`--strict` なしは exit 0）。
3. NDJSON は `meta/diagnostic/summary` の validate 同型レコードで出力。
4. 必須ルール: IM-LINT-001..004（最低検証ライン）。
5. 推奨ルール: IM-LINT-101..104（warning中心）。
6. `--profile minimal|diagnostic|strict` を宣言と実装で一致させる。

完了条件:
1. `lint --strict` のみ error で exit 1。
2. NDJSON レコード順・型が契約どおり。

---

## 7. diff 実装（YAML-first / 構造差分）
Status: Todo

目的: 変更レビューと回帰確認のための構造diffを提供する。  
対象: `ideamark diff`

詳細設計:
1. CLI: `ideamark diff <from> <to> [--format ndjson|json|md] [--scope yaml|all] [--include-markdown]`
2. 既定 `--scope yaml` とし、Registry/参照中心に比較する。
3. 単位: Entities/Occurrences/Sections/Relations/Structure の add/remove/replace/move。
4. 正規化: YAMLキー順・空白差分を無視、timestamp系は既定除外（`--include-meta`で追加）。
5. NDJSON（またはJSON）で `op/path/before/after/summary` を出力。

完了条件:
1. 期待差分のみが出力される（ノイズ抑制）。
2. 参照破断リスクが `summary` または補助フィールドで判別できる。

---

## 8. describe capabilities 更新（lint/diff/routing/languages）
Status: In Progress

目的: 実装機能を `describe capabilities` へ過不足なく宣言する。  
対象: capabilities JSON/MD 生成

詳細設計:
1. `doc-cli-contract_v1.0.3_capabilities-schema.md` 準拠の JSON を出力。
2. `doc-cli-contract_v1.0.3_capabilities-md-template.md` 準拠の MD を出力。
3. `commands` に `describe/validate` に加え `lint/diff`（実装時）を宣言。
4. `features.routing` と `features.languages` を v1.0.3 拡張として宣言。
5. 未対応項目は `Not supported` を明示する。

完了条件:
1. capabilities JSON/MD の内容が実装実態と一致する。
2. 呼び出し側が formats/options/topics を機械的に判断できる。
進捗メモ (2026-03-04):
1. contract version を `1.0.3` へ更新。
2. `features.routing` / `features.languages` を追加。
3. `commands.describe.topics` に `ls` / `routing` を追加。
4. `lint` / `diff` 宣言はコマンド実装時に追加予定。

---

## 9. スモークテスト自動化（lint/diff/validate）
Status: Todo

目的: v0.1.3 の最低回帰ラインを自動で確認できる状態にする。  
対象: テストスクリプト、フィクスチャ

詳細設計:
1. lint 正常系: error=0 を確認。
2. lint 異常系: `--strict` で exit 1 を確認。
3. diff 正常系: add/remove/replace が期待どおりに出ることを確認。
4. validate 最低検証（4項目）の正常/異常ケースを固定化。
5. NDJSON パース試験（meta先頭・summary末尾）を追加。

完了条件:
1. CI相当手順でスモーク一式が再現可能。
2. 失敗時に原因切り分け可能な粒度でログが出る。

---

## 10. LLMテストモデル整備（guides品質回帰）
Status: Todo

目的: guides 変更が実運用品質を下げないことを定量監視する。  
対象: テストシナリオと計測項目

詳細設計:
1. 指標: YAML parse 成功率 / ID一意率 / 自己修正率 / 再試行回数 / round-trip整合率。
2. 最低シナリオ: 長文生成→breakdown(copy)→精緻化→統合→extract。
3. 小型/大型モデル双方で同一評価軸を適用する。
4. ガイド改訂時に比較可能なログ形式を固定する。

完了条件:
1. 指標収集手順が自動化される。
2. guides変更前後の比較が可能になる。

---

## 11. ドキュメント反映とリリース準備
Status: Todo

目的: 実装と仕様書の乖離をなくして v0.1.3 開発版を締める。  
対象: docs/dev と docs/specs の整合

詳細設計:
1. 実装済み項目を dev spec の実装計画と照合し、状態を更新。
2. CLIヘルプ / examples / README類の `describe|validate|lint|diff` 記述を揃える。
3. 既知制約（non-goals / 未実装）を明記する。

完了条件:
1. 実装・テスト・文書の三者が矛盾しない。
2. 次バージョン（v0.2系）の引き継ぎ項目が残せる。
