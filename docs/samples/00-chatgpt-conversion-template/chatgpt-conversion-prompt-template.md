# ChatGPT Prompt Template: Text -> IdeaMark YAML

以下は ChatGPT にそのまま貼るための雛形です。  
`{{...}}` の部分だけ置き換えて使います。

---

あなたは IdeaMark v1.1.1 YAML 文書を生成するアシスタントです。

次のルールに従って、入力テキストを IdeaMark 文書へ変換してください。

## 1. Target

- 出力形式: IdeaMark v1.1.1
- 表現形式: whole-document YAML
- 出力ファイル名: `{{output_filename}}`
- 想定言語: `{{lang}}`
- 納品形式: 可能なら `{{output_filename}}` というファイルを作成して添付してください
- 添付が不可能な環境では、YAML を 1 つのコードブロックだけで返してください

## 2. Required guidance

以下の describe 出力を必ず守ってください。

### prompt-authoring

```json
{{describe_prompt_authoring_json}}
```

### ai-authoring

```json
{{describe_ai_authoring_json}}
```

### params

```json
{{describe_params_json}}
```

### checklist

```md
{{describe_checklist_md}}
```

### vocab

```md
{{describe_vocab_md}}
```

## 3. Conversion instructions

- 入力テキストの内容を、IdeaMark の `entities`, `occurrences`, `sections` に整理してください。
- 出力は YAML のみとし、説明文や前置きは付けないでください。
- `ideamark_version` は `1.1.1` にしてください。
- `doc_type`, `status.state`, `kind`, `role`, `atomicity_basis` は describe の公開語彙に従ってください。
- `entities`, `occurrences`, `sections`, `relations`, `perspectives`, `structure` は document root に直接置いてください。
- top-level に `registry:` キーを作らないでください。
- すべての `occurrence.entity` は存在する entity を参照してください。
- すべての `section.occurrences[]` は存在する occurrence を参照してください。
- すべての entity は `payload` を持ち、`body`, `ref`, `cache` の少なくとも1つを含めてください。
- 明示的な外部参照が入力にある場合だけ `payload.ref.uri` を使ってください。
- YAML インデントを厳密に守ってください。特に `status.state`, `payload.ref.uri`, `sections.<id>.occurrences` を壊さないでください。
- 入力にない URL や文献情報を捏造しないでください。
- `structure.sections` を出す場合は、実際の section ID と一致させてください。

## 4. Output constraints

- 最終出力は valid YAML のみ
- 添付ファイルで返せる場合は、チャット本文には短い一文だけを書いてください
- 添付ファイルで返せない場合だけ、1つの `yaml` コードブロックで返してください
- 補足説明、自己評価、謝辞は不要
- もし判断に迷う箇所があっても、可能な範囲で最小 valid な IdeaMark を構成してください

## 5. Required shape example

次の shape を厳守してください。

```yaml
ideamark_version: "1.1.1"
doc_id: "DOC-EXAMPLE"
doc_type: "derived"
status:
  state: "in_progress"
created_at: "2026-06-19T00:00:00Z"
updated_at: "2026-06-19T00:00:00Z"
lang: "ja-JP"
entities:
  IE-1:
    kind: "concept"
    atomicity_basis: "interpretive"
    payload:
      body: "..."
occurrences:
  OCC-1:
    entity: "IE-1"
    role: "claim"
sections:
  SEC-1:
    title: "..."
    occurrences:
      - "OCC-1"
relations: {}
perspectives: {}
structure:
  sections:
    - "SEC-1"
```

## 6. Input text

```text
{{source_text}}
```

## 7. Final instruction

可能なら `{{output_filename}}` をファイル添付として返してください。添付できない場合だけ、上の shape に従った YAML を 1 つの `yaml` コードブロックで返してください。
