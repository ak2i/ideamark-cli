``` yaml
ideamark_version: "1.0.3"
doc_id: "ideamark.cli.v0.1.4.dev-spec.v0.0.2.2026-03-05"
doc_type: "evolving"
status:
  state: "in_progress"
created_at: "2026-03-05T23:27:24Z"
updated_at: "2026-03-05T23:49:57Z"
lang: "ja-JP"
title: "IdeaMark-CLI v0.1.4 Development Spec – POR Scoring Update (v0.0.2)"
```

# IdeaMark‑CLI v0.1.4 Development Specification

本仕様は **Progressive Occurrence Resolution (POR)** を導入し、
長文・複雑文書をストリーム処理で IdeaMark 構造へ変換するための
アルゴリズムと CLI アーキテクチャを定義する。

POR は従来の

-   single‑shot LLM authoring
-   summarize‑heavy generation

から

**stream‑based structured extraction**

への転換を目的とする。

------------------------------------------------------------------------

# SEC-ARCHITECTURE-CONTEXT

``` yaml
section_id: "SEC-ARCHITECTURE-CONTEXT"
anchorage:
  view: "background"
  phase: "design"
  domain: ["architecture","por","stream"]
```

IdeaMark CLI は、PDF・議論ログ・論文などの長文資料を IdeaMark
構造へ変換する用途を想定している。

しかし従来の LLM 一括生成方式では次の問題がある。

-   コンテキスト長制限
-   要約バイアス
-   文脈喪失
-   Entity の配置誤り

これらを解決するため、 **ストリーム型 Entity 配置アルゴリズム**
を導入する。

------------------------------------------------------------------------

# SEC-PROBLEM-STREAM-INGEST

``` yaml
section_id: "SEC-PROBLEM-STREAM-INGEST"
anchorage:
  view: "problem"
  phase: "design"
```

長文文書を一括生成で IdeaMark 化すると

1.  LLM が要約を強く行う
2.  Entity が適切な Section に配置されない
3.  文書後半の情報で意味が変わるケースに対応できない

特に

「後半で意味が回収される Entity」

という構造は論文・物語・政策文書などで頻繁に出現する。

------------------------------------------------------------------------

# SEC-CONSTRAINTS-STREAM

``` yaml
section_id: "SEC-CONSTRAINTS-STREAM"
anchorage:
  view: "constraint"
  phase: "design"
```

POR は次の前提で設計する。

-   入力はチャンク単位でストリーム到着
-   Entity は複数の Section に再出現可能
-   既存構造の **上書きは禁止**
-   再解釈は **新しい Occurrence の追加** で表現
-   文書順序は重要な意味を持つ

------------------------------------------------------------------------

# SEC-OPTION-ENTITY-PLACEMENT

``` yaml
section_id: "SEC-OPTION-ENTITY-PLACEMENT"
anchorage:
  view: "analysis"
  phase: "design"
```

## Option 1 --- Single Shot

LLM に全文を与え IdeaMark を生成。

問題：

-   トークン制限
-   要約バイアス

## Option 2 --- Chunk Independent

チャンクごとに IdeaMark を作り後で結合。

問題：

-   文脈断絶
-   誤配置

## Option 3 --- Progressive Occurrence Resolution (POR)

チャンク単位で Entity を抽出し、
スコアリングと時間窓を使いながら配置を決定する。

------------------------------------------------------------------------

# SEC-DECISION-POR

``` yaml
section_id: "SEC-DECISION-POR"
anchorage:
  view: "decision"
  phase: "design"
```

IdeaMark CLI v0.1.4 では

**Progressive Occurrence Resolution (POR)**

を採用する。

POR は

-   score accumulation
-   facet support
-   plastic window
-   freeze rule

を組み合わせたストリーム推論アルゴリズムである。

------------------------------------------------------------------------

# SEC-STREAM-SCORE-ALGORITHM

``` yaml
section_id: "SEC-STREAM-SCORE-ALGORITHM"
anchorage:
  view: "solution"
  phase: "design"
```

Entity の配置候補には

candidate: anchorage.view occurrence.role

ごとにスコアを保持する。

スコアは

total_score = Σ log(match_score)

facet_weight = distinct_feature_count

confidence = total_score \* facet_weight

として評価する。

更新は以下の条件で行う。

-   新チャンクで証拠が追加
-   plastic window 内

------------------------------------------------------------------------

# SEC-PLASTIC-WINDOW

``` yaml
section_id: "SEC-PLASTIC-WINDOW"
anchorage:
  view: "solution"
  phase: "design"
```

Entity 初出チャンクを k とする。

更新可能範囲

k .. k + W

W は通常

2〜4 chunks

を推奨。

------------------------------------------------------------------------

# SEC-FREEZE-RULE

``` yaml
section_id: "SEC-FREEZE-RULE"
anchorage:
  view: "solution"
  phase: "design"
```

Occurrence は次の条件で **freeze** される。

-   top score − second score ≥ Δ
-   H 回連続で同一トップ
-   facet support ≥ F

freeze 後は

state: frozen

となり更新不可。

------------------------------------------------------------------------

# SEC-OCCURRENCE-REINTERPRETATION

``` yaml
section_id: "SEC-OCCURRENCE-REINTERPRETATION"
anchorage:
  view: "solution"
  phase: "design"
```

凍結後に新しい文脈が登場した場合

既存 Occurrence は変更しない。

代わりに

new occurrence entity: same entity id

を生成する。

これにより

-   物語的回収
-   論文の再解釈
-   政策文書の段階的説明

を自然に表現できる。

------------------------------------------------------------------------

# SEC-IR-ARCHITECTURE

``` yaml
section_id: "SEC-IR-ARCHITECTURE"
anchorage:
  view: "design"
  phase: "design"
```

内部処理では

IdeaMark Markdown を直接編集しない。

代わりに

Tree IR Entities Occurrences Sections Relations

を使用する。

将来的には

-   SQLite backend
-   graph database

などのストレージ実装を許容する。

------------------------------------------------------------------------

# SEC-CLI-ROADMAP

``` yaml
section_id: "SEC-CLI-ROADMAP"
anchorage:
  view: "plan"
  phase: "design"
```

v0.1.4 で検討する CLI 機能。

ideamark ingest material ideamark interpret chunk ideamark compose
window ideamark resolve entities ideamark export ideamark

------------------------------------------------------------------------

# SEC-FUTURE-WORK

``` yaml
section_id: "SEC-FUTURE-WORK"
anchorage:
  view: "plan"
  phase: "draft"
```

将来検討事項

-   POR パラメータ自動調整
-   diff/lint 統合
-   multi‑document entity resolution
