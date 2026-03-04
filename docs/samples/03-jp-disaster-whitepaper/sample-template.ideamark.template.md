# Disaster Whitepaper Extraction Template v1.1

```yaml
ideamark_version: 1
doc_id: "disasterplan.whitepaper.extraction.<project-name>.<yyyy-mm-dd>"
doc_type: "pattern"
status:
  state: "in_progress"
created_at: "<ISO-8601>"
updated_at: "<ISO-8601>"
lang: "ja-JP"

template:
  id: "imtpl.disaster.whitepaper.extraction"
  name: "Disaster Whitepaper Extraction Template"
  version: "1.1"
  description: "防災白書から自治体防災計画の知識を抽出するIdeaMarkテンプレート"

refs:
  sources:
    - id: "SRC-WHITEPAPER-CASE"
      uri: "<case pdf>"
      role: "source_material"
    - id: "SRC-WHITEPAPER-POLICY"
      uri: "<policy pdf>"
      role: "source_material"
    - id: "SRC-WHITEPAPER-PLAN"
      uri: "<planning pdf>"
      role: "source_material"
```

---

# Section 000 : Extraction Scope

```yaml
section_id: "SEC-SCOPE"
anchorage:
  view: "analysis"
  phase: "plan"
  domain: ["knowledge-extraction"]
```

目的

* 防災白書から自治体防災計画に使える知識を抽出する
* 政策・教訓・対策を整理する

---

# Section 001 : Hazard Context

```yaml
section_id: "SEC-HAZARD"
anchorage:
  view: "problem"
  phase: "confirmed"
  domain: ["hazard"]
```

抽出対象

* 災害の概要
* 発生条件
* 被害範囲

---

# Section 002 : Disaster Impact Metrics

```yaml
section_id: "SEC-IMPACT"
anchorage:
  view: "observation_series"
  phase: "confirmed"
```

抽出対象

```
死者
被害額
避難者
インフラ被害
```

---

# Section 003 : Lessons Learned

```yaml
section_id: "SEC-LESSONS"
anchorage:
  view: "analysis"
  phase: "confirmed"
```

抽出対象

```
災害教訓
対応課題
制度問題
```

---

# Section 004 : National Policy

```yaml
section_id: "SEC-NATIONAL-POLICY"
anchorage:
  view: "decision"
  phase: "confirmed"
```

抽出対象

```
国の防災政策
政策方針
制度
```

---

# Section 005 : Key Planning Vocabulary

```yaml
section_id: "SEC-VOCAB"
anchorage:
  view: "analysis"
  phase: "confirmed"
```

抽出対象

```
自助
共助
公助
レジリエンス
事前防災
```

---

# Section 006 : Local Implementation Measures

```yaml
section_id: "SEC-LOCAL-MEASURES"
anchorage:
  view: "solution"
  phase: "plan"
```

抽出対象

```
避難所
ハザードマップ
住民訓練
情報伝達
```

---

# Section 007 : Planning Guidance

```yaml
section_id: "SEC-GUIDANCE"
anchorage:
  view: "decision"
  phase: "confirmed"
```

ここでは

* 自治体防災計画への提案
* 優先施策

をまとめる

---

# Entities Registry

```yaml
entities:

  IE-HAZARD:
    kind: "risk"
    content: "災害"

  IE-LESSON:
    kind: "lesson"
    content: "災害教訓"

  IE-POLICY:
    kind: "policy"
    content: "防災政策"

  IE-MEASURE:
    kind: "measure"
    content: "防災対策"

  IE-METRIC:
    kind: "metric"
    content: "災害指標"

  IE-GUIDANCE:
    kind: "decision"
    content: "自治体計画提案"
```
