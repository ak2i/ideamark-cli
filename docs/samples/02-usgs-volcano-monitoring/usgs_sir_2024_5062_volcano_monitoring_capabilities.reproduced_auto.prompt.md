# Prompt: Reproduce USGS SIR 2024-5062 Chapter I as IdeaMark v1.1.1 YAML-first (reference_mode auto)

## Inputs
- Source file: `./usgs_sir_2024_5062_volcano_monitoring_capabilities.md`
- Output file: `./usgs_sir_2024_5062_volcano_monitoring_capabilities.reproduced_auto.ideamark.yaml`

## Core constraints
- Include strict header fields and keep IDs unique/resolvable.
- Use YAML-first output only.
- Place `entities`, `occurrences`, `sections`, `relations`, `perspectives`, and `structure` at the top level.
- Every entity must contain `payload`.
- Do not create a top-level `registry:` wrapper.

## Reference policy
- Use `reference_mode: auto`.
- If explicit references exist in source input, generate structured references.
- If references do not exist, references section may be omitted.
- Do not invent citations/URLs/DOIs.

## Minimum reference set (when references exist)
- Map sources into `refs.sources[]`.
- Create individual `IE-REF-*` and `OCC-REF-*` for major references (report page, chapter PDF, DOI).
- Add `SEC-USGS-REFERENCES` with `OCC-REF-*`.
- Keep aggregate `OCC-USGS-CITATION` linked to `IE-REF-*` via `supporting_evidence`.

## Quality gate
- Must pass: `ideamark validate --mode working ./usgs_sir_2024_5062_volcano_monitoring_capabilities.reproduced_auto.ideamark.yaml`
- Must pass: `ideamark validate --mode strict ./usgs_sir_2024_5062_volcano_monitoring_capabilities.reproduced_auto.ideamark.yaml`
