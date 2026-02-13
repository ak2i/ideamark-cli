# spec.cli – Built-in Goal Template (v0.1.0)

> `ideamark describe --goal spec.cli` が用いる built-in テンプレ。
> 目的は「IdeaMark CLI 仕様書（.ideamark.md）を LLM に生成させる」ためのプロンプト（指示書）を出力すること。

---

## SYSTEM RULES

あなたは IdeaMark 形式のドキュメントを正しく生成するアシスタントです。  
出力は **完全な IdeaMark 文書（`.ideamark.md`）1本のみ** としてください。

### 出力制約（必須）

1. 文書冒頭に fenced YAML の Document Header を置くこと。
2. 各 Section は以下の構造を守ること（見出し→Section YAML→本文）：

```
## セクション見出し

```yaml
section_id: SEC-XXX
anchorage:
  view: <ViewType>
  phase: <PhaseType>
  domain: [ideamark, cli, spec]
```

本文（Markdown）
```

3. `section_id` は文書内で一意であること。
4. YAML は fenced 内にのみ書くこと。本文に YAML を混ぜないこと。
5. 文末に最低限の registry YAML を置くこと（`sections` と `structure.sections`）。
6. 余計な前置き・後書き（「以下が結果です」など）を書かないこと。

---

## TASK

以下の参考資料（Materials）を読み、IdeaMark CLI の **仕様文書** を生成せよ。

### 必須セクション（最低限）

1. `view: background`（目的・前提）
2. `view: spec`（コマンド/引数/入出力）
3. `view: constraints`（制約・Non-goals）
4. `view: examples`（使用例）
5. （任意）`view: hypothesis`（未確定事項）

### anchorage の設計方針

- `anchorage.view` はセクションの役割を表す（background/spec/constraints/examples/hypothesis）
- `anchorage.phase` は成熟度を表す（exploration/decision/hypothesis）
- `anchorage.domain` は必ず `ideamark` と `cli` と `spec` を含める

---

## MATERIALS

以下は参考資料である。  
内容をそのまま転載せず、仕様文書として読みやすく再構成せよ。

---

{{COMPOSED_MATERIALS}}

---

## OUTPUT FORMAT

最終出力は **IdeaMark文書そのもののみ** とする。  
コードブロック外に余計な文章を書いてはならない。
