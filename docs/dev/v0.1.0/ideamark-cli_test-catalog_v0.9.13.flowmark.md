```yaml flowmark
id: ideamark-cli-test-catalog
title: IdeaMark CLI v0.1.0 Test Catalog (aligned to v0.9.13 design)
version: "0.9.13"
status: draft
contract:
  enumeration_target: "All v0.1.0 behaviors: validate/format/extract/compose/publish/describe + I/O"
  required_groups:
    - validate
    - extract
    - compose
    - format
    - publish
    - describe
    - ops
  min_total_items: 100
```

このドキュメントは **チェックリスト型のテストカタログ**です。各項目は「意図」「合格基準」を併記し、人間レビューとAI実装の両方に使えることを狙います。
各項目の具体フィクスチャ（入力md/期待NDJSONなど）は別ファイル（tests/fixtures など）に置く想定です。

## Validate (working/strict)

```yaml flowmark-section
id: validate
```

YAML Spec v1.0.1 / Document Spec v1.0.1に基づく構文・参照整合の検証。strictは必須欠落や参照切れをerrorとして返し、workingは警告中心。出力はNDJSONで、meta→diagnostic*→summaryの順。

```yaml flowmark-item
id: TC-VAL-HDR-001
status: todo
```
- **意図**: 文書ヘッダ必須キー欠落を検出する
- **合格基準**: --strictでerrorが出てexit=1
- **不合格例**: errorが出ない/exit=0は不合格

```yaml flowmark-item
id: TC-VAL-HDR-002
status: todo
```
- **意図**: ideamark_version不正を検出する
- **合格基準**: --strictでerrorが出てexit=1
- **不合格例**: errorが出ない/exit=0は不合格

```yaml flowmark-item
id: TC-VAL-HDR-003
status: todo
```
- **意図**: doc_type不正を検出する
- **合格基準**: --strictでerrorが出てexit=1
- **不合格例**: errorが出ない/exit=0は不合格

```yaml flowmark-item
id: TC-VAL-HDR-004
status: todo
```
- **意図**: status不正を検出する
- **合格基準**: --strictでerrorが出てexit=1
- **不合格例**: errorが出ない/exit=0は不合格

```yaml flowmark-item
id: TC-VAL-HDR-005
status: todo
```
- **意図**: created_at/updated_atの形式不正を検出する
- **合格基準**: --strictでerrorが出てexit=1
- **不合格例**: errorが出ない/exit=0は不合格

```yaml flowmark-item
id: TC-VAL-HDR-006
status: todo
```
- **意図**: lang不正を検出する
- **合格基準**: --strictでerrorが出てexit=1
- **不合格例**: errorが出ない/exit=0は不合格

```yaml flowmark-item
id: TC-VAL-HDR-007
status: todo
```
- **意図**: ヘッダYAMLブロック複数を検出する
- **合格基準**: --strictでerrorが出てexit=1
- **不合格例**: errorが出ない/exit=0は不合格

```yaml flowmark-item
id: TC-VAL-SEC-001
status: todo
```
- **意図**: Section YAML欠落（見出しのみ）を検出する
- **合格基準**: --strictでerrorが出てexit=1
- **不合格例**: errorが出ない/exit=0は不合格

```yaml flowmark-item
id: TC-VAL-SEC-002
status: todo
```
- **意図**: section_id欠落を検出する
- **合格基準**: --strictでerrorが出てexit=1
- **不合格例**: errorが出ない/exit=0は不合格

```yaml flowmark-item
id: TC-VAL-SEC-003
status: todo
```
- **意図**: anchorage欠落を検出する
- **合格基準**: --strictでerrorが出てexit=1
- **不合格例**: errorが出ない/exit=0は不合格

```yaml flowmark-item
id: TC-VAL-SEC-004
status: todo
```
- **意図**: anchorage.view欠落/不正を検出する
- **合格基準**: --strictでerrorが出てexit=1
- **不合格例**: errorが出ない/exit=0は不合格

