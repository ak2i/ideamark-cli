---
ideamark_version: 1
doc_id: "DOC-USGS-SIR-2024-5062-I-REPRO-AUTO-001"
doc_type: "derived"
status:
  state: "in_progress"
created_at: "2026-03-05"
updated_at: "2026-03-05"
lang: "en-US"
refs:
  sources:
    - id: "SRC-USGS-SIR-2024-5062"
      uri: "https://pubs.usgs.gov/sir/2024/5062/"
      role: "source_material"
      description: "USGS SIR 2024-5062 landing page"
    - id: "SRC-USGS-SIR-2024-5062-I-PDF"
      uri: "https://pubs.usgs.gov/sir/2024/5062/i/sir20245062i.pdf"
      role: "evidence"
      description: "Chapter I PDF"
    - id: "SRC-USGS-SIR-2024-5062-I-DOI"
      uri: "https://doi.org/10.3133/sir20245062I"
      role: "evidence"
      description: "Chapter I DOI"
---

# USGS SIR 2024-5062 Chapter I (reference_mode auto)

This output applies the auto reference policy. Because explicit references exist in the source metadata, structured references are generated.

## Submarine Monitoring Context
```yaml
section_id: "SEC-USGS-CONTEXT"
anchorage:
  view: "background"
  phase: "confirmed"
  domain: ["usgs", "marine-volcano", "context"]
occurrences:
  - "OCC-USGS-CONTEXT-CHALLENGES"
  - "OCC-USGS-CONTEXT-HAZARDS"
```

The chapter describes marine-monitoring constraints and hazards associated with submarine volcanic activity.

```yaml
occurrence_id: "OCC-USGS-CONTEXT-CHALLENGES"
entity: "IE-USGS-CONTEXT-CHALLENGES"
role: "observation"
status:
  state: "confirmed"
supporting_evidence:
  - "IE-USGS-SOURCE-TEXT"
```

Marine environments make continuous detection harder because instrumentation and telemetry are more difficult than many land-based contexts.

```yaml
occurrence_id: "OCC-USGS-CONTEXT-HAZARDS"
entity: "IE-USGS-CONTEXT-HAZARDS"
role: "observation"
status:
  state: "confirmed"
supporting_evidence:
  - "IE-USGS-SOURCE-TEXT"
```

The source identifies hazard potential including significant plume and marine impacts from submarine eruptions.

## Regional Detection Capabilities
```yaml
section_id: "SEC-USGS-REGIONAL-DETECTION"
anchorage:
  view: "solution"
  phase: "confirmed"
  domain: ["usgs", "hydroacoustics", "regional-monitoring"]
occurrences:
  - "OCC-USGS-REGIONAL-TPHASE"
  - "OCC-USGS-REGIONAL-NETWORKS"
  - "OCC-USGS-REGIONAL-REMOTE-SENSING"
```

Regional detection relies on hydroacoustic and seismic pathways, with remote sensing used as a complement for surface manifestations.

```yaml
occurrence_id: "OCC-USGS-REGIONAL-TPHASE"
entity: "IE-USGS-REGIONAL-TPHASE"
role: "explanation"
status:
  state: "confirmed"
supporting_evidence:
  - "IE-USGS-SOURCE-TEXT"
```

T-phase propagation enables long-range submarine event detection in ocean basins.

```yaml
occurrence_id: "OCC-USGS-REGIONAL-NETWORKS"
entity: "IE-USGS-REGIONAL-NETWORKS"
role: "solution"
status:
  state: "confirmed"
supporting_evidence:
  - "IE-USGS-SOURCE-TEXT"
```

Network examples include hydrophone arrays and T-phase-sensitive seismic systems.

```yaml
occurrence_id: "OCC-USGS-REGIONAL-REMOTE-SENSING"
entity: "IE-USGS-REGIONAL-REMOTE-SENSING"
role: "solution"
status:
  state: "confirmed"
supporting_evidence:
  - "IE-USGS-SOURCE-TEXT"
```

