const { parseDocument } = require('./parser');
const { stableStringify, sortKeys } = require('./utils');

const DEFAULT_EXCLUDED_META_FIELDS = new Set(['updated_at', 'created_at']);

function normalizeForDiff(doc, options) {
  const includeMeta = !!options.includeMeta;
  const model = {
    entities: sortKeys(doc.registry.entities || {}),
    occurrences: sortKeys(doc.registry.occurrences || {}),
    sections: sortKeys(doc.registry.sections || {}),
    relations: Array.isArray(doc.registry.relations) ? sortKeys(doc.registry.relations) : [],
    structure: sortKeys(doc.registry.structure || { sections: [] }),
  };

  if (includeMeta) {
    model.header = sortKeys(doc.header || {});
  } else if (doc.header) {
    const filtered = { ...doc.header };
    for (const key of DEFAULT_EXCLUDED_META_FIELDS) {
      delete filtered[key];
    }
    model.header = sortKeys(filtered);
  }

  return model;
}

function setEquals(a, b) {
  if (a.size !== b.size) return false;
  for (const x of a) if (!b.has(x)) return false;
  return true;
}

function addChange(changes, op, path, before, after, summary, riskHint) {
  const out = { op, path, summary };
  if (before !== undefined) out.before = before;
  if (after !== undefined) out.after = after;
  if (riskHint) out.risk_hint = riskHint;
  changes.push(out);
}

function joinPath(base, part) {
  return `${base}/${String(part).replaceAll('~', '~0').replaceAll('/', '~1')}`;
}

function diffValues(changes, path, before, after) {
  const beforeType = Array.isArray(before) ? 'array' : typeof before;
  const afterType = Array.isArray(after) ? 'array' : typeof after;

  if (before === undefined && after !== undefined) {
    addChange(changes, 'add', path, undefined, after, `Added value at ${path}`);
    return;
  }
  if (before !== undefined && after === undefined) {
    addChange(changes, 'remove', path, before, undefined, `Removed value at ${path}`);
    return;
  }

  if (beforeType !== afterType) {
    addChange(changes, 'replace', path, before, after, `Replaced value type at ${path}`);
    return;
  }

  if (beforeType === 'object' && before && after && !Array.isArray(before) && !Array.isArray(after)) {
    const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
    const sorted = Array.from(keys).sort((a, b) => a.localeCompare(b));
    for (const key of sorted) {
      diffValues(changes, joinPath(path, key), before[key], after[key]);
    }
    return;
  }

  if (beforeType === 'array' && Array.isArray(before) && Array.isArray(after)) {
    if (stableStringify(before) !== stableStringify(after)) {
      addChange(changes, 'replace', path, before, after, `Replaced array at ${path}`);
    }
    return;
  }

  if (before !== after) {
    addChange(changes, 'replace', path, before, after, `Replaced value at ${path}`);
  }
}

function detectStructureMove(changes, before, after) {
  const beforeSections =
    before && before.structure && Array.isArray(before.structure.sections) ? before.structure.sections : [];
  const afterSections =
    after && after.structure && Array.isArray(after.structure.sections) ? after.structure.sections : [];

  if (!beforeSections.length && !afterSections.length) return;
  if (!beforeSections.every((x) => typeof x === 'string')) return;
  if (!afterSections.every((x) => typeof x === 'string')) return;

  const beforeSet = new Set(beforeSections);
  const afterSet = new Set(afterSections);
  const orderChanged = stableStringify(beforeSections) !== stableStringify(afterSections);
  if (orderChanged && setEquals(beforeSet, afterSet)) {
    addChange(
      changes,
      'move',
      '#/structure/sections',
      beforeSections,
      afterSections,
      'Section order changed in structure.sections',
      'Section order changes can affect rendering and extraction order.'
    );
  }
}

function uniqByOpPath(changes) {
  const seen = new Set();
  const out = [];
  for (const c of changes) {
    const key = `${c.op}:${c.path}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(c);
  }
  return out;
}

function removeStructureReplaceWhenMove(changes) {
  const hasMove = changes.some((c) => c.op === 'move' && c.path === '#/structure/sections');
  if (!hasMove) return changes;
  return changes.filter((c) => !(c.op === 'replace' && c.path === '#/structure/sections'));
}

function computeDiff(fromText, toText, options) {
  const fromDoc = parseDocument(fromText);
  const toDoc = parseDocument(toText);

  if (fromDoc.parseErrors.length || toDoc.parseErrors.length) {
    return {
      ok: false,
      error: 'yaml_parse_error',
      message: 'Failed to parse one or both input documents.',
    };
  }

  const scope = options.scope || 'yaml';
  const includeMeta = !!options.includeMeta;
  const includeMarkdown = !!options.includeMarkdown;

  const fromModel = normalizeForDiff(fromDoc, { includeMeta });
  const toModel = normalizeForDiff(toDoc, { includeMeta });

  const changes = [];
  diffValues(changes, '#', fromModel, toModel);
  detectStructureMove(changes, fromModel, toModel);

  let filtered = removeStructureReplaceWhenMove(uniqByOpPath(changes));

  // YAML-first default. Markdown/body differences are currently opt-in and coarse.
  if (scope === 'all' && includeMarkdown) {
    const beforeBody = fromDoc.segments
      .filter((s) => s.type === 'text')
      .map((s) => s.value)
      .join('');
    const afterBody = toDoc.segments
      .filter((s) => s.type === 'text')
      .map((s) => s.value)
      .join('');
    if (beforeBody !== afterBody) {
      addChange(
        filtered,
        'replace',
        '#/markdown',
        { hash: stableStringify(beforeBody) },
        { hash: stableStringify(afterBody) },
        'Markdown body changed',
        'Markdown differences may include noisy formatting-only changes.'
      );
    }
  }

  // Keep changes focused on YAML structures unless all scope explicitly requested.
  if (scope !== 'all') {
    filtered = filtered.filter((c) => c.path !== '#/markdown');
  }

  return { ok: true, changes: filtered };
}

function toNdjson(changes) {
  return changes.map((x) => JSON.stringify(x)).join('\n') + (changes.length ? '\n' : '');
}

function toJson(changes) {
  return JSON.stringify(changes);
}

function toMarkdown(changes, options) {
  const lines = [
    '# diff report',
    '',
    `- scope: ${options.scope || 'yaml'}`,
    `- include_markdown: ${options.includeMarkdown ? 'true' : 'false'}`,
    `- include_meta: ${options.includeMeta ? 'true' : 'false'}`,
    `- change_count: ${changes.length}`,
    '',
    '## changes',
  ];

  if (!changes.length) {
    lines.push('- (none)');
    lines.push('');
    return lines.join('\n');
  }

  for (const c of changes) {
    lines.push(`- [${c.op}] ${c.path}: ${c.summary}`);
  }
  lines.push('');
  return lines.join('\n');
}

module.exports = {
  computeDiff,
  toNdjson,
  toJson,
  toMarkdown,
};
