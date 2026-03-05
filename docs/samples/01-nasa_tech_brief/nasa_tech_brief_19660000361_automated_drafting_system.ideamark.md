---
ideamark_version: 1
doc_id: "DOC-NASA-19660000361-ADS-003"
doc_type: "derived"
status:
  state: "in_progress"
created_at: "2026-03-05"
updated_at: "2026-03-05"
lang: "en-US"
refs:
  sources:
    - id: "SRC-NASA-19660000361"
      uri: "https://ntrs.nasa.gov/citations/19660000361"
      role: "source_material"
      description: "NASA NTRS citation record"
    - id: "SRC-NASA-19660000361-PDF"
      uri: "https://ntrs.nasa.gov/api/citations/19660000361/downloads/19660000361.pdf"
      role: "evidence"
      description: "NASA Tech Brief PDF"
---

# NASA Tech Brief 66-10362 (Structured)

This sample follows section-local ordering for readability: each section is immediately followed by its owned occurrences.

## Problem
```yaml
section_id: "SEC-NASA-ADS-PROBLEM"
anchorage:
  view: "problem"
  phase: "confirmed"
  domain: ["nasa", "drafting", "automation"]
occurrences:
  - "OCC-NASA-ADS-PROBLEM-TIME"
```

The source describes a manual drafting bottleneck where complex engineering diagrams required significant conversion work from freehand sketches.

```yaml
occurrence_id: "OCC-NASA-ADS-PROBLEM-TIME"
entity: "IE-NASA-ADS-PROBLEM"
role: "observation"
status:
  state: "confirmed"
supporting_evidence:
  - "IE-NASA-ADS-SOURCE-TEXT"
```

The reported baseline effort was approximately 12 to 15 hours per complex finished diagram.

## Solution
```yaml
section_id: "SEC-NASA-ADS-SOLUTION"
anchorage:
  view: "solution"
  phase: "confirmed"
  domain: ["nasa", "drafting", "automation"]
occurrences:
  - "OCC-NASA-ADS-SOLUTION-SYSTEM"
  - "OCC-NASA-ADS-PROCESS-PIPELINE"
```

The proposed system encodes symbols and coordinates into machine-processable data and automates final diagram reproduction.

```yaml
occurrence_id: "OCC-NASA-ADS-SOLUTION-SYSTEM"
entity: "IE-NASA-ADS-SOLUTION"
role: "solution"
status:
  state: "confirmed"
supporting_evidence:
  - "IE-NASA-ADS-SOURCE-TEXT"
```

This occurrence records the core intervention: high-speed photocomposition driven by coded drafting input.

```yaml
occurrence_id: "OCC-NASA-ADS-PROCESS-PIPELINE"
entity: "IE-NASA-ADS-PROCESS"
role: "explanation"
status:
  state: "confirmed"
target: "IE-NASA-ADS-SOLUTION"
supporting_evidence:
  - "IE-NASA-ADS-SOURCE-TEXT"
```

The pipeline proceeds from coded sketch annotations to raw tape, then to computer transformation and punched output tape for photocomposition control.

## Outcome
```yaml
section_id: "SEC-NASA-ADS-OUTCOME"
anchorage:
  view: "background"
  phase: "confirmed"
  domain: ["nasa", "cost", "productivity"]
occurrences:
  - "OCC-NASA-ADS-OUTCOME-SAVINGS"
  - "OCC-NASA-ADS-PROVENANCE"
```

The brief reports both throughput improvement and estimated cost impact, and it includes clear attribution details.

```yaml
occurrence_id: "OCC-NASA-ADS-OUTCOME-SAVINGS"
entity: "IE-NASA-ADS-OUTCOME"
role: "observation"
status:
  state: "confirmed"
supporting_evidence:
  - "IE-NASA-ADS-SOURCE-TEXT"
```

The stated output time is about 3 to 4 hours for complex diagrams, with estimated savings exceeding $140,000 in one 6,600-drawing program.

```yaml
occurrence_id: "OCC-NASA-ADS-PROVENANCE"
entity: "IE-NASA-ADS-PROVENANCE"
role: "citation"
status:
  state: "confirmed"
target: "IE-NASA-ADS-SOURCE-TEXT"
supporting_evidence:
  - "IE-NASA-ADS-SOURCE-TEXT"
```