Satellite and aerial sensing can detect discolored water, plumes, and other eruption indicators.

## Instrumentation Recommendations
```yaml
section_id: "SEC-USGS-INSTRUMENTATION"
anchorage:
  view: "solution"
  phase: "confirmed"
  domain: ["usgs", "instrumentation", "recommendations"]
occurrences:
  - "OCC-USGS-INST-CORE-SENSORS"
  - "OCC-USGS-INST-TELEMETRY-CONSTRAINTS"
  - "OCC-USGS-INST-EMERGING-OPTIONS"
```

The chapter recommends marine-focused sensor suites and discusses real-time operation limits and future options.

```yaml
occurrence_id: "OCC-USGS-INST-CORE-SENSORS"
entity: "IE-USGS-INST-CORE-SENSORS"
role: "solution"
status:
  state: "confirmed"
supporting_evidence:
  - "IE-USGS-SOURCE-TEXT"
```

Ocean-bottom pressure, OBS, and hydrophones form the core instrumentation stack.

```yaml
occurrence_id: "OCC-USGS-INST-TELEMETRY-CONSTRAINTS"
entity: "IE-USGS-INST-TELEMETRY-CONSTRAINTS"
role: "constraint"
status:
  state: "confirmed"
supporting_evidence:
  - "IE-USGS-SOURCE-TEXT"
```

Cost and technical limits commonly constrain continuous real-time marine telemetry.

```yaml
occurrence_id: "OCC-USGS-INST-EMERGING-OPTIONS"
entity: "IE-USGS-INST-EMERGING-OPTIONS"
role: "observation"
status:
  state: "confirmed"
supporting_evidence:
  - "IE-USGS-SOURCE-TEXT"
```

Emerging approaches include gliders/floats and fiber-optic sensing methods for future monitoring expansion.

## Structured References
```yaml
section_id: "SEC-USGS-REFERENCES"
anchorage:
  view: "background"
  phase: "confirmed"
  domain: ["usgs", "references", "citation"]
occurrences:
  - "OCC-USGS-REF-REPORT-PAGE"
  - "OCC-USGS-REF-CHAPTER-PDF"
  - "OCC-USGS-REF-DOI"
  - "OCC-USGS-CITATION"
```

This section stores explicit source references and one aggregate citation link.

```yaml
occurrence_id: "OCC-USGS-REF-REPORT-PAGE"
entity: "IE-USGS-REF-REPORT-PAGE"
role: "citation"
status:
  state: "confirmed"
supporting_evidence:
  - "IE-USGS-REF-REPORT-PAGE"
```

Report landing page reference.

```yaml
occurrence_id: "OCC-USGS-REF-CHAPTER-PDF"
entity: "IE-USGS-REF-CHAPTER-PDF"
role: "citation"
status:
  state: "confirmed"
supporting_evidence:
  - "IE-USGS-REF-CHAPTER-PDF"
```

Chapter PDF reference used for extraction.

```yaml
occurrence_id: "OCC-USGS-REF-DOI"
entity: "IE-USGS-REF-DOI"
role: "citation"
status:
  state: "confirmed"
supporting_evidence:
  - "IE-USGS-REF-DOI"
```

DOI reference for chapter citation.

```yaml
occurrence_id: "OCC-USGS-CITATION"
entity: "IE-USGS-CITATION"
role: "citation"
status:
  state: "confirmed"
target: "IE-USGS-SOURCE-TEXT"
supporting_evidence:
  - "IE-USGS-REF-REPORT-PAGE"
  - "IE-USGS-REF-CHAPTER-PDF"
  - "IE-USGS-REF-DOI"
```

Aggregate citation that connects provenance summary to explicit references.

