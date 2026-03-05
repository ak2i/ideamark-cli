# Prompt: Reproduce USGS SIR 2024-5062 Chapter I as IdeaMark v1.0.3

## Inputs
- Source file: `./usgs_sir_2024_5062_volcano_monitoring_capabilities.md`
- Output file: `./usgs_sir_2024_5062_volcano_monitoring_capabilities.reproduced.ideamark.md`

## Baseline constraints (IdeaMark standard)
- Include strict header fields: `ideamark_version`, `doc_id`, `doc_type`, `status`, `created_at`, `updated_at`, `lang`.
- Keep IDs unique and references resolvable.
- Include `section`, `occurrence`, `registry` YAML blocks.
- Put machine-resolvable sources in `refs.sources[]`.
- Model provenance/citation as `entity` + `occurrence(role: citation)` linked by `supporting_evidence` and optional `target`.
- Create explicit reference entities/occurrences (at least report page, chapter PDF, and DOI) instead of a single aggregate citation only.

## Template extension policy
- If a template-specific reference profile exists, extend the baseline mapping instead of replacing it.

## Ordering and narrative constraints
- Render in local cluster order: `section -> that section's occurrences -> next section`.
- Occurrence order must follow each `section.occurrences` list.
- Keep Registry block at end.
- Add natural-language explanation after each section and occurrence YAML block.
- Avoid YAML-only output.

## Quality gate
- Must pass: `ideamark validate --mode strict ./usgs_sir_2024_5062_volcano_monitoring_capabilities.reproduced.ideamark.md`
