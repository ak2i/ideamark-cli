# 2. Historical Background

**Part:** 1 — Philosophy  
**Status:** Draft  
**Type:** Informative  
**Citation Policy:** References required before stabilization

Information processing technologies have evolved by addressing different aspects of human intellectual work.

IdeaMark should be understood as a conservative extension of this history rather than a rejection of previous approaches.

## 2.1 Knowledge-Based Systems

Knowledge-based systems attempted to encode expert knowledge explicitly and derive answers through inference.

Representative expert systems demonstrated the practical value of rule-based inference in well-defined domains, while also exposing the difficulty of acquiring, formalizing, maintaining, and extending expert knowledge at scale.

This limitation is often discussed as the knowledge acquisition bottleneck.

## 2.2 Information Retrieval

Information Retrieval shifted the primary target from explicit knowledge to document discovery.

Instead of requiring all knowledge to be formalized, retrieval systems made large document collections searchable through indexing.

This enabled much broader access to information, while leaving interpretation largely to the user.

## 2.3 Semantic Retrieval

Semantic and dense retrieval methods extended document discovery beyond exact keyword matching.

Learned representations and similarity search made it possible to retrieve documents that are conceptually related even when they do not share the same surface vocabulary.

The primary retrieval object, however, generally remained the document or document fragment.

## 2.4 Large Language Models

Large Language Models introduced dynamic interpretation, summarization, explanation, translation, and generation.

Retrieval-Augmented Generation combined retrieval with generation, allowing external sources to improve grounding and reduce reliance on model parameters alone.

This shifted attention from retrieving documents toward reconstructing meaning for particular users and situations.

## 2.5 Historical Limitations

Each generation addressed the principal limitation of its predecessor while changing the primary object of computation.

- Knowledge-based systems focused on explicit knowledge.
- Information retrieval focused on documents.
- Semantic retrieval focused on semantic relationships among documents or fragments.
- Large Language Models focused on dynamic interpretation and generation.

Each technology remains valuable within its intended scope.

## 2.6 Why Another Layer?

IdeaMark does not replace previous generations.

Instead, it introduces a complementary architectural layer.

Previous generations primarily changed what computers process.

IdeaMark changes what can be reused.

IdeaMark indexes reusable structures that connect future situations and projections to authoritative original sources.

## Informative References

This section requires references before stabilization. Candidate references include:

- Shortliffe, E. H. (1976). *Computer-Based Medical Consultations: MYCIN*.
- Feigenbaum, E. A. (1977). *The Art of Artificial Intelligence: Themes and Case Studies of Knowledge Engineering*.
- McDermott, J. (1982). *R1 (XCON): A Rule-Based Configurer of Computer Systems*.
- Salton, G. (1989). *Automatic Text Processing*.
- Brin, S., & Page, L. (1998). *The Anatomy of a Large-Scale Hypertextual Web Search Engine*.
- Karpukhin, V., et al. (2020). *Dense Passage Retrieval for Open-Domain Question Answering*.
- Lewis, P., et al. (2020). *Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks*.