This occurrence preserves source lineage including brief number, author, and institutional context.

## Registry
```yaml
entities:
  IE-NASA-ADS-PROBLEM:
    kind: "observation"
    content: "Complex schematic and block diagrams were manually drafted from freehand design sketches, taking about 12-15 hours per complex diagram."
  IE-NASA-ADS-SOLUTION:
    kind: "solution"
    content: "An automated drafting system encoded conventional symbols and coordinates and drove a high-speed photocomposition machine."
  IE-NASA-ADS-PROCESS:
    kind: "mechanism"
    content: "Marked sketch codes were translated to machine language, converted to raw tape, expanded by computer, then punched into output tape for photocomposition control."
  IE-NASA-ADS-OUTCOME:
    kind: "outcome"
    content: "Complex diagrams were produced in about 3-4 hours, and one program projected savings above $140,000 over approximately 6,600 D-size drawings."
  IE-NASA-ADS-PROVENANCE:
    kind: "context"
    content: "Source attribution includes Donald H. Millenson, NASA Tech Brief 66-10362 (MFS-788), and Marshall Space Flight Center contract context."
  IE-NASA-ADS-SOURCE-TEXT:
    kind: "evidence"
    content: "Extracted text from NTRS citation 19660000361 and its PDF document."
occurrences:
  OCC-NASA-ADS-PROBLEM-TIME:
    occurrence_id: "OCC-NASA-ADS-PROBLEM-TIME"
    entity: "IE-NASA-ADS-PROBLEM"
    role: "observation"
    status:
      state: "confirmed"
    supporting_evidence: ["IE-NASA-ADS-SOURCE-TEXT"]
  OCC-NASA-ADS-SOLUTION-SYSTEM:
    occurrence_id: "OCC-NASA-ADS-SOLUTION-SYSTEM"
    entity: "IE-NASA-ADS-SOLUTION"
    role: "solution"
    status:
      state: "confirmed"
    supporting_evidence: ["IE-NASA-ADS-SOURCE-TEXT"]
  OCC-NASA-ADS-PROCESS-PIPELINE:
    occurrence_id: "OCC-NASA-ADS-PROCESS-PIPELINE"
    entity: "IE-NASA-ADS-PROCESS"
    role: "explanation"
    status:
      state: "confirmed"
    target: "IE-NASA-ADS-SOLUTION"
    supporting_evidence: ["IE-NASA-ADS-SOURCE-TEXT"]
  OCC-NASA-ADS-OUTCOME-SAVINGS:
    occurrence_id: "OCC-NASA-ADS-OUTCOME-SAVINGS"
    entity: "IE-NASA-ADS-OUTCOME"
    role: "observation"
    status:
      state: "confirmed"
    supporting_evidence: ["IE-NASA-ADS-SOURCE-TEXT"]
  OCC-NASA-ADS-PROVENANCE:
    occurrence_id: "OCC-NASA-ADS-PROVENANCE"
    entity: "IE-NASA-ADS-PROVENANCE"
    role: "citation"
    status:
      state: "confirmed"
    target: "IE-NASA-ADS-SOURCE-TEXT"
    supporting_evidence: ["IE-NASA-ADS-SOURCE-TEXT"]
sections:
  SEC-NASA-ADS-PROBLEM:
    anchorage:
      view: "problem"
      phase: "confirmed"
      domain: ["nasa", "drafting", "automation"]
    occurrences:
      - "OCC-NASA-ADS-PROBLEM-TIME"
  SEC-NASA-ADS-SOLUTION:
    anchorage:
      view: "solution"
      phase: "confirmed"
      domain: ["nasa", "drafting", "automation"]
    occurrences:
      - "OCC-NASA-ADS-SOLUTION-SYSTEM"
      - "OCC-NASA-ADS-PROCESS-PIPELINE"
  SEC-NASA-ADS-OUTCOME:
    anchorage:
      view: "background"
      phase: "confirmed"
      domain: ["nasa", "cost", "productivity"]
    occurrences:
      - "OCC-NASA-ADS-OUTCOME-SAVINGS"
      - "OCC-NASA-ADS-PROVENANCE"
structure:
  sections:
    - "SEC-NASA-ADS-PROBLEM"
    - "SEC-NASA-ADS-SOLUTION"
    - "SEC-NASA-ADS-OUTCOME"
```
