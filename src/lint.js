const { parseRef } = require('./validate');

const PROFILE_RULES = {
  minimal: {
    required: true,
    recommended: false,
  },
  diagnostic: {
    required: true,
    recommended: true,
  },
  strict: {
    required: true,
    recommended: true,
  },
};

function collectIds(registry) {
  return {
    entities: new Set(Object.keys(registry.entities || {})),
    occurrences: new Set(Object.keys(registry.occurrences || {})),
    sections: new Set(Object.keys(registry.sections || {})),
  };
}

function makeMeta(mode) {
  return {
    type: 'meta',
    tool: 'ideamark-cli',
    version: require('../package.json').version,
    mode,
    command: 'lint',
  };
}

function makeSummary(diagnostics, strictMode) {
  const counts = { error: 0, warning: 0, info: 0 };
  for (const d of diagnostics) {
    if (d.severity && counts[d.severity] !== undefined) counts[d.severity] += 1;
  }
  const hasError = counts.error > 0;
  return {
    type: 'summary',
    ok: strictMode ? !hasError : true,
    error_count: counts.error,
    warning_count: counts.warning,
    info_count: counts.info,
  };
}

function d(severity, code, message, location, mode, hint) {
  const out = {
    type: 'diagnostic',
    severity,
    code,
    message,
    location: location || {},
    mode,
  };
  if (hint) out.hint = hint;
  return out;
}

function referencedOccurrenceIds(registry, docId) {
  const ids = new Set();
  for (const sec of Object.values(registry.sections || {})) {
    const occs = sec && Array.isArray(sec.occurrences) ? sec.occurrences : [];
    for (const occRef of occs) {
      if (typeof occRef !== 'string') continue;
      const ref = parseRef(occRef, docId);
      if (ref.kind === 'local' && ref.id) ids.add(ref.id);
    }
  }
  return ids;
}

function referencedEntityIds(registry, docId) {
  const ids = new Set();
  for (const occ of Object.values(registry.occurrences || {})) {
    if (typeof occ.entity === 'string') {
      const ref = parseRef(occ.entity, docId);
      if (ref.kind === 'local' && ref.id) ids.add(ref.id);
    }
    if (typeof occ.target === 'string') {
      const ref = parseRef(occ.target, docId);
      if (ref.kind === 'local' && ref.id) ids.add(ref.id);
    }
  }
  return ids;
}