```yaml flowmark-item
id: TC-VAL-SEC-005
status: todo
```
- **意図**: anchorage.phase欠落/不正を検出する
- **合格基準**: --strictでerrorが出てexit=1
- **不合格例**: errorが出ない/exit=0は不合格

```yaml flowmark-item
id: TC-VAL-SEC-006
status: todo
```
- **意図**: registry側anchorage欠落を検出する
- **合格基準**: --strictでerrorが出てexit=1
- **不合格例**: errorが出ない/exit=0は不合格

```yaml flowmark-item
id: TC-VAL-SEC-007
status: todo
```
- **意図**: section_id重複定義を検出する
- **合格基準**: --strictでerrorが出てexit=1
- **不合格例**: errorが出ない/exit=0は不合格

```yaml flowmark-item
id: TC-VAL-OCC-001
status: todo
```
- **意図**: Occurrence YAML欠落を検出する
- **合格基準**: --strictでerrorが出てexit=1
- **不合格例**: errorが出ない/exit=0は不合格

```yaml flowmark-item
id: TC-VAL-OCC-002
status: todo
```
- **意図**: occurrence_id欠落を検出する
- **合格基準**: --strictでerrorが出てexit=1
- **不合格例**: errorが出ない/exit=0は不合格

```yaml flowmark-item
id: TC-VAL-OCC-003
status: todo
```
- **意図**: entity参照欠落を検出する
- **合格基準**: --strictでerrorが出てexit=1
- **不合格例**: errorが出ない/exit=0は不合格

```yaml flowmark-item
id: TC-VAL-OCC-004
status: todo
```
- **意図**: role欠落/不正の扱いを確認する
- **合格基準**: 方針通り（warningまたはerror）のdiagnosticが出る
- **不合格例**: 期待する診断が出ない

```yaml flowmark-item
id: TC-VAL-OCC-005
status: todo
```
- **意図**: status.state欠落/不正を検出する
- **合格基準**: --strictでerrorが出てexit=1
- **不合格例**: errorが出ない/exit=0は不合格

```yaml flowmark-item
id: TC-VAL-OCC-006
status: todo
```
- **意図**: occurrence_id重複定義を検出する
- **合格基準**: --strictでerrorが出てexit=1
- **不合格例**: errorが出ない/exit=0は不合格

```yaml flowmark-item
id: TC-VAL-ENT-001
status: todo
```
- **意図**: entity参照先がentitiesに存在しない場合を検出する
- **合格基準**: --strictでerrorが出てexit=1
- **不合格例**: errorが出ない/exit=0は不合格

```yaml flowmark-item
id: TC-VAL-ENT-002
status: todo
```
- **意図**: Entity定義の必須(kind/content)欠落を検出する
- **合格基準**: --strictでerrorが出てexit=1
- **不合格例**: errorが出ない/exit=0は不合格

```yaml flowmark-item
id: TC-VAL-ENT-003
status: todo
```
- **意図**: 未参照Entityをwarningとして報告する
- **合格基準**: workingでwarningが出る（exit=0）
- **不合格例**: warningが出ない

```yaml flowmark-item
id: TC-VAL-ENT-004
status: todo
```
- **意図**: inline entity定義をsymbol tableに登録し参照解決できる
- **合格基準**: validate strict/workingいずれも参照切れ無しでpass
- **不合格例**: 参照切れdiagnosticが出る

```yaml flowmark-item
id: TC-VAL-ENT-005
status: todo
```
- **意図**: inlineとregistryで同一ID定義差（衝突）を検出する
- **合格基準**: 方針通り（warningまたはerror）で衝突診断が出る
- **不合格例**: 衝突診断が出ない

```yaml flowmark-item
id: TC-VAL-STR-001
status: todo
```
- **意図**: structure.sections欠落時の扱いを確認する
- **合格基準**: 方針通り（strictでerror/またはwarning）の診断が出る
- **不合格例**: 診断が想定と違う

```yaml flowmark-item
id: TC-VAL-STR-002
status: todo
```
- **意図**: structureが未定義section_id参照を検出する
- **合格基準**: --strictでerrorが出てexit=1
- **不合格例**: errorが出ない/exit=0は不合格

