# v0.1.2 実装変更 Todo（詳細設計）

対象: doc-cli-contract_v1.0.2 準拠のための改修計画  
方針: 先に `describe capabilities` と `describe` の既定挙動を整え、その後 `--version` を追加する。

---

## 0. docs_dev_v1.0.2 シリーズ（開発仕様の整合）
Status: Done

目的: v1.0.2 仕様変更に関する開発資料の順序と依存関係を明確化する。  
順序: `spec-change` → `evidence-annotations` → `evidence-block-normative` → `anchorage` → `specs` 反映

詳細設計:
1. `docs_dev_v1.0.2_spec-change_evidence-block.md` を基準に v1.0.2 変更点を確定する。  
2. `docs_dev_v1.0.2_evidence-annotations.md` で推奨スキーマと CLI 影響を詰める。  
3. `docs_dev_v1.0.2_evidence-block-normative.md` に最小要件を切り出し、参照整合を取る。  
4. `docs_dev_v1.0.2_anchorage.md` を Section 付与の前提で整理し、語彙非固定方針を明記する。  
5. `docs/specs/v1.0.2/ideamark-yaml-spec-v1.0.2.md` に Evidence/Anchorage の反映と整合確認を行う。

完了条件:
1. 4本の docs_dev 文書が互いに矛盾なく参照整合している。  
2. specs 側の Evidence/Anchorage 記述と矛盾しない。

---

## 1. describe 既定フォーマット統一（md）
Status: Done

目的: `describe` の既定 `--format` を `md` に統一し、契約（MUST）に合わせる。  
対象: `ideamark-cli/bin/ideamark.js`

詳細設計:
1. `describe` のデフォルト `format` を常に `md` にする。  
2. `params` も `md` を既定にする。  
3. 互換性のため `--format json|yaml|md` は引き続き受け付ける。  
4. 既存の `params` テンプレは `md` を優先し、`json` は `--format json` 指定時のみ出力。

完了条件:
1. `ideamark describe params` が `md` 出力になる。  
2. `ideamark describe params --format json` は従来の JSON を出力する。

---

## 2. describe capabilities --format json のスキーマ準拠
Status: Done

目的: `doc-cli-contract_v1.0.2_capabilities-schema.md` 準拠の JSON を出力する。  
対象: `ideamark-cli/src/describe.js`

詳細設計:
1. `CAPABILITIES` をスキーマ構造に変更。  
2. `contract.name = "doc-cli-contract"` と `contract.version = "1.0.2"` を追加。  
3. `tool.name = "ideamark-cli"` と `tool.version = package.json` の `version` を設定。  
4. `commands.describe` と `commands.validate` の `formats/topics/stdin/description` を追加。  
5. `commands.validate.options` に `--strict`, `--mode`, `--fail-on-warn` を宣言。  
6. `commands.describe.formats` に `md|json|yaml` を宣言。  
7. `features.evidence` は現状非対応のため、未記載（または Not supported を md で明示）。

完了条件:
1. `describe capabilities --format json` がスキーマ準拠になる。  
2. 既存の `commands` 配列出力は廃止。

---

## 3. describe capabilities --format md のテンプレ準拠
Status: Done

目的: `doc-cli-contract_v1.0.2_capabilities-md-template.md` に準拠した Markdown を出力する。  
対象: `ideamark-cli/src/describe.js`

詳細設計:
1. テンプレに合わせた Markdown 出力を新規実装。  
2. `Summary`, `Commands`, `Evidence`, `Compatibility Notes` の各セクションを出力。  
3. `describe` / `validate` / 他コマンドは tool 実装に合わせて記述。  
4. `formats` と `inputs` は実装に合わせて明記（stdin 対応も含む）。  
5. `validate` の diagnostic/severity 仕様は validate contract と一致する説明にする。  
6. `Not supported` を明示する（対応していないオプション・機能）。

完了条件:
1. `describe capabilities --format md` がテンプレ準拠になる。  
2. `Machine-readable capabilities` の参照が記載される。

---

## 4. --version --format json の追加（SHOULD）
Status: Done

目的: `--version --format json` を実装し、契約の SHOULD を満たす。  
対象: `ideamark-cli/bin/ideamark.js`

詳細設計:
1. `--version` に `--format json` を追加。  
2. JSON 出力に `tool.version`, `contract.version`, `document_spec.version` を含める。  
3. `document_spec.version` は `ideamark-yaml-spec-v1.0.2` に合わせる（固定値で可）。

完了条件:
1. `ideamark --version` は従来通り文字列を出力。  
2. `ideamark --version --format json` が JSON を出力する。

---

## 5. describe capabilities / contract 整合の検証
Status: Done

目的: contract と describe の出力が矛盾しないことを確認する。  
対象: 仕様確認（実装後）

詳細設計:
1. `doc-cli-contract_v1.0.2.md` の MUST と `describe capabilities` の出力を照合。  
2. `validate` の `--format` 対応状況を `capabilities` に反映。  
3. `describe` の default `md` が実装と一致していることを確認。

完了条件:
1. 明確な不一致がない状態で `v0.1.2` の実装作業に入れる。

---

## 6. describe params / ai-authoring の契約差分確認
Status: Done

目的: 新しい describe 仕様と ideamark テンプレの差分を洗い出す。  
対象: `docs/guides/ideamark/params.md`, `params.json`, `ai-authoring.md`

詳細設計:
1. `describe params` の JSON 仕様に合わせて `params.json` の構造を変更するか判断。  
2. `describe params` の MD 仕様に合わせて `params.md` を拡充するか判断。  
3. `describe ai-authoring` の JSON 仕様のために JSON 版を追加するか判断。  
4. `describe ai-authoring` の MD 仕様（principles / checklist）に合わせて `ai-authoring.md` を調整。  
5. `describe` 実装が template から出力する場合のフォーマット対応（json/md）を整理する。

完了条件:
1. 変更対象ファイルと変更方針が確定している。  
2. contract 仕様と ideamark 側テンプレが矛盾しない。

---

## 7. describe 実装で ai-authoring json を参照できるようにする
Status: Done

目的: `describe ai-authoring --format json` をテンプレ参照で提供できるようにする。  
対象: `ideamark-cli/src/describe.js`

詳細設計:
1. `TEMPLATE_MAP` に `ai-authoring: { json: "ai-authoring.json", md: "ai-authoring.md" }` を追加。  
2. `FORMAT_FALLBACKS` はそのまま利用し、json 指定時は json を優先。  
3. 既存の `ai-authoring.md` 出力は維持する。

完了条件:
1. `ideamark describe ai-authoring --format json` で JSON が返る。  
2. `ideamark describe ai-authoring` は引き続き md を返す。

---

## サマライズ（変更点まとめ）

- docs/dev/v0.1.2 の `docs_dev_v1.0.2_*` 文書の Draft 表記を削除し、参照パスを実体に合わせて整合。
- anchorage 方針を Section 付与に明確化し、語彙は推奨セット・未知語彙許容を spec に反映。
- Evidence Block の最小要件を dev/spec で整合（識別子・mapping 必須・未知キー許容・配置任意）。
- `describe` 既定フォーマットを `md` に統一し、`--version --format json` を追加。
- `describe capabilities` の JSON/MD を v1.0.2 契約に準拠させ、topics に `checklist`/`vocab` を追加。
- `describe ai-authoring --format json` をテンプレ参照で有効化。
- `params.json` / `ai-authoring.json` の `tool.version` を `0.1.2` に更新。
