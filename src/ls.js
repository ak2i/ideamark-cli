const { diag, makeMeta, makeSummary } = require('./diagnostics');

function sortById(list) {
  return list.sort((a, b) => String(a.id || '').localeCompare(String(b.id || '')));
}

function collectOccurrenceSections(sections) {
  const map = {};
  const entries = Object.entries(sections || {}).sort((a, b) => String(a[0]).localeCompare(String(b[0])));
  for (const [secId, sec] of entries) {
    const occs = sec && Array.isArray(sec.occurrences) ? sec.occurrences : [];
    for (const occId of occs) {
      if (map[occId] === undefined) map[occId] = secId;
    }
  }
  return map;
}

function listSections(registry) {
  const sections = [];
  for (const [id, sec] of Object.entries(registry.sections || {})) {
    const occs = sec && Array.isArray(sec.occurrences) ? sec.occurrences : [];
    const entry = {
      id,
      view: sec && sec.anchorage ? sec.anchorage.view : undefined,
      phase: sec && sec.anchorage ? sec.anchorage.phase : undefined,
      occ_count: occs.length,
      title: sec ? sec.title || sec.heading : undefined,
    };
    sections.push(entry);
  }
  return sortById(sections);
}

function listOccurrences(registry) {
  const occToSection = collectOccurrenceSections(registry.sections);
  const occurrences = [];
  for (const [id, occ] of Object.entries(registry.occurrences || {})) {
    occurrences.push({
      id,
      role: occ ? occ.role : undefined,
      entity: occ ? occ.entity : undefined,
      section: occToSection[id],
      target: occ ? occ.target : undefined,
    });
  }
  return sortById(occurrences);
}

function listEntities(registry) {
  const entities = [];
  for (const [id, ent] of Object.entries(registry.entities || {})) {
    entities.push({
      id,
      kind: ent ? ent.kind : undefined,
      ref: ent ? ent.ref : undefined,
    });
  }
  return sortById(entities);
}

function collectVocab(doc) {
  const vocab = {
    'anchorage.view': new Set(),
    'anchorage.phase': new Set(),
    'occurrence.role': new Set(),
    'entity.kind': new Set(),
    'status.state': new Set(),
  };

  for (const sec of Object.values(doc.registry.sections || {})) {
    if (sec && sec.anchorage) {
      if (sec.anchorage.view) vocab['anchorage.view'].add(sec.anchorage.view);
      if (sec.anchorage.phase) vocab['anchorage.phase'].add(sec.anchorage.phase);
    }
  }

  for (const occ of Object.values(doc.registry.occurrences || {})) {
    if (occ && occ.role) vocab['occurrence.role'].add(occ.role);
  }

  for (const ent of Object.values(doc.registry.entities || {})) {
    if (ent && ent.kind) vocab['entity.kind'].add(ent.kind);
  }

  const status = doc.header && doc.header.status;
  if (status && status.state) vocab['status.state'].add(status.state);

  const out = {};
  for (const [key, set] of Object.entries(vocab)) {
    out[key] = Array.from(set).sort((a, b) => String(a).localeCompare(String(b)));
  }
  return out;
}

function toMarkdown(payload) {
  const lines = [];
  if (payload.sections) {
    lines.push('# sections');
    for (const sec of payload.sections) {
      lines.push(`- ${sec.id}`);
    }
    lines.push('');
  }
  if (payload.occurrences) {
    lines.push('# occurrences');
    for (const occ of payload.occurrences) {
      lines.push(`- ${occ.id}`);
    }
    lines.push('');
  }
  if (payload.entities) {
    lines.push('# entities');
    for (const ent of payload.entities) {
      lines.push(`- ${ent.id}`);
    }
    lines.push('');
  }
  if (payload.vocab) {
    lines.push('# vocab');
    for (const [k, values] of Object.entries(payload.vocab)) {
      lines.push(`${k}: ${values.join(', ')}`);
    }
    lines.push('');
  }
  return lines.join('\n');
}

function listDocument(doc, options) {
  if (doc.parseErrors && doc.parseErrors.length) {
    const diagnostics = [];
    diagnostics.push(makeMeta('working'));
    for (const err of doc.parseErrors) {
      diagnostics.push(
        diag('error', 'yaml_parse_error', 'YAML parse error', { scope: 'yaml', index: err.index }, 'working')
      );
    }
    const onlyDiag = diagnostics.filter((d) => d.type === 'diagnostic');
    diagnostics.push(makeSummary(onlyDiag));
    return { ok: false, diagnostics };
  }

  const payload = {};
  if (options.include.sections) payload.sections = listSections(doc.registry);
  if (options.include.occurrences) payload.occurrences = listOccurrences(doc.registry);
  if (options.include.entities) payload.entities = listEntities(doc.registry);
  if (options.include.vocab) payload.vocab = collectVocab(doc);

  if (options.format === 'md') {
    return { ok: true, output: toMarkdown(payload) };
  }
  return { ok: true, output: JSON.stringify(payload) };
}

module.exports = { listDocument };
