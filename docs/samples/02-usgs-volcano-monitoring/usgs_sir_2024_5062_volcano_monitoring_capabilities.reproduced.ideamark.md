---
ideamark_version: 1
doc_id: "DOC-USGS-SIR-2024-5062-I-REPRO-001"
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
      description: "USGS Scientific Investigations Report 2024-5062 landing page"
    - id: "SRC-USGS-SIR-2024-5062-I-PDF"
      uri: "https://pubs.usgs.gov/sir/2024/5062/i/sir20245062i.pdf"
      role: "evidence"
      description: "Chapter I PDF: Monitoring Marine Eruptions"
    - id: "SRC-USGS-SIR-2024-5062-I-DOI"
      uri: "https://doi.org/10.3133/sir20245062I"
      role: "evidence"
      description: "Chapter I DOI citation"
---

# USGS SIR 2024-5062 Chapter I (Reproduced Sample)

This document reproduces the USGS chapter as strict-valid IdeaMark using the current prompt-authoring rules.

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

The chapter explains that submarine volcanoes can produce significant hazards, while detection is often harder than in subaerial settings due to marine operating constraints.

```yaml
occurrence_id: "OCC-USGS-CONTEXT-CHALLENGES"
entity: "IE-USGS-CONTEXT-CHALLENGES"
role: "observation"
status:
  state: "confirmed"
supporting_evidence:
  - "IE-USGS-SOURCE-TEXT"
```

Monitoring coverage is limited by deployment complexity, cost, and sparse real-time marine infrastructure.

```yaml
occurrence_id: "OCC-USGS-CONTEXT-HAZARDS"
entity: "IE-USGS-CONTEXT-HAZARDS"
role: "observation"
status:
  state: "confirmed"
supporting_evidence:
  - "IE-USGS-SOURCE-TEXT"
```

The source describes hazards including eruptive plumes, marine disruption, and broad regional impacts from major submarine events.

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

The chapter emphasizes T-phase and seismic signals for regional monitoring, with complementary use of satellite and aerial methods for surface indicators.

```yaml
occurrence_id: "OCC-USGS-REGIONAL-TPHASE"
entity: "IE-USGS-REGIONAL-TPHASE"
role: "explanation"
status:
  state: "confirmed"
supporting_evidence:
  - "IE-USGS-SOURCE-TEXT"
```

Hydroacoustic propagation in the ocean supports long-distance detection of submarine activity, often beyond the practical reach of many direct seismic observations.

```yaml
occurrence_id: "OCC-USGS-REGIONAL-NETWORKS"
entity: "IE-USGS-REGIONAL-NETWORKS"
role: "solution"
status:
  state: "confirmed"
supporting_evidence:
  - "IE-USGS-SOURCE-TEXT"
```

Regional capabilities are linked to hydrophone arrays and seismic networks, including systems optimized for T-phase detection.

```yaml
occurrence_id: "OCC-USGS-REGIONAL-REMOTE-SENSING"
entity: "IE-USGS-REGIONAL-REMOTE-SENSING"
role: "solution"
status:
  state: "confirmed"
supporting_evidence:
  - "IE-USGS-SOURCE-TEXT"
```

Satellite and aerial observations are useful for identifying signs such as discolored water, plumes, and other surficial indicators of ongoing or recent eruptions.

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

USGS recommends marine-based instrumentation as primary for submarine settings, while acknowledging operational constraints and future technical opportunities.

```yaml
occurrence_id: "OCC-USGS-INST-CORE-SENSORS"
entity: "IE-USGS-INST-CORE-SENSORS"
role: "solution"
status:
  state: "confirmed"
supporting_evidence:
  - "IE-USGS-SOURCE-TEXT"
```

The chapter identifies ocean-bottom pressure sensors, OBS instruments, and hydrophones as key elements, with additional water-property sensors where needed.

```yaml
occurrence_id: "OCC-USGS-INST-TELEMETRY-CONSTRAINTS"
entity: "IE-USGS-INST-TELEMETRY-CONSTRAINTS"
role: "constraint"
status:
  state: "confirmed"
supporting_evidence:
  - "IE-USGS-SOURCE-TEXT"
```

Real-time marine telemetry is possible but often limited by cost and technical constraints, so campaign-style deployment remains common.

```yaml
occurrence_id: "OCC-USGS-INST-EMERGING-OPTIONS"
entity: "IE-USGS-INST-EMERGING-OPTIONS"
role: "observation"
status:
  state: "confirmed"
supporting_evidence:
  - "IE-USGS-SOURCE-TEXT"
```

Emerging methods such as hydrophone-equipped gliders/floats and fiber-optic sensing are presented as candidate future enhancements.

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

