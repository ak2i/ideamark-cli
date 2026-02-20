#!/usr/bin/env node
const path = require('path');
const {
  readFileUtf8,
  writeFileUtf8,
  readStdinUtf8,
  isStdinPath,
  writeStdout,
  writeStderr,
} = require('../src/utils');
const { parseDocument } = require('../src/parser');
const { validateDocument } = require('../src/validate');
const { emitNdjson } = require('../src/diagnostics');
const { stringifyNdjson } = require('../src/diagnostics');
const { formatDocument } = require('../src/format');
const { extractDocument } = require('../src/extract');
const { composeDocuments } = require('../src/compose');
const { publishDocument } = require('../src/publish');
const { describe } = require('../src/describe');

function usageExit() {
  writeStderr('usage error\n');
  process.exit(2);
}

function readInput(infile) {
  if (isStdinPath(infile)) return readStdinUtf8();
  return readFileUtf8(infile);
}

function writeOutput(outfile, content) {
  if (!outfile || outfile === '-') return writeStdout(content);
  return writeFileUtf8(outfile, content);
}

function writeDiagnostics(records, target) {
  if (!records || records.length === 0) return;
  const data = stringifyNdjson(records);
  if (!target || target === '-' || target === 'stderr') return writeStderr(data);
  if (target === 'stdout') return writeStdout(data);
  return writeFileUtf8(target, data);
}

function main() {
  const args = process.argv.slice(2);
  const cmd = args.shift();
  if (!cmd) usageExit();

  if (cmd === 'validate') {
    let infile = null;
    let mode = 'working';
    let failOnWarn = false;
    while (args.length) {
      const a = args.shift();
      if (a === '--strict') mode = 'strict';
      else if (a === '--mode') mode = args.shift() || usageExit();
      else if (a === '--fail-on-warn') failOnWarn = true;
      else if (!infile) infile = a;
      else usageExit();
    }
    const text = readInput(infile);
    const doc = parseDocument(text);
    const result = validateDocument(doc, { mode });
    emitNdjson([result.meta, ...result.diagnostics, result.summary], 'stdout');
    const hasWarn = result.diagnostics.some((d) => d.severity === 'warning');
    const ok = result.ok && !(failOnWarn && hasWarn);
    process.exit(ok ? 0 : 1);
  }

  if (cmd === 'format') {
    let infile = null;
    let outfile = null;
    let canonical = false;
    let diagnosticsTarget = 'stderr';
    while (args.length) {
      const a = args.shift();
      if (a === '-o') outfile = args.shift() || usageExit();
      else if (a === '--canonical') canonical = true;
      else if (a === '--diagnostics') diagnosticsTarget = args.shift() || usageExit();
      else if (!infile) infile = a;
      else usageExit();
    }
    const text = readInput(infile);
    const result = formatDocument(text, { canonical });
    writeOutput(outfile, result.output);
    writeDiagnostics(result.diagnostics, diagnosticsTarget);
    process.exit(0);
  }

  if (cmd === 'extract') {
    let infile = null;
    let outfile = null;
    let sectionId = null;
    let occId = null;
    let diagnosticsTarget = 'stderr';
    while (args.length) {
      const a = args.shift();
      if (a === '-o') outfile = args.shift() || usageExit();
      else if (a === '--section') sectionId = args.shift() || usageExit();
      else if (a === '--occ') occId = args.shift() || usageExit();
      else if (a === '--diagnostics') diagnosticsTarget = args.shift() || usageExit();
      else if (!infile) infile = a;
      else usageExit();
    }
    if ((sectionId && occId) || (!sectionId && !occId)) usageExit();
    const text = readInput(infile);
    const doc = parseDocument(text);
    const result = extractDocument(doc, { sectionId, occurrenceId: occId });
    if (!result.ok) {
      writeDiagnostics(result.diagnostics, diagnosticsTarget);
      process.exit(1);
    }
    writeOutput(outfile, result.output);
    writeDiagnostics(result.diagnostics, diagnosticsTarget);
    process.exit(0);
  }

  if (cmd === 'compose') {
    let outfile = null;
    let update = false;
    let basefile = null;
    let docId = null;
    let inherit = 'none';
    let diagnosticsTarget = 'stderr';
    const files = [];
    while (args.length) {
      const a = args.shift();
      if (a === '-o') outfile = args.shift() || usageExit();
      else if (a === '--update') update = true;
      else if (a === '--base') basefile = args.shift() || usageExit();
      else if (a === '--doc-id') docId = args.shift() || usageExit();
      else if (a === '--inherit') inherit = args.shift() || usageExit();
      else if (a === '--diagnostics') diagnosticsTarget = args.shift() || usageExit();
      else files.push(a);
    }
    if (files.length < 2) usageExit();
    const docs = files.map((f) => parseDocument(readFileUtf8(f)));
    let baseHeader = null;
    if (basefile) baseHeader = parseDocument(readFileUtf8(basefile)).header;
    const result = composeDocuments(docs, { update, baseHeader, docId, inherit });
    if (!result.ok) {
      writeDiagnostics(result.diagnostics, diagnosticsTarget);
      process.exit(1);
    }
    writeOutput(outfile, result.output);
    writeDiagnostics(result.diagnostics, diagnosticsTarget);
    process.exit(0);
  }

  if (cmd === 'publish') {
    let infile = null;
    let outfile = null;
    let diagnosticsTarget = 'stderr';
    while (args.length) {
      const a = args.shift();
      if (a === '-o') outfile = args.shift() || usageExit();
      else if (a === '--diagnostics') diagnosticsTarget = args.shift() || usageExit();
      else if (!infile) infile = a;
      else usageExit();
    }
    const text = readInput(infile);
    const result = publishDocument(text);
    if (!result.ok) {
      writeDiagnostics(result.diagnostics, diagnosticsTarget);
      process.exit(1);
    }
    writeOutput(outfile, result.output);
    writeDiagnostics(result.diagnostics, diagnosticsTarget);
    process.exit(0);
  }

  if (cmd === 'describe') {
    const topic = args.shift();
    if (!topic) usageExit();
    let format = 'md';
    while (args.length) {
      const a = args.shift();
      if (a === '--format') format = args.shift() || usageExit();
      else usageExit();
    }
    const result = describe(topic, format);
    if (!result.ok) usageExit();
    writeStdout(result.output);
    process.exit(0);
  }

  usageExit();
}

main();