```yaml flowmark-item
id: TC-VAL-STR-003
status: todo
```
- **意図**: sections.*.occurrencesが未定義occ参照を検出する
- **合格基準**: --strictでerrorが出てexit=1
- **不合格例**: errorが出ない/exit=0は不合格

```yaml flowmark-item
id: TC-VAL-STR-004
status: todo
```
- **意図**: registryにあるがstructure未登場sectionをwarningで報告する
- **合格基準**: workingでwarningが出る（exit=0）
- **不合格例**: warningが出ない

```yaml flowmark-item
id: TC-VAL-STR-005
status: todo
```
- **意図**: 孤立occurrence（本文にあるがregistry参照無し）をwarningで報告する
- **合格基準**: workingでwarningが出る（exit=0）
- **不合格例**: warningが出ない

```yaml flowmark-item
id: TC-VAL-REF-001
status: todo
```
- **意図**: detail_docが存在する場合の必須フィールド欠落を検出する
- **合格基準**: --strictでerrorが出てexit=1
- **不合格例**: errorが出ない/exit=0は不合格

```yaml flowmark-item
id: TC-VAL-REF-002
status: todo
```
- **意図**: detail_docs配列要素の必須欠落を検出する
- **合格基準**: --strictでerrorが出てexit=1
- **不合格例**: errorが出ない/exit=0は不合格

```yaml flowmark-item
id: TC-VAL-REF-003
status: todo
```
- **意図**: refs.parentが存在する場合の必須欠落を検出する
- **合格基準**: --strictでerrorが出てexit=1
- **不合格例**: errorが出ない/exit=0は不合格

```yaml flowmark-item
id: TC-VAL-REF-004
status: todo
```
- **意図**: 外部URI解決は行わない（解決不能でもエラーにしない）
- **合格基準**: validateが外部解決を要求せずpassする
- **不合格例**: 外部解決を要求するerrorが出る

```yaml flowmark-item
id: TC-VAL-HEUR-001
status: todo
```
- **意図**: 本文完全一致候補のヒューリスティック診断を出す
- **合格基準**: 方針通りinfo/warningが出る
- **不合格例**: 診断が想定と違う

```yaml flowmark-item
id: TC-VAL-HEUR-002
status: todo
```
- **意図**: 本文一致でもanchorage差なら候補にしない
- **合格基準**: 方針通りinfo/warningが出る
- **不合格例**: 診断が想定と違う

```yaml flowmark-item
id: TC-VAL-HEUR-003
status: todo
```
- **意図**: format前後でヒューリスティック結果が安定する
- **合格基準**: formatを2回適用しても診断/出力が変わらない
- **不合格例**: 出力が揺れる

## Extract

```yaml flowmark-section
id: extract
```

指定したSection/Occurrenceを起点に推移閉包（参照が切れないよう必要定義を同梱）した新規文書を生成。v0.1.0は単一指定のみ。

```yaml flowmark-item
id: TC-EXT-SEC-001
status: todo
```
- **意図**: Section指定抽出ができる
- **合格基準**: 指定Sectionを含みstrict validate通過
- **不合格例**: 指定Sectionが無い/validate失敗

```yaml flowmark-item
id: TC-EXT-OCC-001
status: todo
```
- **意図**: Occurrence指定抽出ができる（必要なら親Section同梱）
- **合格基準**: strict validate通過
- **不合格例**: validate失敗

```yaml flowmark-item
id: TC-EXT-MULTI-001
status: todo
```
- **意図**: 複数指定はv0.1.0では未対応（将来予約）
- **合格基準**: usage error(Exit=2) または skipped 扱い
- **不合格例**: 黙って成功する

```yaml flowmark-item
id: TC-EXT-CLO-001
status: todo
```
- **意図**: 抽出時に参照閉包を取り、参照切れを作らない
- **合格基準**: strict validateで参照切れerror無し
- **不合格例**: 参照切れerrorが出る

