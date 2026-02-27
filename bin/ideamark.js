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
const { attachEvidence, buildEvidenceBlock } = require('../src/evidence');
const { extractDocument } = require('../src/extract');
const { composeDocuments } = require('../src/compose');
const { publishDocument } = require('../src/publish');
const { describe } = require('../src/describe');
const { listDocument } = require('../src/ls');
const pkg = require('../package.json');

const VERSION = pkg.version;

const HELP = {
  root: [
    'ideamark CLI',
    '',
    'Usage:',
    '  ideamark <command> [options]',
    '',
    'Commands:',
    '  validate   Validate an IdeaMark document',
    '  format     Format an IdeaMark document',
    '  extract    Extract a section or occurrence',
    '  compose    Compose multiple documents',
    '  publish    Publish a working document',
    '  describe   Describe built-in topics',
    '  ls         List IDs and vocab in a document',
    '',
    'Global options:',
    '  -h, --help     Show help',
    '  --version      Show version [--format json]',
    '',
  ].join('\n'),
  describe: [
    'Usage:',
    '  ideamark describe <topic> [--format json|yaml|md]',
    '',
    'Topics:',
    '  capabilities',
    '  checklist',
    '  vocab',
    '  ai-authoring',
    '  params',
    '',
  ].join('\n'),
  ls: [
    'Usage:',
    '  ideamark ls [<infile>|-] [--sections] [--occurrences] [--entities] [--vocab] [--format json|md]',
    '',
  ].join('\n'),
  validate: [
    'Usage:',
    '  ideamark validate [<infile>|-] [--strict|--mode <mode>] [--fail-on-warn]',
    '',
  ].join('\n'),
  format: [
    'Usage:',
    '  ideamark format [<infile>|-] [-o <outfile>|-] [--canonical] [--diagnostics <stderr|stdout|file>]',
    '',
  ].join('\n'),
  extract: [
    'Usage:',
    '  ideamark extract [<infile>|-] --section <id> | --occ <id> [-o <outfile>|-] [--diagnostics <stderr|stdout|file>]',
    '',
  ].join('\n'),
  compose: [
    'Usage:',
    '  ideamark compose <file1> <file2> [more...] [-o <outfile>|-] [--update] [--base <file>] [--doc-id <id>] [--inherit <mode>] [--diagnostics <stderr|stdout|file>]',
    '',
  ].join('\n'),
  publish: [
    'Usage:',
    '  ideamark publish [<infile>|-] [-o <outfile>|-] [--diagnostics <stderr|stdout|file>]',
    '',
  ].join('\n'),
};

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
  if (args.length === 1 && (args[0] === '-h' || args[0] === '--help')) {
    writeStdout(HELP.root);
    process.exit(0);
  }
  if (args[0] === '--version') {
    let format = null;
    if (args.length > 1) {
      if (args[1] === '--format') {
        format = args[2] || usageExit();
        if (format !== 'json') usageExit();
      } else usageExit();
      if (args.length > 3) usageExit();
    }
    if (format === 'json') {
      const payload = {
        tool: { version: VERSION },
        contract: { version: '1.0.2' },
        document_spec: { version: '1.0.2' },
      };
      writeStdout(`${JSON.stringify(payload)}\n`);
      process.exit(0);
    }
    writeStdout(`${VERSION}\n`);
    process.exit(0);
  }
  const cmd = args.shift();
  if (!cmd) usageExit();
  if (args.includes('-h') || args.includes('--help')) {
    const help = HELP[cmd] || HELP.root;
    writeStdout(help);
    process.exit(0);
  }

  if (cmd === 'validate') {
    let infile = null;
    let mode = 'working';
    let failOnWarn = false;
    let emitEvidence = null;
    let evidenceScope = 'document';
    let evidenceTarget = null;
    let attachOut = null;
    let artifactOut = null;
    while (args.length) {
      const a = args.shift();
      if (a === '--strict') mode = 'strict';
      else if (a === '--mode') mode = args.shift() || usageExit();
      else if (a === '--fail-on-warn') failOnWarn = true;
      else if (a === '--emit-evidence') emitEvidence = args.shift() || usageExit();
      else if (a === '--evidence-scope') evidenceScope = args.shift() || usageExit();
      else if (a === '--evidence-target') evidenceTarget = args.shift() || usageExit();
      else if (a === '--attach') attachOut = args.shift() || usageExit();
      else if (a === '--artifact-out') artifactOut = args.shift() || usageExit();
      else if (!infile) infile = a;
      else usageExit();
    }
    if (emitEvidence && !['yaml', 'ndjson'].includes(emitEvidence)) usageExit();
    if (evidenceScope && !['document', 'section', 'entity', 'occurrence'].includes(evidenceScope)) usageExit();
    const text = readInput(infile);
    const doc = parseDocument(text);
    const result = validateDocument(doc, { mode });
    const diagnosticsPayload = [result.meta, ...result.diagnostics, result.summary];
    const hasEvidence = !!emitEvidence || !!attachOut;
    if (!hasEvidence) {
      emitNdjson(diagnosticsPayload, 'stdout');
    }
    const hasWarn = result.diagnostics.some((d) => d.severity === 'warning');
    const ok = result.ok && !(failOnWarn && hasWarn);
    if (hasEvidence) {
      const target = {};
      if (evidenceScope === 'section') target.section_id = evidenceTarget || null;
      if (evidenceScope === 'entity') target.entity_id = evidenceTarget || null;
      if (evidenceScope === 'occurrence') target.occurrence_id = evidenceTarget || null;
      const evidenceRecord = {
        kind: 'lint-report',
        scope: evidenceScope,
        target,
        produced_by: {
          tool: 'ideamark-cli',
          command: 'validate',
          tool_version: VERSION,
        },
        produced_at: new Date().toISOString(),
        summary: result.summary,
      };
      let evidenceForAttach = evidenceRecord;
      if (artifactOut && emitEvidence === 'ndjson') {
        writeFileUtf8(artifactOut, `${JSON.stringify(evidenceRecord)}\n`);
        evidenceForAttach = {
          ...evidenceRecord,
          artifact_ref: { uri: artifactOut },
        };
      }

      if (attachOut) {
        const attached = attachEvidence(text, evidenceForAttach, { scope: evidenceScope, targetId: evidenceTarget });
        writeOutput(attachOut, attached.output);
      } else if (emitEvidence === 'yaml') {
        writeStdout(buildEvidenceBlock(evidenceRecord));
      } else if (emitEvidence === 'ndjson') {
        writeStdout(`${JSON.stringify(evidenceRecord)}\n`);
      }
      if (diagnosticsPayload.length) writeStderr(stringifyNdjson(diagnosticsPayload));
    }
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
    let format = null;
    while (args.length) {
      const a = args.shift();
      if (a === '--format') {
        format = args.shift() || usageExit();
        if (!['json', 'yaml', 'md'].includes(format)) usageExit();
      } else usageExit();
    }
    if (!format) format = 'md';
    const result = describe(topic, format);
    if (!result.ok) {
      if (result.error === 'unknown topic') usageExit();
      if (result.diagnostics) writeStderr(stringifyNdjson(result.diagnostics));
      process.exit(1);
    }
    writeStdout(result.output);
    process.exit(0);
  }

  if (cmd === 'ls') {
    let infile = null;
    let format = 'json';
    const include = { sections: false, occurrences: false, entities: false, vocab: false };
    while (args.length) {
      const a = args.shift();
      if (a === '--format') {
        format = args.shift() || usageExit();
        if (!['json', 'md'].includes(format)) usageExit();
      } else if (a === '--sections') include.sections = true;
      else if (a === '--occurrences') include.occurrences = true;
      else if (a === '--entities') include.entities = true;
      else if (a === '--vocab') include.vocab = true;
      else if (!infile) infile = a;
      else usageExit();
    }
    if (!include.sections && !include.occurrences && !include.entities && !include.vocab) {
      include.sections = include.occurrences = include.entities = include.vocab = true;
    }
    const text = readInput(infile);
    const doc = parseDocument(text);
    const result = listDocument(doc, { format, include });
    if (!result.ok) {
      if (result.diagnostics) writeStderr(stringifyNdjson(result.diagnostics));
      process.exit(1);
    }
    writeStdout(result.output);
    process.exit(0);
  }

  usageExit();
}

main();
