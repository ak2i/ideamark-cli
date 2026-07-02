# Prompt: Reproduce USGS SIR 2024-5062 Chapter I as IdeaMark v1.1.1 YAML-first

## Inputs
- Source file: `./usgs_sir_2024_5062_volcano_monitoring_capabilities.md`
- Output file: `./usgs_sir_2024_5062_volcano_monitoring_capabilities.reproduced.ideamark.yaml`

## Baseline constraints
- Include strict header fields: `ideamark_version`, `doc_id`, `doc_type`, `status`, `created_at`, `updated_at`, `lang`.
- Use YAML-first output only. Do not produce Markdown-embedded IdeaMark.
- Keep IDs unique and references resolvable.
- Place `entities`, `occurrences`, `sections`, `relations`, `perspectives`, and `structure` at the top level.
- Put machine-resolvable sources in `refs.sources[]`.
- Model provenance/citation as `entity` + `occurrence(role: citation)` linked by `supporting_evidence` and optional `target`.
- Create explicit reference entities/occurrences (at least report page, chapter PDF, and DOI) instead of a single aggregate citation only.

## Template extension policy
- If a template-specific reference profile exists, extend the baseline mapping instead of replacing it.

## Payload and reference constraints
- Every entity must include `payload`.
- Every payload must include at least one of `body`, `ref`, or `cache`.
- If `payload.ref` exists, include `payload.ref.uri`.
- Do not create a top-level `registry:` wrapper.

## Quality gate
- Must pass: `ideamark validate --mode working ./usgs_sir_2024_5062_volcano_monitoring_capabilities.reproduced.ideamark.yaml`
- Must pass: `ideamark validate --mode strict ./usgs_sir_2024_5062_volcano_monitoring_capabilities.reproduced.ideamark.yaml`