```yaml flowmark-item
id: TC-EXT-CLO-002
status: todo
```
- **意図**: 抽出時に参照閉包を取り、参照切れを作らない
- **合格基準**: strict validateで参照切れerror無し
- **不合格例**: 参照切れerrorが出る

```yaml flowmark-item
id: TC-EXT-CLO-003
status: todo
```
- **意図**: 抽出時に参照閉包を取り、参照切れを作らない
- **合格基準**: strict validateで参照切れerror無し
- **不合格例**: 参照切れerrorが出る

```yaml flowmark-item
id: TC-EXT-CLO-004
status: todo
```
- **意図**: 抽出時に参照閉包を取り、参照切れを作らない
- **合格基準**: strict validateで参照切れerror無し
- **不合格例**: 参照切れerrorが出る

```yaml flowmark-item
id: TC-EXT-CLO-005
status: todo
```
- **意図**: 抽出時に参照閉包を取り、参照切れを作らない
- **合格基準**: strict validateで参照切れerror無し
- **不合格例**: 参照切れerrorが出る

```yaml flowmark-item
id: TC-EXT-OUT-001
status: todo
```
- **意図**: 抽出出力が単体でstrict validate通過する
- **合格基準**: 期待条件を満たす
- **不合格例**: 期待条件を満たさない

```yaml flowmark-item
id: TC-EXT-OUT-002
status: todo
```
- **意図**: 抽出出力のdoc_idは新規発行する
- **合格基準**: 期待条件を満たす
- **不合格例**: 期待条件を満たさない

```yaml flowmark-item
id: TC-EXT-OUT-003
status: todo
```
- **意図**: local_idは原則保持（衝突時のみrename+aliases）
- **合格基準**: 期待条件を満たす
- **不合格例**: 期待条件を満たさない

```yaml flowmark-item
id: TC-EXT-OUT-004
status: todo
```
- **意図**: structure.sectionsは抽出対象のみ（余計なSectionを増やさない）
- **合格基準**: 期待条件を満たす
- **不合格例**: 期待条件を満たさない

```yaml flowmark-item
id: TC-EXT-ERR-001
status: todo
```
- **意図**: extractエラー系（存在しないID/不正入力/閉包解決不能）
- **合格基準**: exit=1かつdiagnosticが出る
- **不合格例**: exit=0またはdiagnostic無し

```yaml flowmark-item
id: TC-EXT-ERR-002
status: todo
```
- **意図**: extractエラー系（存在しないID/不正入力/閉包解決不能）
- **合格基準**: exit=1かつdiagnosticが出る
- **不合格例**: exit=0またはdiagnostic無し

```yaml flowmark-item
id: TC-EXT-ERR-003
status: todo
```
- **意図**: extractエラー系（存在しないID/不正入力/閉包解決不能）
- **合格基準**: exit=1かつdiagnosticが出る
- **不合格例**: exit=0またはdiagnostic無し

## Compose

```yaml flowmark-section
id: compose
```

複数文書の和集合合成。衝突はrename+aliasesで吸収し、参照追随は全パス対象。RegistryはIDソートで安定化。本文Section順はstructure.sectionsを正。

```yaml flowmark-item
id: TC-COM-UNI-001
status: todo
```
- **意図**: 非衝突要素は和集合で合成される
- **合格基準**: 全要素が含まれる
- **不合格例**: 欠落がある

```yaml flowmark-item
id: TC-COM-UNI-002
status: todo
```
- **意図**: structure.sectionsはA優先+B末尾追加の規則通り
- **合格基準**: 順序が規則通り
- **不合格例**: 順序が崩れる

```yaml flowmark-item
id: TC-COM-UNI-003
status: todo
```
- **意図**: 同一内容でもIDが違えばdedupeしない
- **合格基準**: 両方残る
- **不合格例**: 勝手に統合される

```yaml flowmark-item
id: TC-COM-CON-ENT-001
status: todo
```
- **意図**: compose衝突時rename+aliases+参照追随
- **合格基準**: strict validateで参照切れ無し
- **不合格例**: 参照切れが出る

