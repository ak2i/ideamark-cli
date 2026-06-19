# Prompt: Reproduce USGS SIR 2024-5062 Chapter I as IdeaMark v1.1.1

## Inputs
- Source file: `./usgs_sir_2024_5062_volcano_monitoring_capabilities.md`
- Output file: `./usgs_sir_2024_5062_volcano_monitoring_capabilities.reproduced.ideamark.yaml`

## Baseline constraints (IdeaMark standard)
- Include strict header fields: `ideamark_version`, `doc_id`, `doc_type`, `status`, `created_at`, `updated_at`, `lang`.
- Keep IDs unique and references resolvable.
- Include `entities`, `occurrences`, and `sections`.
- Ensure every entity has payload content.
- Put machine-resolvable sources in `refs.sources[]`.
- Model provenance/citation as `entity` + `occurrence(role: citation)` linked by `supporting_evidence` and optional `target`.
- Create explicit reference entities/occurrences (at least report page, chapter PDF, and DOI) instead of a single aggregate citation only.

## Template extension policy
- If a template-specific reference profile exists, extend the baseline mapping instead of replacing it.

## Structural constraints
- Use whole-document YAML output.
- Each occurrence must point to an existing entity.
- Each section must list existing occurrences.
- Keep `structure.sections` aligned when emitted.

## Quality gate
- Must pass: `ideamark validate --mode strict ./usgs_sir_2024_5062_volcano_monitoring_capabilities.reproduced.ideamark.yaml`
