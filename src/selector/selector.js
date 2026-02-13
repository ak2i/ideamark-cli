function splitSelector(selector) {
  if (!selector) return [];
  const tokens = selector.match(/(?:[^\s"]+|"[^"]*")+?/g);
  if (!tokens) return [];
  return tokens.map((t) => {
    if (t.startsWith('"') && t.endsWith('"')) {
      return t.slice(1, -1);
    }
    return t;
  });
}

function parseSelector(selector) {
  const tokens = splitSelector(selector);
  const filters = {};
  let limit = null;

  function selectorError(message) {
    const err = new Error(`selector: ${message}`);
    err.code = 'E_SELECTOR';
    throw err;
  }

  for (const token of tokens) {
    if (!token) continue;
    if (token.includes('~=')) {
      const [key, raw] = token.split('~=');
      if (!key || !raw) selectorError(`Invalid selector token: ${token}`);
      if (key !== 'domain') selectorError(`Unsupported selector key: ${key}`);
      const values = raw.split(',').map((v) => v.trim()).filter(Boolean);
      if (values.length === 0) selectorError(`Invalid selector token: ${token}`);
      if (!filters.domain) filters.domain = [];
      filters.domain.push(...values);
      continue;
    }

    const [key, value] = token.split('=');
    if (!key || typeof value === 'undefined') {
      selectorError(`Invalid selector token: ${token}`);
    }

    if (key === 'limit') {
      const parsed = Number(value);
      if (!Number.isFinite(parsed) || parsed <= 0) {
        selectorError(`Invalid limit value: ${value}`);
      }
      limit = parsed;
      continue;
    }

    if (!['view', 'phase', 'doc_id', 'section_id'].includes(key)) {
      selectorError(`Unsupported selector key: ${key}`);
    }

    if (!filters[key]) filters[key] = [];
    filters[key].push(value);
  }

  return { filters, limit };
}

function matchesSelector(section, doc, selector) {
  if (!selector) return true;
  const { filters } = selector;
  const anchorage = section.anchorage || section.yaml?.anchorage || null;

  for (const key of Object.keys(filters)) {
    const values = filters[key];

    if (key === 'doc_id') {
      if (!doc || !doc.doc_id) return false;
      if (!values.includes(doc.doc_id)) return false;
      continue;
    }

    if (key === 'section_id') {
      if (!section.section_id) return false;
      if (!values.includes(section.section_id)) return false;
      continue;
    }

    if (key === 'view') {
      if (!anchorage || !anchorage.view) return false;
      if (!values.includes(anchorage.view)) return false;
      continue;
    }

    if (key === 'phase') {
      if (!anchorage || !anchorage.phase) return false;
      if (!values.includes(anchorage.phase)) return false;
      continue;
    }

    if (key === 'domain') {
      if (!anchorage || !Array.isArray(anchorage.domain)) return false;
      const matched = values.some((v) => anchorage.domain.includes(v));
      if (!matched) return false;
      continue;
    }
  }

  return true;
}

module.exports = { parseSelector, matchesSelector };
