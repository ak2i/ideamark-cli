# 02 USGS Volcano Monitoring Sample

このディレクトリは、USGS SIR 2024-5062 Chapter I を IdeaMark v1.1.1 YAML-first 形式へ変換するためのサンプル一式です。

- Source: `./usgs_sir_2024_5062_volcano_monitoring_capabilities.md`
- Prompt:
  - `./usgs_sir_2024_5062_volcano_monitoring_capabilities.reproduced.prompt.md`
  - `./usgs_sir_2024_5062_volcano_monitoring_capabilities.reproduced_auto.prompt.md`
- Output:
  - `./usgs_sir_2024_5062_volcano_monitoring_capabilities.reproduced.ideamark.yaml`
  - `./usgs_sir_2024_5062_volcano_monitoring_capabilities.reproduced_auto.ideamark.yaml`

## 手順

1. `describe` で生成規約を取得する。

```bash
ideamark describe prompt-authoring --format json --audience ai --model large --lang en-US
ideamark describe ai-authoring --format json --audience ai --model large --lang en-US
ideamark describe params --format json --audience ai --model large --lang en-US
ideamark describe checklist --format md --audience ai --model large --lang en-US
ideamark describe vocab --format md --audience ai --model large --lang en-US
```

2. 規約を反映したプロンプトを作る。
- strict必須ヘッダ
- top-level `entities / occurrences / sections / relations / perspectives / structure`
- payload要件
- 参照整合
- `registry:` で包まない

3. プロンプトに沿って IdeaMark 文書を生成する。

4. strict validate で検証する。

```bash
ideamark validate ./usgs_sir_2024_5062_volcano_monitoring_capabilities.reproduced.ideamark.yaml --mode working
ideamark validate ./usgs_sir_2024_5062_volcano_monitoring_capabilities.reproduced.ideamark.yaml --mode strict
ideamark validate ./usgs_sir_2024_5062_volcano_monitoring_capabilities.reproduced_auto.ideamark.yaml --mode working
ideamark validate ./usgs_sir_2024_5062_volcano_monitoring_capabilities.reproduced_auto.ideamark.yaml --mode strict
```

5. 必要に応じて構造一覧を確認する。

```bash
ideamark ls ./usgs_sir_2024_5062_volcano_monitoring_capabilities.reproduced.ideamark.yaml \
  --sections --occurrences --entities --vocab --format md
```

## 補足

- Markdown 埋め込み型の `*.ideamark.md` は旧 v1.0.3 系の履歴として残っていますが、現行の生成対象ではありません。
- 現行フローでは `*.ideamark.yaml` を生成し、top-level namespace を使います。
- 参照・パス記述は移動しやすいよう相対パスで統一しています。