This section stores individual reference targets as explicit entities/occurrences, then links an aggregate citation record to them.

```yaml
occurrence_id: "OCC-USGS-REF-REPORT-PAGE"
entity: "IE-USGS-REF-REPORT-PAGE"
role: "citation"
status:
  state: "confirmed"
supporting_evidence:
  - "IE-USGS-REF-REPORT-PAGE"
```

This occurrence captures the canonical report landing page reference.

```yaml
occurrence_id: "OCC-USGS-REF-CHAPTER-PDF"
entity: "IE-USGS-REF-CHAPTER-PDF"
role: "citation"
status:
  state: "confirmed"
supporting_evidence:
  - "IE-USGS-REF-CHAPTER-PDF"
```

This occurrence captures the chapter PDF reference used for extraction.

```yaml
occurrence_id: "OCC-USGS-REF-DOI"
entity: "IE-USGS-REF-DOI"
role: "citation"
status:
  state: "confirmed"
supporting_evidence:
  - "IE-USGS-REF-DOI"
```

This occurrence captures the chapter DOI-level reference.

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

This aggregate citation occurrence links provenance metadata to explicit reference entities.

## Registry
```yaml
entities:
  IE-USGS-CONTEXT-CHALLENGES:
    kind: "context"
    content: "Submarine volcano monitoring faces distinct marine-environment constraints that reduce continuous observation and can delay eruption recognition."
  IE-USGS-CONTEXT-HAZARDS:
    kind: "risk"
    content: "Submarine eruptions can create substantial hazards including major plumes, marine disruption, and regionally significant impacts."
  IE-USGS-REGIONAL-TPHASE:
    kind: "mechanism"
    content: "Hydroacoustic T-phase propagation enables long-range detection of submarine volcanic activity in ocean basins."
  IE-USGS-REGIONAL-NETWORKS:
    kind: "solution"
    content: "Regional detection uses hydrophone arrays and seismic networks, including systems optimized for T-phase sensing."
  IE-USGS-REGIONAL-REMOTE-SENSING:
    kind: "solution"
    content: "Satellite and aerial observations complement instrument networks by identifying surficial eruption indicators."
  IE-USGS-INST-CORE-SENSORS:
    kind: "solution"
    content: "Core marine monitoring includes ocean-bottom pressure, ocean-bottom seismometers, and hydrophones, with optional chemistry/temperature/turbidity support sensors."
  IE-USGS-INST-TELEMETRY-CONSTRAINTS:
    kind: "constraint"
    content: "Real-time marine telemetry can be technically feasible but is often constrained by cost and deployment complexity."
  IE-USGS-INST-EMERGING-OPTIONS:
    kind: "structural_hypothesis"
    content: "Emerging marine monitoring approaches, including autonomous and fiber-optic methods, may improve future coverage."
  IE-USGS-CITATION:
    kind: "context"
    content: "Chapter I Monitoring Marine Eruptions by Gabrielle Tepp in USGS Scientific Investigations Report 2024-5062, with chapter citation and DOI references in source front matter."
  IE-USGS-REF-REPORT-PAGE:
    kind: "evidence"
    content: "USGS report page: https://pubs.usgs.gov/sir/2024/5062/"
  IE-USGS-REF-CHAPTER-PDF:
    kind: "evidence"
    content: "USGS chapter PDF: https://pubs.usgs.gov/sir/2024/5062/i/sir20245062i.pdf"
  IE-USGS-REF-DOI:
    kind: "evidence"
    content: "USGS chapter DOI: https://doi.org/10.3133/sir20245062I"
  IE-USGS-SOURCE-TEXT:
    kind: "evidence"
    content: "Extracted text from USGS SIR 2024-5062 Chapter I PDF and metadata section."
occurrences:
  OCC-USGS-CONTEXT-CHALLENGES:
    occurrence_id: "OCC-USGS-CONTEXT-CHALLENGES"
    entity: "IE-USGS-CONTEXT-CHALLENGES"
    role: "observation"
    status:
      state: "confirmed"
    supporting_evidence: ["IE-USGS-SOURCE-TEXT"]
  OCC-USGS-CONTEXT-HAZARDS:
    occurrence_id: "OCC-USGS-CONTEXT-HAZARDS"
    entity: "IE-USGS-CONTEXT-HAZARDS"
    role: "observation"
    status:
      state: "confirmed"
    supporting_evidence: ["IE-USGS-SOURCE-TEXT"]
  OCC-USGS-REGIONAL-TPHASE:
    occurrence_id: "OCC-USGS-REGIONAL-TPHASE"
    entity: "IE-USGS-REGIONAL-TPHASE"
    role: "explanation"
    status:
      state: "confirmed"
    supporting_evidence: ["IE-USGS-SOURCE-TEXT"]
  OCC-USGS-REGIONAL-NETWORKS:
    occurrence_id: "OCC-USGS-REGIONAL-NETWORKS"
    entity: "IE-USGS-REGIONAL-NETWORKS"
    role: "solution"
    status:
      state: "confirmed"
    supporting_evidence: ["IE-USGS-SOURCE-TEXT"]
  OCC-USGS-REGIONAL-REMOTE-SENSING:
    occurrence_id: "OCC-USGS-REGIONAL-REMOTE-SENSING"
    entity: "IE-USGS-REGIONAL-REMOTE-SENSING"
    role: "solution"
    status:
      state: "confirmed"
    supporting_evidence: ["IE-USGS-SOURCE-TEXT"]
  OCC-USGS-INST-CORE-SENSORS:
    occurrence_id: "OCC-USGS-INST-CORE-SENSORS"
    entity: "IE-USGS-INST-CORE-SENSORS"
    role: "solution"
    status:
      state: "confirmed"
    supporting_evidence: ["IE-USGS-SOURCE-TEXT"]
  OCC-USGS-INST-TELEMETRY-CONSTRAINTS:
    occurrence_id: "OCC-USGS-INST-TELEMETRY-CONSTRAINTS"
    entity: "IE-USGS-INST-TELEMETRY-CONSTRAINTS"
    role: "constraint"
    status:
      state: "confirmed"
    supporting_evidence: ["IE-USGS-SOURCE-TEXT"]
  OCC-USGS-INST-EMERGING-OPTIONS:
    occurrence_id: "OCC-USGS-INST-EMERGING-OPTIONS"
    entity: "IE-USGS-INST-EMERGING-OPTIONS"
    role: "observation"
    status:
      state: "confirmed"
    supporting_evidence: ["IE-USGS-SOURCE-TEXT"]
  OCC-USGS-REF-REPORT-PAGE:
    occurrence_id: "OCC-USGS-REF-REPORT-PAGE"
    entity: "IE-USGS-REF-REPORT-PAGE"
    role: "citation"
    status:
      state: "confirmed"
    supporting_evidence: ["IE-USGS-REF-REPORT-PAGE"]
  OCC-USGS-REF-CHAPTER-PDF:
    occurrence_id: "OCC-USGS-REF-CHAPTER-PDF"
    entity: "IE-USGS-REF-CHAPTER-PDF"
    role: "citation"
    status:
      state: "confirmed"
    supporting_evidence: ["IE-USGS-REF-CHAPTER-PDF"]
  OCC-USGS-REF-DOI:
    occurrence_id: "OCC-USGS-REF-DOI"
    entity: "IE-USGS-REF-DOI"
    role: "citation"
    status:
      state: "confirmed"
    supporting_evidence: ["IE-USGS-REF-DOI"]
  OCC-USGS-CITATION:
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
sections:
  SEC-USGS-CONTEXT:
    anchorage:
      view: "background"
      phase: "confirmed"
      domain: ["usgs", "marine-volcano", "context"]
    occurrences:
      - "OCC-USGS-CONTEXT-CHALLENGES"
      - "OCC-USGS-CONTEXT-HAZARDS"
  SEC-USGS-REGIONAL-DETECTION:
    anchorage:
      view: "solution"
      phase: "confirmed"
      domain: ["usgs", "hydroacoustics", "regional-monitoring"]
    occurrences:
      - "OCC-USGS-REGIONAL-TPHASE"
      - "OCC-USGS-REGIONAL-NETWORKS"
      - "OCC-USGS-REGIONAL-REMOTE-SENSING"
  SEC-USGS-INSTRUMENTATION:
    anchorage:
      view: "solution"
      phase: "confirmed"
      domain: ["usgs", "instrumentation", "recommendations"]
    occurrences:
      - "OCC-USGS-INST-CORE-SENSORS"
      - "OCC-USGS-INST-TELEMETRY-CONSTRAINTS"
      - "OCC-USGS-INST-EMERGING-OPTIONS"
  SEC-USGS-REFERENCES:
    anchorage:
      view: "background"
      phase: "confirmed"
      domain: ["usgs", "references", "citation"]
    occurrences:
      - "OCC-USGS-REF-REPORT-PAGE"
      - "OCC-USGS-REF-CHAPTER-PDF"
      - "OCC-USGS-REF-DOI"
      - "OCC-USGS-CITATION"
structure:
  sections:
    - "SEC-USGS-CONTEXT"
    - "SEC-USGS-REGIONAL-DETECTION"
    - "SEC-USGS-INSTRUMENTATION"
    - "SEC-USGS-REFERENCES"
```
