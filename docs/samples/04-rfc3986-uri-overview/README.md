# 04 RFC3986 URI Overview Sample

このディレクトリは、RFC 3986 Section 1.1 の URI 概要をもとにした、小さめの IdeaMark v1.1.1 YAML サンプルです。

用途:
- `ideamark validate` の手動確認
- ChatGPT 変換フローの出力例
- `entities / occurrences / sections` の最小構造確認

## Files

- `rfc3986-uri-overview-sample.ideamark.yaml`
  - warning 0 を目標に整えた公開サンプル

## Validate

```bash
ideamark validate ./rfc3986-uri-overview-sample.ideamark.yaml --mode working
ideamark validate ./rfc3986-uri-overview-sample.ideamark.yaml --mode strict
```

## Notes

- 現行の `ideamark-cli v0.2.0` では `entities`, `occurrences`, `sections` は top-level に配置します。
- `registry:` の下に入れた旧形は、このサンプルでは使いません。
- このサンプルは ChatGPT 生成結果をベースに、人手で shape を整えたものです。
