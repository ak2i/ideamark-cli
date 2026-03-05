# 02 USGS Volcano Monitoring Sample

このディレクトリは、USGS SIR 2024-5062 Chapter I を IdeaMark v1.0.3 へ変換したサンプル一式です。

- Source: `./usgs_sir_2024_5062_volcano_monitoring_capabilities.md`
- Prompt: `./usgs_sir_2024_5062_volcano_monitoring_capabilities.prompt.md`
- Output: `./usgs_sir_2024_5062_volcano_monitoring_capabilities.ideamark.md`

## 手順

1. `describe` で生成規約を取得する。

```bash
ideamark describe prompt-authoring --format md
ideamark describe ai-authoring --format md
ideamark describe checklist --format md
ideamark describe vocab --format md
```

2. 規約を反映したプロンプトを作る。
- strict必須ヘッダ
- 参照整合
- 並び順: `section -> section所属occurrences -> 次section`
- YAML直後の自然言語本文

3. プロンプトに沿って IdeaMark 文書を生成する。

4. strict validate で検証する。

```bash
ideamark validate ./usgs_sir_2024_5062_volcano_monitoring_capabilities.ideamark.md --mode strict
```

5. 必要に応じて構造一覧を確認する。

```bash
ideamark ls ./usgs_sir_2024_5062_volcano_monitoring_capabilities.ideamark.md \
  --sections --occurrences --entities --vocab --format md
```

## 補足

- このサンプルは人間可読性を優先し、各 section / occurrence YAML の直後に説明文を配置しています。
- 参照・パス記述は移動しやすいよう相対パスで統一しています。
