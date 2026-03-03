---
created_at: "2026-02-28T12:00:00+09:00"
doc_id: ideamark.cli.v0.1.3.dev-spec.v0.0.7.2026-02-28
doc_type: spec
ideamark_version: 1
lang: ja-JP
status: in_progress
template:
  description: Decision6 WorkCell に正式マッピングした v0.0.7
  file: Decision6-WorkCell.ideamark.template.v1.0.3.md
  id: imtpl.decision6.workcell
  name: Decision6 WorkCell Template
  version: 1.0.3
updated_at: "2026-02-27T23:39:08.344865"
---

# Overview

本ドキュメントは v0.0.6 の内容を Decision6 WorkCell
テンプレートへ再配置し、 Section骨格固定＋Routing前提の構造へ再編した
v0.0.7 である。

目的は：

-   Section増殖を防ぐ
-   anchorageに基づく整理を徹底する
-   merge/refactorを前提とした開発運用に移行する

------------------------------------------------------------------------

# Section 000 : Routing & Inbox Operating Model

``` yaml
section_id: "SEC-ROUTING"
anchorage:
  view: "decision"
  phase: "design"
  domain: ["ideamark", "workcell", "routing"]
```

本specは以下を前提とする：

-   Section構成は固定骨格とする
-   新しい議論は Occurrence として追加する
-   迷った断片は SEC-INBOX に一時格納する
-   merge は定期、refactor は pivot時のみ実施

------------------------------------------------------------------------

# Section 001 : Intent

``` yaml
section_id: "SEC-INTENT"
anchorage:
  view: "decision"
  phase: "plan"
  domain: ["ideamark", "tooling"]
```

-   guides改修
-   describe直交I/F確立
-   分割Section導入
-   capabilities→guides自走確立

境界：

-   diff/lint未実装
-   UI未対象

------------------------------------------------------------------------

# Section 002 : Problem & Hypotheses

``` yaml
section_id: "SEC-HYPOTHESIS"
anchorage:
  view: "problem"
  phase: "hypothesis"
  domain: ["ideamark"]
```

H1: guides最小化で修正ループ削減\
H2: 直交I/FでLLM自走安定\
H3: breakdown copy既定で衝突制御容易

------------------------------------------------------------------------

# Section 003 : Options & Comparison

``` yaml
section_id: "SEC-OPTIONS"
anchorage:
  view: "comparison"
  phase: "exploration"
  domain: ["cli-design"]
```

Option A: profile正規\
Option B: 直交正規（採用）

------------------------------------------------------------------------

# Section 004 : Design & Production Scope

``` yaml
section_id: "SEC-DESIGN"
anchorage:
  view: "solution"
  phase: "design"
  domain: ["describe", "guides", "cli"]
```

## describe直交I/F確定

-   --audience
-   --lang
-   --model
-   profileはalias

## guides階層化

-   ai-small（固定レシピ）
-   ai-large（フレームワーク）

## breakdown仕様

-   copy既定
-   derived_from必須
-   ID維持

------------------------------------------------------------------------

# Section 005 : Capabilities & Recipes Model

``` yaml
section_id: "SEC-CAPABILITIES"
anchorage:
  view: "solution"
  phase: "design"
  domain: ["capabilities", "recipes"]
```

-   capabilitiesは indexのみ
-   guidesは index→detail二段階
-   recipe_id安定ID

自走フロー：

1.  describe capabilities
2.  recipe選択
3.  describe guides
4.  実行＋validate

------------------------------------------------------------------------

# Section 006 : Metrics & Validation Strategy

``` yaml
section_id: "SEC-METRICS"
anchorage:
  view: "observation_series"
  phase: "plan"
  domain: ["validation", "llm"]
```

M1: YAML parse / ID一意 / 参照解決\
M2: strict自己修正率\
M3: 再試行回数\
M4: split→merge往復安全性

------------------------------------------------------------------------

# Section 007 : Decision Log

``` yaml
section_id: "SEC-DECISION"
anchorage:
  view: "decision"
  phase: "confirmed"
  domain: ["cli-design"]
```

D1: describe直交I/F採用\
D2: guides階層化\
D3: breakdown copy既定\
D4: LLMテスト先行

------------------------------------------------------------------------

# Section INBOX

``` yaml
section_id: "SEC-INBOX"
anchorage:
  view: "analysis"
  phase: "plan"
  domain: ["inbox"]
```

未整理事項を格納する。

------------------------------------------------------------------------

End of v0.0.7
