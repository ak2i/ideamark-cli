const { parseDocument, stringifyYaml } = require('./parser');

function buildEvidenceBlock(data) {
  const dumped = stringifyYaml(data).trimEnd();
  return `\`\`\`yaml ideamark:evidence\n${dumped}\n\`\`\`\n`;
}

function resolveInsertIndex(doc, scope, targetId) {
  const blocks = doc.yamlBlocks || [];
  if (scope === 'section') {
    const hit = blocks.find((b) => b.kind === 'section' && b.parsed && b.parsed.ok && b.parsed.value.section_id === targetId);
    if (hit) return { index: hit.index + 1 };
    return { index: doc.segments.length, warning: 'section_not_found' };
  }
  if (scope === 'occurrence') {
    const hit = blocks.find((b) => b.kind === 'occurrence' && b.parsed && b.parsed.ok && b.parsed.value.occurrence_id === targetId);
    if (hit) return { index: hit.index + 1 };
    return { index: doc.segments.length, warning: 'occurrence_not_found' };
  }
  if (scope === 'entity') {
    const hit = blocks.find((b) => b.kind === 'registry');
    if (hit) return { index: hit.index + 1 };
    return { index: doc.segments.length, warning: 'registry_not_found' };
  }
  const header = blocks.find((b) => b.kind === 'header');
  if (header) return { index: header.index + 1 };
  return { index: 0 };
}

function attachEvidence(text, evidence, options) {
  const doc = parseDocument(text);
  const scope = options && options.scope ? options.scope : 'document';
  const targetId = options && options.targetId ? options.targetId : null;
  const diagnostics = [];

  const evidenceBlock = typeof evidence === 'string' ? evidence : buildEvidenceBlock(evidence);
  const { index, warning } = resolveInsertIndex(doc, scope, targetId);
  if (warning) {
    diagnostics.push({
      severity: 'warning',
      code: 'evidence_attach_target_not_found',
      message: `Evidence attach target not found: ${warning}`,
      meta: { scope, targetId },
    });
  }

  const segments = doc.segments.slice();
  segments.splice(index, 0, { type: 'text', value: evidenceBlock });
  const output = segments.map((s) => (s.type === 'text' ? s.value : '')).join('');
  return { output, diagnostics };
}

module.exports = { buildEvidenceBlock, attachEvidence };
