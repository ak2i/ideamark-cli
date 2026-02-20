const { writeStdout, writeStderr } = require('./utils');

function makeMeta(mode) {
  return {
    type: 'meta',
    tool: 'ideamark-cli',
    version: '0.1.0',
    mode,
  };
}

function makeSummary(diagnostics) {
  const counts = { error: 0, warning: 0, info: 0 };
  for (const d of diagnostics) {
    if (d.severity && counts[d.severity] !== undefined) counts[d.severity] += 1;
  }
  return {
    type: 'summary',
    ok: counts.error === 0,
    error_count: counts.error,
    warning_count: counts.warning,
    info_count: counts.info,
  };
}

function diag(severity, code, message, location, mode) {
  const d = {
    type: 'diagnostic',
    severity,
    code,
    message,
    location: location || {},
    mode,
  };
  return d;
}

function emitNdjson(records, stream) {
  const lines = stringifyNdjson(records);
  if (stream === 'stderr') writeStderr(lines);
  else writeStdout(lines);
}

module.exports = {
  makeMeta,
  makeSummary,
  diag,
  emitNdjson,
  stringifyNdjson,
};

function stringifyNdjson(records) {
  return records.map((r) => JSON.stringify(r)).join('\n') + (records.length ? '\n' : '');
}
