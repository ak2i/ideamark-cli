# TODO: 03-jp-disaster-whitepaper (PDF -> per-file IdeaMark -> compose)

目的:
- 複数PDFをマルチモーダルLLMに1本ずつ入力し、テンプレート準拠のIdeaMarkを個別生成する。
- 生成した複数IdeaMarkを `ideamark compose` で統合し、strict validate可能な統合文書を得る。

前提:
- PDF読取りは `ideamark` CLIの責務外（外部LLM/オーケストレータ責務）。
- プロンプト合成は `ideamark describe` 出力を機械的に合成して行う。
- テンプレート: `./sample-template.ideamark.template.md`

対象入力:
- `./r6_dai1bu1.pdf`
- `./r6_dai3bu.pdf`
- `./r6_tokushu2_1.pdf`

---

## 0. 設計固定
Status: In Progress

1. `reference_mode: auto` を採用する。
2. テンプレート準拠 + baseline参照マッピング（`refs.sources[]`, citation linkage）を併用する。
3. 分割生成時は `doc_id` を一意にする（例: `...part-001/002/003`）。

完了条件:
- 3PDF分の入力/出力命名規約とID規約を固定。

---

## 1. describe取得と機械的プロンプト合成
Status: Todo

実施:
1. `ideamark describe prompt-authoring --format json`
2. `ideamark describe ai-authoring --format json`
3. `ideamark describe checklist --format md`
4. `ideamark describe vocab --format md`
5. 上記とテンプレートを合成し、PDFごとの prompt を生成。

出力（予定）:
- `prompt.part-001.md`
- `prompt.part-002.md`
- `prompt.part-003.md`

完了条件:
- 各promptに以下が明記される:
  - strict必須ヘッダ
  - section-local ordering
  - YAML直後本文
  - reference_mode auto
  - explicit reference時の最小参照セット
  - template extension policy

---

## 2. PDFごとのIdeaMark生成（LLMマルチモーダル）
Status: Todo

実施:
1. PDFを1本ずつLLMへ入力し、対応promptで個別生成。
2. 各文書で `refs.sources[]` を対象PDF中心に設定。
3. 参照が明示される場合のみ `SEC-...-REFERENCES` / `OCC-REF-*` を生成。

出力（予定）:
- `doc.part-001.ideamark.md`
- `doc.part-002.ideamark.md`
- `doc.part-003.ideamark.md`

完了条件:
- 3文書とも `ideamark validate --mode strict` を通過。

---

## 3. 事前検証（個別）
Status: Todo

実施:
1. 各partを strict validate。
2. `ideamark ls --sections --occurrences --entities --vocab` で構造を確認。
3. ID重複の可能性を確認し、必要ならprefix修正。

完了条件:
- エラー/警告 0。
- 後段composeで衝突しないID体系を確認。

---

## 4. compose統合
Status: Todo

実施:
1. `ideamark compose doc.part-001.ideamark.md doc.part-002.ideamark.md doc.part-003.ideamark.md -o doc.composed.ideamark.md`
2. 統合後strict validate。
3. 必要なら `--doc-id` と `--inherit` 方針を固定して再compose。

完了条件:
- `doc.composed.ideamark.md` が strict validate通過。
- section/occurrence/entity 参照整合が維持される。

---

## 5. 差分/品質確認
Status: Todo

実施:
1. `ideamark diff` で part -> composed の構造差分を確認。
2. references/citationの欠落・重複を確認。
3. YAML-onlyになっていないかを目視確認。

完了条件:
- 参照構造が意図どおり（あるときは明示、ないときは省略）である。

---

## 6. 実行可否に関する結論
Status: Done

結論:
- `ideamark describe` の内容 + 機械的プロンプト合成で本テストは実現可能。
- ただし PDF読取り（OCR/レイアウト理解）は外部マルチモーダルLLM責務であり、CLI単体では完結しない。
- したがって「describeで規約供給」「外部で生成」「CLIで検証/統合」の3層分離で進める。
