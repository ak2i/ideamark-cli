# 02 USGS Volcano Monitoring Sample

このディレクトリは、USGS SIR 2024-5062 Chapter I を IdeaMark v1.1.1 の YAML-based 形式へ変換したサンプル一式です。

- Source: `./usgs_sir_2024_5062_volcano_monitoring_capabilities.md`
- Prompt: `./usgs_sir_2024_5062_volcano_monitoring_capabilities.prompt.md`
- Output: `./usgs_sir_2024_5062_volcano_monitoring_capabilities.ideamark.yaml`

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
- 必須構造: `entities` / `occurrences` / `sections`
- payload 規約: `body` / `ref` / `cache`

3. プロンプトに沿って IdeaMark 文書を生成する。

4. strict validate で検証する。

```bash
ideamark validate ./usgs_sir_2024_5062_volcano_monitoring_capabilities.ideamark.yaml --mode strict
```

5. 必要に応じて構造一覧を確認する。

```bash
ideamark ls ./usgs_sir_2024_5062_volcano_monitoring_capabilities.ideamark.yaml \
  --sections --occurrences --entities --vocab --format md
```

## 補足

- このサンプルの基準出力は whole-document YAML です。
- 参照・パス記述は移動しやすいよう相対パスで統一しています。
- 旧 `.ideamark.md` 版は廃止し、この sample の公開形式は `.ideamark.yaml` に統一しています。
