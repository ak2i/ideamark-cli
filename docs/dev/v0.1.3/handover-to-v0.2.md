# v0.1.3 -> v0.2 引き継ぎ項目

## 目的

この文書は、v0.1.3 開発トラックで未完了の項目と、v0.2 系で優先して扱うべき実装課題を引き継ぐためのメモです。

作成日: 2026-03-04

---

## 1. 未完了タスク（v0.1.3 todo 由来）

1. `breakdown` 仕様の正式実装
- `copy/ref/hybrid` 3モードの本実装
- `refs.derived_from` への来歴記録（`doc_id + section_id + operation=breakdown`）
- ID 維持・再採番ルールの厳密化

2. `describe ai-authoring` の出し分け強化
- `--audience` / `--model` に連動したガイド本文差し替え
- ai-small / ai-large / human の出力整合テスト追加

3. リリース準備の最終整合
- README / release note / capabilities の最終照合
- examples の更新（lint / diff / describe ls / describe routing）

---

## 2. 既知制約（現状仕様）

1. `diff` は YAML-first の最小実装
- 正規化は最小限
- Markdown diff は `--scope all --include-markdown` 時の粗粒度比較

2. `lint` は non-blocking default
- default では error があっても exit 0
- gating は `--strict` 前提

3. round-trip は足場レベル
- split/extract -> refine -> compose の検証はあるが、merge ポリシーの完成版は未実装

---

## 3. v0.2 での優先実装順（推奨）

1. breakdown 本実装（copy/ref/hybrid + lineage 厳密化）
2. round-trip 回帰の強化（統合品質指標を追加）
3. diff 高精度化（ノイズ低減・path粒度改善・リスク推定精緻化）
4. ai-authoring の audience/model 出し分け
5. lint strict profile の拡張（追加強制ルール）

---

## 4. 追加テスト提案

1. breakdown 専用 fixtures
- copy/ref/hybrid ごとの期待出力固定

2. diff golden テスト
- add/remove/replace/move の固定ケースを golden 化

3. llm metrics の継続運用
- `tests/run-llm-metrics-v0.1.3.js` を v0.2 向けに拡張
- シナリオ数を増やし、比較ログ（前回比）を出力

---

## 5. 参照ファイル

- `docs/dev/v0.1.3/todo.md`
- `docs/dev/v0.1.3/IdeaMark-CLI-v0.1.3-dev-spec.ideamark.md`
- `docs/release/v0.1.3.md`
- `tests/run-smoke-v0.1.3.js`
- `tests/run-llm-metrics-v0.1.3.js`