```yaml flowmark-item
id: TC-COM-CON-OCC-001
status: todo
```
- **意図**: compose衝突時rename+aliases+参照追随
- **合格基準**: strict validateで参照切れ無し
- **不合格例**: 参照切れが出る

```yaml flowmark-item
id: TC-COM-CON-SEC-001
status: todo
```
- **意図**: compose衝突時rename+aliases+参照追随
- **合格基準**: strict validateで参照切れ無し
- **不合格例**: 参照切れが出る

```yaml flowmark-item
id: TC-COM-CON-MIX-001
status: todo
```
- **意図**: compose衝突時rename+aliases+参照追随
- **合格基準**: strict validateで参照切れ無し
- **不合格例**: 参照切れが出る

```yaml flowmark-item
id: TC-COM-REF-LOC-001
status: todo
```
- **意図**: rename後の参照追随パスごとの網羅
- **合格基準**: 対象パスが全て追随される
- **不合格例**: 追随漏れがある

```yaml flowmark-item
id: TC-COM-REF-TGT-001
status: todo
```
- **意図**: rename後の参照追随パスごとの網羅
- **合格基準**: 対象パスが全て追随される
- **不合格例**: 追随漏れがある

```yaml flowmark-item
id: TC-COM-REF-EVI-001
status: todo
```
- **意図**: rename後の参照追随パスごとの網羅
- **合格基準**: 対象パスが全て追随される
- **不合格例**: 追随漏れがある

```yaml flowmark-item
id: TC-COM-REF-DFE-001
status: todo
```
- **意図**: rename後の参照追随パスごとの網羅
- **合格基準**: 対象パスが全て追随される
- **不合格例**: 追随漏れがある

```yaml flowmark-item
id: TC-COM-REF-SEC-001
status: todo
```
- **意図**: rename後の参照追随パスごとの網羅
- **合格基準**: 対象パスが全て追随される
- **不合格例**: 追随漏れがある

```yaml flowmark-item
id: TC-COM-REF-STR-001
status: todo
```
- **意図**: rename後の参照追随パスごとの網羅
- **合格基準**: 対象パスが全て追随される
- **不合格例**: 追随漏れがある

```yaml flowmark-item
id: TC-COM-REF-REL-001
status: todo
```
- **意図**: rename後の参照追随パスごとの網羅
- **合格基準**: 対象パスが全て追随される
- **不合格例**: 追随漏れがある

```yaml flowmark-item
id: TC-COM-REF-URI-001
status: todo
```
- **意図**: rename後の参照追随パスごとの網羅
- **合格基準**: 対象パスが全て追随される
- **不合格例**: 追随漏れがある

```yaml flowmark-item
id: TC-COM-REF-FQID-001
status: todo
```
- **意図**: rename後の参照追随パスごとの網羅
- **合格基準**: 対象パスが全て追随される
- **不合格例**: 追随漏れがある

```yaml flowmark-item
id: TC-COM-REF-URL-001
status: todo
```
- **意図**: rename後の参照追随パスごとの網羅
- **合格基準**: 対象パスが全て追随される
- **不合格例**: 追随漏れがある

```yaml flowmark-item
id: TC-COM-ERR-001
status: todo
```
- **意図**: composeエラー系（参照切れ等）
- **合格基準**: compose後strict validate通過、失敗ならexit=1
- **不合格例**: 参照切れを見落とす

```yaml flowmark-item
id: TC-COM-ERR-002
status: todo
```
- **意図**: composeエラー系（参照切れ等）
- **合格基準**: compose後strict validate通過、失敗ならexit=1
- **不合格例**: 参照切れを見落とす

## Format

```yaml flowmark-section
id: format
```

整形のみ。Registry同期は別オプション（v0.2.x）。YAML表記差の厳密一致は要求せず、構文的に有効であることを重視。canonicalではURI正規化。冪等。

```yaml flowmark-item
id: TC-FMT-YAML-001
status: todo
```
- **意図**: YAML表記の正規化（キー順/インデント/配列表記）
- **合格基準**: YAMLが有効で、formatが安定（再formatで変化しない）
- **不合格例**: YAMLが壊れる/出力が揺れる