## Registry
```yaml
entities:
  IE-USGS-CONTEXT-CHALLENGES:
    kind: "context"
    content: "Submarine monitoring is constrained by marine deployment and telemetry conditions, reducing continuous observability."
  IE-USGS-CONTEXT-HAZARDS:
    kind: "risk"
    content: "Submarine eruptions may produce hazardous impacts including large plumes and marine disruptions."
  IE-USGS-REGIONAL-TPHASE:
    kind: "mechanism"
    content: "Hydroacoustic T-phases support long-distance detection of submarine volcanic activity."
  IE-USGS-REGIONAL-NETWORKS:
    kind: "solution"
    content: "Regional monitoring uses hydrophone arrays and seismic networks, including T-phase-sensitive configurations."
  IE-USGS-REGIONAL-REMOTE-SENSING:
    kind: "solution"
    content: "Satellite and aerial sensing provide complementary detection of surficial eruption indicators."
  IE-USGS-INST-CORE-SENSORS:
    kind: "solution"
    content: "Core instrumentation includes ocean-bottom pressure sensors, OBS, and hydrophones."
  IE-USGS-INST-TELEMETRY-CONSTRAINTS:
    kind: "constraint"
    content: "Real-time marine telemetry is often constrained by cost and technical limits."
  IE-USGS-INST-EMERGING-OPTIONS:
    kind: "structural_hypothesis"
    content: "Emerging methods may improve future submarine monitoring coverage."
  IE-USGS-REF-REPORT-PAGE:
    kind: "evidence"
    content: "USGS report page: https://pubs.usgs.gov/sir/2024/5062/"
  IE-USGS-REF-CHAPTER-PDF:
    kind: "evidence"
    content: "USGS chapter PDF: https://pubs.usgs.gov/sir/2024/5062/i/sir20245062i.pdf"
  IE-USGS-REF-DOI:
    kind: "evidence"
    content: "USGS chapter DOI: https://doi.org/10.3133/sir20245062I"
  IE-USGS-CITATION:
    kind: "context"
    content: "Chapter I Monitoring Marine Eruptions by Gabrielle Tepp in USGS SIR 2024-5062, linked to report page, chapter PDF, and DOI references."
  IE-USGS-SOURCE-TEXT:
    kind: "evidence"
    content: "Extracted text from USGS SIR 2024-5062 Chapter I source materials."
occurrences:
  OCC-USGS-CONTEXT-CHALLENGES:
    occurrence_id: "OCC-USGS-CONTEXT-CHALLENGES"
    entity: "IE-USGS-CONTEXT-CHALLENGES"
    role: "observation"
    status: { state: "confirmed" }
    supporting_evidence: ["IE-USGS-SOURCE-TEXT"]
  OCC-USGS-CONTEXT-HAZARDS:
    occurrence_id: "OCC-USGS-CONTEXT-HAZARDS"
    entity: "IE-USGS-CONTEXT-HAZARDS"
    role: "observation"
    status: { state: "confirmed" }
    supporting_evidence: ["IE-USGS-SOURCE-TEXT"]
  OCC-USGS-REGIONAL-TPHASE:
    occurrence_id: "OCC-USGS-REGIONAL-TPHASE"
    entity: "IE-USGS-REGIONAL-TPHASE"
    role: "explanation"
    status: { state: "confirmed" }
    supporting_evidence: ["IE-USGS-SOURCE-TEXT"]
  OCC-USGS-REGIONAL-NETWORKS:
    occurrence_id: "OCC-USGS-REGIONAL-NETWORKS"
    entity: "IE-USGS-REGIONAL-NETWORKS"
    role: "solution"
    status: { state: "confirmed" }
    supporting_evidence: ["IE-USGS-SOURCE-TEXT"]
  OCC-USGS-REGIONAL-REMOTE-SENSING:
    occurrence_id: "OCC-USGS-REGIONAL-REMOTE-SENSING"
    entity: "IE-USGS-REGIONAL-REMOTE-SENSING"
    role: "solution"
    status: { state: "confirmed" }
    supporting_evidence: ["IE-USGS-SOURCE-TEXT"]
  OCC-USGS-INST-CORE-SENSORS:
    occurrence_id: "OCC-USGS-INST-CORE-SENSORS"
    entity: "IE-USGS-INST-CORE-SENSORS"
    role: "solution"
    status: { state: "confirmed" }
    supporting_evidence: ["IE-USGS-SOURCE-TEXT"]
  OCC-USGS-INST-TELEMETRY-CONSTRAINTS:
    occurrence_id: "OCC-USGS-INST-TELEMETRY-CONSTRAINTS"
    entity: "IE-USGS-INST-TELEMETRY-CONSTRAINTS"
    role: "constraint"
    status: { state: "confirmed" }
    supporting_evidence: ["IE-USGS-SOURCE-TEXT"]
  OCC-USGS-INST-EMERGING-OPTIONS:
    occurrence_id: "OCC-USGS-INST-EMERGING-OPTIONS"
    entity: "IE-USGS-INST-EMERGING-OPTIONS"
    role: "observation"
    status: { state: "confirmed" }
    supporting_evidence: ["IE-USGS-SOURCE-TEXT"]
  OCC-USGS-REF-REPORT-PAGE:
    occurrence_id: "OCC-USGS-REF-REPORT-PAGE"
    entity: "IE-USGS-REF-REPORT-PAGE"
    role: "citation"
    status: { state: "confirmed" }
    supporting_evidence: ["IE-USGS-REF-REPORT-PAGE"]
  OCC-USGS-REF-CHAPTER-PDF:
    occurrence_id: "OCC-USGS-REF-CHAPTER-PDF"
    entity: "IE-USGS-REF-CHAPTER-PDF"
    role: "citation"
    status: { state: "confirmed" }
    supporting_evidence: ["IE-USGS-REF-CHAPTER-PDF"]
  OCC-USGS-REF-DOI:
    occurrence_id: "OCC-USGS-REF-DOI"
    entity: "IE-USGS-REF-DOI"
    role: "citation"
    status: { state: "confirmed" }
    supporting_evidence: ["IE-USGS-REF-DOI"]
  OCC-USGS-CITATION:
    occurrence_id: "OCC-USGS-CITATION"
    entity: "IE-USGS-CITATION"
    role: "citation"
    status: { state: "confirmed" }
    target: "IE-USGS-SOURCE-TEXT"
    supporting_evidence:
      - "IE-USGS-REF-REPORT-PAGE"
      - "IE-USGS-REF-CHAPTER-PDF"
      - "IE-USGS-REF-DOI"
sections:
  SEC-USGS-CONTEXT:
    anchorage: { view: "background", phase: "confirmed", domain: ["usgs", "marine-volcano", "context"] }
    occurrences: ["OCC-USGS-CONTEXT-CHALLENGES", "OCC-USGS-CONTEXT-HAZARDS"]
  SEC-USGS-REGIONAL-DETECTION:
    anchorage: { view: "solution", phase: "confirmed", domain: ["usgs", "hydroacoustics", "regional-monitoring"] }
    occurrences: ["OCC-USGS-REGIONAL-TPHASE", "OCC-USGS-REGIONAL-NETWORKS", "OCC-USGS-REGIONAL-REMOTE-SENSING"]
  SEC-USGS-INSTRUMENTATION:
    anchorage: { view: "solution", phase: "confirmed", domain: ["usgs", "instrumentation", "recommendations"] }
    occurrences: ["OCC-USGS-INST-CORE-SENSORS", "OCC-USGS-INST-TELEMETRY-CONSTRAINTS", "OCC-USGS-INST-EMERGING-OPTIONS"]
  SEC-USGS-REFERENCES:
    anchorage: { view: "background", phase: "confirmed", domain: ["usgs", "references", "citation"] }
    occurrences: ["OCC-USGS-REF-REPORT-PAGE", "OCC-USGS-REF-CHAPTER-PDF", "OCC-USGS-REF-DOI", "OCC-USGS-CITATION"]
structure:
  sections:
    - "SEC-USGS-CONTEXT"
    - "SEC-USGS-REGIONAL-DETECTION"
    - "SEC-USGS-INSTRUMENTATION"
    - "SEC-USGS-REFERENCES"
```
