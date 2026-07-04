# Part 2 — Architecture of Human-AI Co-evolution

**Version:** IdeaMark Core v1.2.0  
**Status:** Planned

This part describes the architecture through which humans, AI systems, projections, IdeaMark documents, retrieval systems, and authoritative original sources participate in continuous co-evolution.

In this specification, co-evolution means the continuous mutual development of humans and AI through shared intellectual activities grounded in authoritative original sources.

Part 1 explains why IdeaMark uses engineering through separation: reusable structure is separated from meaning so that it can be managed and reused without fixing interpretation.

Part 2 explains engineering through reconstruction at the ecosystem level.

The architecture is organized as a two-plus-one layer model:

1. Index Construction Layer
2. Reconstruction Layer
3. Ecosystem Feedback Layer

The first two layers describe the main operational architecture. The third layer describes how projections, sources, IdeaMark documents, retrieval behavior, and human-AI practices improve over time.

## Proposed Sections

0. Architectural Overview
1. Two-plus-one Layer Model
2. Index Construction Layer
3. Projection Libraries and Projection Selection
4. IdeaMark Generation and Repository Construction
5. On-demand Generation and Background Generation
6. Reconstruction Layer
7. Retrieval as Navigation to Intellectual Activity
8. AI Interpretation and Human Interpretation
9. Human Action and New Original Sources
10. Ecosystem Feedback Layer
11. Capability-Oriented Human-AI Co-evolution
12. Architectural Non-goals
13. Architecture Summary

## Layer 1: Index Construction

The Index Construction Layer creates reusable structural indexes from combinations of original sources and projections.

```text
Original Source Collection
        x
Projection Library
        ↓
IdeaMark Generation
        ↓
IdeaMark Repository / DB
```

For example, if an organization has 100,000 source files and 30 projections, the ecosystem may eventually generate up to 3,000,000 source-projection IdeaMark combinations.

This generation may occur through background processing, prioritized processing, or on-demand generation when a missing combination is needed.

## Layer 2: Reconstruction

The Reconstruction Layer uses the IdeaMark Repository to support future intellectual activity.

```text
User / Situation
        ↓
Projection Selection or Projection Generation
        ↓
IdeaMark Retrieval
        ↓
Original Source Access
        ↓
AI Interpretation
        ↓
Human Interpretation
        ↓
Decision / Action
        ↓
New Original Source
```

This layer reconstructs meaning from authoritative original sources under current situations and projections.

## Plus-one Layer: Ecosystem Feedback

The Ecosystem Feedback Layer improves the system over time.

```text
Usage / Retrieval Results / Human Feedback / New Sources
        ↓
Projection Improvement
        ↓
IdeaMark Regeneration
        ↓
Repository Improvement
        ↓
Improved Reconstruction
```

This layer explains why Projection should be treated as a reusable intellectual asset and why IdeaMark documents are operational snapshots rather than immutable final representations.

## Scope

Part 2 should explain the system-level architecture before the Core Model is specified.

It should not define YAML fields, validation rules, storage engines, queueing systems, database schemas, or implementation-specific retrieval algorithms.