```yaml flowmark-item
id: TC-FMT-YAML-002
status: todo
```
- **意図**: YAML表記の正規化（キー順/インデント/配列表記）
- **合格基準**: YAMLが有効で、formatが安定（再formatで変化しない）
- **不合格例**: YAMLが壊れる/出力が揺れる

```yaml flowmark-item
id: TC-FMT-YAML-003
status: todo
```
- **意図**: YAML表記の正規化（キー順/インデント/配列表記）
- **合格基準**: YAMLが有効で、formatが安定（再formatで変化しない）
- **不合格例**: YAMLが壊れる/出力が揺れる

```yaml flowmark-item
id: TC-FMT-MD-001
status: todo
```
- **意図**: Markdown正規化（空行/Section並べ替え/冪等）
- **合格基準**: 2回formatで同一、structure順が反映される
- **不合格例**: 出力が揺れる/順序が崩れる

```yaml flowmark-item
id: TC-FMT-MD-002
status: todo
```
- **意図**: Markdown正規化（空行/Section並べ替え/冪等）
- **合格基準**: 2回formatで同一、structure順が反映される
- **不合格例**: 出力が揺れる/順序が崩れる

```yaml flowmark-item
id: TC-FMT-MD-003
status: todo
```
- **意図**: Markdown正規化（空行/Section並べ替え/冪等）
- **合格基準**: 2回formatで同一、structure順が反映される
- **不合格例**: 出力が揺れる/順序が崩れる

## Publish

```yaml flowmark-section
id: publish
```

WorkingをPublishedとして配布可能な状態へ正規化するゲート。pipelineはformat --canonical→validate --strict。成功時のみ成果物を出力し、失敗時はdiagnosticsのみ。

```yaml flowmark-item
id: TC-PUB-001
status: todo
```
- **意図**: publish成功パス：format--canonical→validate--strictでPublishedが出る
- **合格基準**: exit=0、stdoutにPublished文書、stderrにdiagnostics無し(またはinfoのみ)
- **不合格例**: 出力無し/exit!=0

```yaml flowmark-item
id: TC-PUB-002
status: todo
```
- **意図**: publish失敗パス：strict errorで成果物を出さない
- **合格基準**: exit=1、stdout空、stderrにNDJSON diagnostics(error)
- **不合格例**: stdoutに成果物が出る

```yaml flowmark-item
id: TC-PUB-003
status: todo
```
- **意図**: publishはupdated_at更新しstatus.stateをpublishedへ
- **合格基準**: 出力文書でupdated_atが更新、status.state=published(存在する場合)
- **不合格例**: 更新されない/値が違う

```yaml flowmark-item
id: TC-PUB-004
status: todo
```
- **意図**: publishでcanonical URI（ideamark://docs/<doc_id>#/...）へ正規化
- **合格基準**: 参照がURI化され、validate strict通過
- **不合格例**: URI化されない/参照切れ

```yaml flowmark-item
id: TC-PUB-005
status: todo
```
- **意図**: publishのstdin/stdout対応
- **合格基準**: infile省略または-でstdin入力しstdoutへ出力できる
- **不合格例**: stdin入力で動かない

```yaml flowmark-item
id: TC-PUB-006
status: todo
```
- **意図**: publishのdiagnosticsはstderr（成果物と分離）
- **合格基準**: stderrにNDJSON、stdoutは成果物のみ
- **不合格例**: stdoutに混ざる

```yaml flowmark-item
id: TC-PUB-007
status: todo
```
- **意図**: publish -oでファイル出力できる
- **合格基準**: 指定ファイルに成果物、stdoutは空(または最小)
- **不合格例**: stdoutだけ/ファイル未作成

```yaml flowmark-item
id: TC-PUB-008
status: todo
```
- **意図**: publishはsync-registryを暗黙実行しない
- **合格基準**: registry不整合があればstrict errorで落ちる（自動修復しない）
- **不合格例**: 勝手に同期して通る

