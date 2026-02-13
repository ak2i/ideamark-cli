# CODEX Handoff – ideamark-cli v0.1.0 実装ブリーフ

この文書は、`ideamark-cli` を CODEX（または他の自動実装系）に実装させるための最小ブリーフ。

## 目的

- IdeaMark 文書（Markdown + fenced YAML）から Section を抽出し、selector でフィルタできること
- 複数セクションを順序付きで合成（compose）し、provenance を付与できること
- LLM 実行はせず、`describe` で「生成用プロンプト」を組み立てられること
- validate で最低限の破綻を検出できること

## 実装優先度（Must）

1. `ideamark extract sections`
2. `ideamark compose`
3. `ideamark describe`
4. `ideamark validate`

## 言語/実装メモ（推奨）

- 実装言語は問わないが、CLI の配布性が良い言語が望ましい（Node/Go/Rust/Python 等）
- YAML パーサは標準の安全なものを使用（fenced YAML ブロックのみ対象）
- v0.1.0 は「厳密な完全仕様」より「壊れにくい決め打ち」を優先

## パース仕様（決め打ち）

- **Document Header**: 最初に現れる fenced YAML のうち `ideamark_version: 1` を含むもの
- **Section YAML**: fenced YAML のうち `section_id:` を含むもの
- **Section body**: Section YAML 直後〜次の Section YAML 直前
- 文末の registry YAML（`sections:`/`structure:` 等）は v0.1.0 では本文に含めない（validateで読むのはOK）

## selector（v0.1.0）

- AND がデフォルト
- 同一キー複数指定は OR
- `domain~=a,b,c` は `anchorage.domain` のいずれかを含む

対応キー:
- view, phase, domain~=, doc_id, section_id, limit

## I/O フォーマット

- `--format md|json`
- md: セクション Markdown 片（または合成結果）
- json: `doc + sections[]`（extract）、`composed + provenance`（compose/describe）

## describe（LLMは呼ばない）

- built-in テンプレを `internal/goals/<goal>.md` から読み込む
- `{{COMPOSED_MATERIALS}}` を `compose --format md --with-provenance` 結果で置換
- `--format json` は `messages`（system/user）に変換

## validate（軽量）

- Document Header 必須キー存在
- registry の `structure.sections` が存在する section_id か
- 余力があれば ref 解決（warningでも可）

## 受入テスト（golden）

`examples/fixtures` の入力に対して、以下が一致すること:

- extract sections: selector ごとに期待 section が取れる
- compose: 期待順で連結され、provenance が付く
- describe: goal テンプレに Materials が差し込まれている
- validate: 壊れた fixture を非0で落とす（または警告レベルを分離）

## エッジケース

- YAML ブロックが壊れている
- Section YAML が連続して本文が空
- `anchorage` が欠けている（selector評価は「欠けたら不一致」扱い推奨）
- Windows 改行（CRLF）
- stdin 入力（`--input -`）

---