function lintDocument(doc, options) {
  const profile = options.profile || 'diagnostic';
  const strictMode = !!options.strict;
  const mode = strictMode ? 'strict' : 'diagnostic';
  const rules = PROFILE_RULES[profile] || PROFILE_RULES.diagnostic;
  const diagnostics = [];

  const docId = doc.header && doc.header.doc_id;
  const registry = doc.registry || {};
  const idSets = collectIds(registry);

  if (rules.required) {
    if (doc.parseErrors && doc.parseErrors.length > 0) {
      diagnostics.push(
        d(
          'error',
          'IM-LINT-002',
          'Document contains YAML parse errors.',
          { scope: 'yaml' },
          mode,
          'Fix malformed YAML blocks before other lint checks.'
        )
      );
    }

    if (!doc.header || doc.headerCount !== 1) {
      diagnostics.push(
        d(
          'error',
          'IM-LINT-001',
          'Document header must appear exactly once.',
          { scope: 'header' },
          mode,
          'Ensure a single frontmatter/header block exists.'
        )
      );
    }

    let hasIdConflict = false;
    if (doc.duplicates) {
      hasIdConflict =
        (doc.duplicates.entities && doc.duplicates.entities.size > 0) ||
        (doc.duplicates.occurrences && doc.duplicates.occurrences.size > 0) ||
        (doc.duplicates.sections && doc.duplicates.sections.size > 0);
    }

    if (hasIdConflict) {
      diagnostics.push(
        d(
          'error',
          'IM-LINT-003',
          'Duplicate IDs detected within document registry.',
          { scope: 'unknown' },
          mode,
          'Rename conflicting IDs to keep them unique.'
        )
      );
    }

    const brokenRefs = [];

    for (const [occId, occ] of Object.entries(registry.occurrences || {})) {
      if (typeof occ.entity === 'string') {
        const ref = parseRef(occ.entity, docId);
        if (ref.kind === 'local' && !idSets.entities.has(ref.id) && !occ.inline) {
          brokenRefs.push({ scope: 'occurrence', path: 'entity', id: occId });
        }
      }
      if (typeof occ.target === 'string') {
        const ref = parseRef(occ.target, docId);
        if (ref.kind === 'local' && !idSets.entities.has(ref.id)) {
          brokenRefs.push({ scope: 'occurrence', path: 'target', id: occId });
        }
      }
      if (Array.isArray(occ.supporting_evidence)) {
        for (const ev of occ.supporting_evidence) {
          if (typeof ev !== 'string') continue;
          const ref = parseRef(ev, docId);
          if (ref.kind === 'local' && !idSets.entities.has(ref.id) && !idSets.occurrences.has(ref.id)) {
            brokenRefs.push({ scope: 'occurrence', path: 'supporting_evidence', id: occId });
          }
        }
      }
    }

    for (const [secId, sec] of Object.entries(registry.sections || {})) {
      const occs = sec && Array.isArray(sec.occurrences) ? sec.occurrences : [];
      for (const occRef of occs) {
        if (typeof occRef !== 'string') continue;
        const ref = parseRef(occRef, docId);
        if (ref.kind === 'local' && !idSets.occurrences.has(ref.id)) {
          brokenRefs.push({ scope: 'section', path: 'occurrences', id: secId });
        }
      }
    }

    const struct = registry.structure || {};
    if (Array.isArray(struct.sections)) {
      for (const secRef of struct.sections) {
        if (typeof secRef !== 'string') continue;
        const ref = parseRef(secRef, docId);
        if (ref.kind === 'local' && !idSets.sections.has(ref.id)) {
          brokenRefs.push({ scope: 'structure', path: 'sections', id: null });
        }
      }
    }

    if (brokenRefs.length > 0) {
      diagnostics.push(
        d(
          'error',
          'IM-LINT-004',
          'Unresolvable references detected in registry.',
          {
            scope: brokenRefs[0].scope,
            path: brokenRefs[0].path,
            id: brokenRefs[0].id,
          },
          mode,
          'Fix local references so all IDs resolve.'
        )
      );
    }
  }

  if (rules.recommended) {
    const structSections = new Set(
      Array.isArray(registry.structure && registry.structure.sections) ? registry.structure.sections : []
    );
    const registrySections = new Set(Object.keys(registry.sections || {}));

    let missingSections = false;
    for (const sid of structSections) {
      if (!registrySections.has(sid)) {
        missingSections = true;
        break;
      }
    }
    if (!missingSections) {
      for (const sid of registrySections) {
        if (!structSections.has(sid)) {
          missingSections = true;
          break;
        }
      }
    }
    if (missingSections) {
      diagnostics.push(
        d(
          'warning',
          'IM-LINT-101',
          'structure.sections and sections registry are out of sync.',
          { scope: 'structure', path: 'sections' },
          mode,
          'Align structure.sections with existing section IDs.'
        )
      );
    }

    const occReferenced = referencedOccurrenceIds(registry, docId);
    for (const occId of idSets.occurrences) {
      if (!occReferenced.has(occId)) {
        diagnostics.push(
          d(
            'warning',
            'IM-LINT-102',
            'Occurrence exists but is not referenced by any section.',
            { scope: 'occurrence', id: occId },
            mode,
            'Link occurrence from a section or remove it.'
          )
        );
      }
    }

    const entReferenced = referencedEntityIds(registry, docId);
    for (const entId of idSets.entities) {
      if (!entReferenced.has(entId)) {
        diagnostics.push(
          d(
            'warning',
            'IM-LINT-103',
            'Entity exists but is not referenced by occurrences.',
            { scope: 'entity', id: entId },
            mode,
            'Link entity from an occurrence or remove it.'
          )
        );
      }
    }

    for (const [secId, sec] of Object.entries(registry.sections || {})) {
      const anchorage = sec && sec.anchorage ? sec.anchorage : null;
      const domain = anchorage && Array.isArray(anchorage.domain) ? anchorage.domain : [];
      if (domain.length === 0) {
        diagnostics.push(
          d(
            'warning',
            'IM-LINT-104',
            'Section anchorage.domain is empty; routing/discovery quality may degrade.',
            { scope: 'section', id: secId, path: 'anchorage.domain' },
            mode,
            'Add one or more domain tags for routing discovery.'
          )
        );
      }
    }
  }

  const meta = makeMeta(mode);
  const summary = makeSummary(diagnostics, strictMode);
  const ok = strictMode ? summary.error_count === 0 : true;
  return { meta, diagnostics, summary, ok };
}

function lintToJson(result) {
  return JSON.stringify({
    meta: result.meta,
    diagnostics: result.diagnostics,
    summary: result.summary,
  });
}

function lintToMarkdown(result, profile, strictMode) {
  const lines = [
    '# lint report',
    '',
    `- profile: ${profile}`,
    `- strict: ${strictMode ? 'true' : 'false'}`,
    `- ok: ${result.summary.ok}`,
    `- error_count: ${result.summary.error_count}`,
    `- warning_count: ${result.summary.warning_count}`,
    `- info_count: ${result.summary.info_count}`,
    '',
    '## diagnostics',
  ];

  if (!result.diagnostics.length) {
    lines.push('- (none)');
  } else {
    for (const item of result.diagnostics) {
      const where = item.location && item.location.id ? ` (${item.location.id})` : '';
      lines.push(`- [${item.severity}] ${item.code}${where}: ${item.message}`);
    }
  }

  lines.push('');
  return lines.join('\n');
}

module.exports = {
  lintDocument,
  lintToJson,
  lintToMarkdown,
  PROFILE_RULES,
};