## Describe

```yaml flowmark-section
id: describe
```

仕様・語彙・チェックリストを出力する自己記述。v0.1.0はフィルタ無し（topic=checklist/vocab/capabilities）。

```yaml flowmark-item
id: TC-DES-001
status: todo
```
- **意図**: describe checklist（default md）
- **合格基準**: stdoutにMarkdownのチェックリスト、exit=0
- **不合格例**: 出力無し/exit!=0

```yaml flowmark-item
id: TC-DES-002
status: todo
```
- **意図**: describe checklist --format json
- **合格基準**: stdoutにJSON（機械可読）、exit=0
- **不合格例**: JSONでない/exit!=0

```yaml flowmark-item
id: TC-DES-003
status: todo
```
- **意図**: describe vocab --format json
- **合格基準**: stdoutに語彙一覧JSON（anchorage.*等を含む）、exit=0
- **不合格例**: 必要項目が無い

```yaml flowmark-item
id: TC-DES-004
status: todo
```
- **意図**: describe capabilities
- **合格基準**: stdoutに提供コマンド一覧とバージョン、exit=0
- **不合格例**: 一覧が無い

```yaml flowmark-item
id: TC-DES-005
status: todo
```
- **意図**: describe未知topicはusage error
- **合格基準**: exit=2、stderrにusage、stdout空
- **不合格例**: exit!=2

```yaml flowmark-item
id: TC-DES-006
status: todo
```
- **意図**: describe --format yaml
- **合格基準**: stdoutにYAML、exit=0
- **不合格例**: YAMLでない

## Operations / CLI I/O

```yaml flowmark-section
id: ops
```

stdin/stdout/exit code/diagnostics出力先などCLI運用のスモーク。Unixパイプで成果物とdiagnosticsを分離できること。

```yaml flowmark-item
id: TC-OPS-001
status: todo
```
- **意図**: 運用スモーク（パイプ/順序依存/性能）
- **合格基準**: 想定通り動作し続ける
- **不合格例**: パイプ破壊/順序仕様違反

```yaml flowmark-item
id: TC-OPS-002
status: todo
```
- **意図**: 運用スモーク（パイプ/順序依存/性能）
- **合格基準**: 想定通り動作し続ける
- **不合格例**: パイプ破壊/順序仕様違反

```yaml flowmark-item
id: TC-OPS-003
status: todo
```
- **意図**: 運用スモーク（パイプ/順序依存/性能）
- **合格基準**: 想定通り動作し続ける
- **不合格例**: パイプ破壊/順序仕様違反

```yaml flowmark-item
id: TC-IO-001
status: todo
```
- **意図**: infile省略時はstdinを読む（例：format）
- **合格基準**: stdin入力で処理される
- **不合格例**: ファイル必須扱いになる

```yaml flowmark-item
id: TC-IO-002
status: todo
```
- **意図**: <infile>に-指定でstdinを読む
- **合格基準**: -指定で処理される
- **不合格例**: -がファイル名扱いになる

```yaml flowmark-item
id: TC-IO-003
status: todo
```
- **意図**: -o省略時はstdoutへ成果物を出す
- **合格基準**: stdoutに成果物が出る
- **不合格例**: stdoutに出ない

```yaml flowmark-item
id: TC-IO-004
status: todo
```
- **意図**: validateはstdoutにNDJSON（成果物を出さない）
- **合格基準**: stdoutがNDJSONのみ、exit codeが仕様通り
- **不合格例**: 混在/非NDJSON

```yaml flowmark-item
id: TC-IO-005
status: todo
```
- **意図**: validate以外はdiagnosticsをstderrにNDJSONで出す
- **合格基準**: stderrにNDJSON、stdoutは成果物のみ
- **不合格例**: stdoutに混ざる

```yaml flowmark-item
id: TC-IO-006
status: todo
```
- **意図**: usage errorはexit code 2
- **合格基準**: 不正引数でexit=2、stderrにusage
- **不合格例**: exit=1/0
