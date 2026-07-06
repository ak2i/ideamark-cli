const YAML = require('yaml');

// Loader for IdeaMark Core v1.2.0 documents (Part 4 §1, §15).
// Returns { data, fatal, diagnostics }. `fatal` means no usable document was
// produced and structural validation must be skipped.

function diag(severity, code, rule, message, path) {
  return { severity, code, rule, message, path: path || null, object_id: null, field: null };
}

function isMapping(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

function hasAlias(doc) {
  let found = false;
  YAML.visit(doc, {
    Alias() {
      found = true;
      return YAML.visit.BREAK;
    },
  });
  return found;
}

function loadDocument(text) {
  const diagnostics = [];
  let docs;
  try {
    docs = YAML.parseAllDocuments(text);
  } catch (e) {
    diagnostics.push(diag('error', 'yaml_parse_error', 'LOAD-01', `YAML parse error: ${e.message}`));
    return { data: null, fatal: true, documentCount: 0, diagnostics };
  }
  const documentCount = docs.length;
  if (!docs.length) {
    diagnostics.push(diag('error', 'top_level_not_mapping', 'LOAD-02', 'document is empty'));
    return { data: null, fatal: true, documentCount, diagnostics };
  }

  const first = docs[0];
  let firstData = null;
  if (!first.errors.length) firstData = first.toJS();

  // LOAD-05: v1.1.x .ideamark.md documents carry the legacy header mapping
  // (frontmatter or top level). Detect before reporting parse errors, because
  // the markdown body of a legacy file is usually not valid YAML.
  if (isMapping(firstData) && ('ideamark_version' in firstData)) {
    diagnostics.push(diag(
      'error',
      'legacy_document_detected',
      'LOAD-05',
      'input looks like an IdeaMark v1.1.x .ideamark.md document; convert it with `ideamark migrate`'
    ));
    return { data: null, fatal: true, documentCount, diagnostics };
  }

  const parseErrors = docs.flatMap((d) => d.errors);
  if (parseErrors.length) {
    for (const e of parseErrors.slice(0, 10)) {
      diagnostics.push(diag('error', 'yaml_parse_error', 'LOAD-01', `YAML parse error: ${e.message}`));
    }
    return { data: null, fatal: true, documentCount, diagnostics };
  }

  if (docs.length > 1) {
    diagnostics.push(diag(
      'warning',
      'yaml_restricted_feature',
      'LOAD-04',
      `input is a multi-document YAML stream (${docs.length} documents); only the first document is processed`
    ));
  }
  if (hasAlias(first)) {
    diagnostics.push(diag('warning', 'yaml_restricted_feature', 'LOAD-04', 'YAML anchors/aliases are used; round-trip behavior may differ across tools'));
  }
  if (/^\s*<<\s*:/m.test(text)) {
    diagnostics.push(diag('warning', 'yaml_restricted_feature', 'LOAD-04', 'YAML merge keys are used; round-trip behavior may differ across tools'));
  }
  for (const w of first.warnings || []) {
    diagnostics.push(diag('warning', 'yaml_restricted_feature', 'LOAD-04', `YAML feature warning: ${w.message}`));
  }

  if (!isMapping(firstData)) {
    diagnostics.push(diag('error', 'top_level_not_mapping', 'LOAD-02', 'top level of the document is not a mapping'));
    return { data: null, fatal: true, documentCount, diagnostics };
  }

  return { data: firstData, fatal: false, documentCount, diagnostics };
}

module.exports = { loadDocument };
