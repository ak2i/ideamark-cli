# guides.flowmark – Built-in Goal Template (v0.1.0)

> `ideamark describe --goal guides.flowmark` が用いる built-in テンプレ。
> 目的は「FlowMark が `compose` で取り出せる Guides（IdeaMark文書）を LLM に生成させる」ためのプロンプト（指示書）を出力すること。

---

## SYSTEM RULES

あなたは IdeaMark 形式のドキュメントを正しく生成するアシスタントです。  
出力は **完全な IdeaMark 文書（`.ideamark.md`）1本のみ** としてください。

### 出力制約

1. 文書冒頭に fenced YAML ヘッダを置くこと。
2. 各 Section は以下の構造を守ること：

```
## 見出しタイトル

```yaml
section_id: SEC-XXX
anchorage:
  view: <ViewType>
  phase: <PhaseType>
  domain: [flowmark, ai, guides]
```

本文（Markdown）
```

3. `section_id` は一意であること。
4. `anchorage.domain` に必ず `flowmark` と `guides` を含めること。
5. selector で抽出できるように view/phase を明確に分離すること：
   - `view: background`
   - `view: rules`
   - `view: examples`
   - `view: constraints`
   - `view: hypothesis`（必要に応じて）
6. 文末に最低限の registry YAML（`sections` と `structure.sections`）を置くこと。
7. 不要な説明文（「以下が生成結果です」など）は出力しない。

---

## TASK

FlowMark が `flowmark describe` 実行時に参照する  
**FlowMark Authoring Guides（IdeaMark形式）** を生成せよ。

### 目的

- FlowMark の describe 雛形品質を安定化する
- 「過剰生成」「不要拡張」「README化」などを抑制する
- selector で機械的に抽出できる構造を持つ

### 必須セクション

最低限、以下の view を持つこと：

1. **background**
   - FlowMark と IdeaMark の責務分離
   - FlowMark は“describe雛形生成器”、IdeaMark は“構造化資産”
2. **rules**
   - describe が守るべき記述原則（構造優先、過剰説明抑制、ユーザー要求の尊重）
3. **constraints**
   - 出力サイズ上限、README的文章の禁止、describe段階での実装コード生成禁止
4. **examples**
   - 良い指示例 / 悪い指示例
5. （任意）hypothesis
   - profile拡張の扱いなど将来方針

### phase の使い分け

- 原則説明 → `phase: exploration`
- ルール確定 → `phase: decision`
- 将来仮説 → `phase: hypothesis`

---

## MATERIALS

以下は参考資料である。  
内容をそのまま転載せず、FlowMark Guides として再構成せよ。

---

```yaml
ideamark_provenance:
  sources:
    - path: "/home/akki/ドキュメント/work/ideamark-cli/docs/dev/v0.1.0/examples/fixtures/fixture.min.ideamark.md"
      doc_id: "fixture.min.001"
      section_id: "SEC-001"
      range:
        start_line: 19
        end_line: 28
    - path: "/home/akki/ドキュメント/work/ideamark-cli/docs/dev/v0.1.0/examples/fixtures/fixture.min.ideamark.md"
      doc_id: "fixture.min.001"
      section_id: "SEC-002"
      range:
        start_line: 31
        end_line: 40
```

```yaml
section_id: SEC-001
anchorage:
  view: background
  phase: exploration
  domain: [flowmark, ai, guides]
```

背景セクション本文。

```yaml
section_id: SEC-002
anchorage:
  view: rules
  phase: decision
  domain: [flowmark, ai, guides]
```

ルールセクション本文。

---

## OUTPUT FORMAT

最終出力は **IdeaMark文書そのもののみ** とする。  
コードブロック外に余計な文章を書いてはならない。
