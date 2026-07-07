const YAML = require('yaml');
const { loadDocument } = require('./load');

// Formatter for IdeaMark Core v1.2.0 documents (Part 4 §15.8–15.9).
//
// Round-trip mode (default) preserves comments, key order, array order, scalar
// styles, unknown namespaces, and extension fields; only whitespace and
// indentation are normalized. Canonical mode additionally reorders top-level
// namespaces and normalizes scalar quoting styles; it never deletes data.

const CANONICAL_ORDER = ['meta', 'sources', 'sections', 'occurrences', 'entities', 'structure', 'extensions'];

// Long scalars are never re-wrapped: re-flowing content lines would make
// round-trip output depend on lineWidth, which Part 4 §15.9 discourages.
const STRINGIFY = { lineWidth: 0 };

function diag(severity, code, message) {
  return { severity, code, rule: 'CLI', message, path: null, object_id: null, field: null };
}

function canonicalRank(key) {
  const i = CANONICAL_ORDER.indexOf(key);
  return i === -1 ? CANONICAL_ORDER.length : i;
}

function formatDocument(text, options = {}) {
  const canonical = !!options.canonical;
  const includeInfo = !!options.info;
  const loaded = loadDocument(text);
  const diagnostics = [...loaded.diagnostics];

  // A multi-document stream cannot be formatted without dropping documents,
  // and silent data loss is forbidden (§15.9) — refuse instead.
  if (loaded.documentCount > 1) {
    diagnostics.push(diag('error', 'yaml_restricted_feature', `refusing to format a multi-document YAML stream (${loaded.documentCount} documents); split the stream first`));
    return { ok: false, output: null, diagnostics };
  }
  if (loaded.fatal) {
    return { ok: false, output: null, diagnostics };
  }

  const doc = YAML.parseDocument(text);

  let reordered = false;
  if (canonical && doc.contents && Array.isArray(doc.contents.items)) {
    const items = doc.contents.items;
    const before = items.map((p) => String(p.key && p.key.value));
    // Stable sort: canonical namespaces first in contract order, everything
    // else after, preserving relative input order.
    const indexed = items.map((item, i) => ({ item, i }));
    indexed.sort((a, b) => {
      const ra = canonicalRank(String(a.item.key && a.item.key.value));
      const rb = canonicalRank(String(b.item.key && b.item.key.value));
      return ra === rb ? a.i - b.i : ra - rb;
    });
    doc.contents.items = indexed.map((e) => e.item);
    const after = doc.contents.items.map((p) => String(p.key && p.key.value));
    reordered = before.join('\n') !== after.join('\n');
    if (reordered) {
      diagnostics.push(diag('info', 'canonical_reordered', `canonical mode reordered top-level namespaces (${after.join(', ')})`));
    }
    // Normalize scalar quoting: drop parsed styles so the stringifier picks
    // the default (plain where safe) uniformly. Values are unchanged.
    YAML.visit(doc, {
      Scalar(key, node) {
        node.type = undefined;
      },
    });
  }

  const output = doc.toString(STRINGIFY);
  if (output === text) {
    diagnostics.push(diag('info', 'format_noop', 'input is already in target form'));
  }

  const emitted = includeInfo ? diagnostics : diagnostics.filter((d) => d.severity !== 'info');
  return { ok: true, output, diagnostics: emitted };
}

module.exports = { formatDocument, CANONICAL_ORDER };
