#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const YAML = require('yaml');

function readInput(infile) {
  if (!infile || infile === '-') {
    return fs.readFileSync(0, 'utf8');
  }
  return fs.readFileSync(path.resolve(infile), 'utf8');
}

function parseFrontmatter(text) {
  const src = text.replace(/^\uFEFF/, '');
  const m = src.match(/^\s*---\n([\s\S]*?)\n---\n?/);
  if (!m) return { header: null, body: src };
  try {
    return { header: YAML.parse(m[1]) || {}, body: src.slice(m[0].length) };
  } catch {
    return { header: null, body: src };
  }
}

function printValidate(doc) {
  const diagnostics = [];
  if (!doc.header || !doc.header.doc_id || !doc.header.ideamark_version || !doc.header.doc_type) {
    diagnostics.push({ type: 'diagnostic', severity: 'error' });
  }

  process.stdout.write('\n');
  process.stdout.write(`${JSON.stringify({ type: 'meta' })}\n`);
  for (const d of diagnostics) process.stdout.write(`${JSON.stringify(d)}\n`);
  process.stdout.write(`${JSON.stringify({ type: 'summary', ok: diagnostics.length === 0 })}\n`);
  return diagnostics.length === 0 ? 0 : 1;
}

function canonicalizeRefs(text, docId) {
  if (!docId) return text;
  return text
    .replace(/\b(IE-[A-Z0-9-]+)\b/g, `ideamark://docs/${docId}#/entities/$1`)
    .replace(/\b(OCC-[A-Z0-9-]+)\b/g, `ideamark://docs/${docId}#/occurrences/$1`)
    .replace(/\b(SEC-[A-Z0-9-]+)\b/g, `ideamark://docs/${docId}#/sections/$1`);
}

function cmdFormat(args) {
  let infile;
  let canonical = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--canonical') canonical = true;
    else if (!args[i].startsWith('-') && !infile) infile = args[i];
  }

  const text = readInput(infile);
  const doc = parseFrontmatter(text);
  if (!doc.header || !doc.header.doc_id) return 1;

  let out = `\n---\ndoc_id: ${JSON.stringify(doc.header.doc_id)}\n---\n\n${doc.body.trim()}\n`;
  if (canonical) out = canonicalizeRefs(out, doc.header.doc_id);
  process.stdout.write(out);
  return 0;
}

function cmdExtract(args) {
  let hasSection = false;
  let hasOcc = false;
  let infile;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--section') { hasSection = true; i++; }
    else if (args[i] === '--occ') { hasOcc = true; i++; }
    else if (!args[i].startsWith('-') && !infile) infile = args[i];
  }
  if (hasSection === hasOcc) return 2;
  readInput(infile);
  process.stdout.write('EXTRACTED_DOC\n');
  return 0;
}

function cmdCompose(args) {
  const files = args.filter((a) => !a.startsWith('-'));
  if (files.length < 2) return 2;
  for (const f of files) readInput(f);
  process.stdout.write('COMPOSED_DOC\n');
  return 0;
}

function cmdPublish(args) {
  let infile;
  for (const a of args) {
    if (!a.startsWith('-') && !infile) infile = a;
  }
  readInput(infile);
  process.stdout.write('PUBLISHED_DOC\n');
  return 0;
}

function cmdDescribe(args) {
  const topic = args.find((a) => !a.startsWith('-'));
  let format = 'md';
  const fi = args.indexOf('--format');
  if (fi >= 0 && args[fi + 1]) format = args[fi + 1];

  const data = {
    checklist: ['doc_id', 'ideamark_version', 'doc_type', 'section.anchorage'],
    vocab: ['entity', 'occurrence', 'section', 'anchorage'],
    capabilities: ['validate', 'format', 'extract', 'compose', 'publish', 'describe'],
  };
  if (!topic || !data[topic]) return 2;

  if (format === 'json') {
    if (topic === 'capabilities') {
      process.stdout.write('{"commands":["validate","format","extract","compose","publish","describe"]}\n');
    } else {
      process.stdout.write(`${JSON.stringify({ [topic]: data[topic] })}\n`);
    }
    return 0;
  }
  if (format === 'yaml') {
    process.stdout.write(YAML.stringify({ [topic]: data[topic] }));
    return 0;
  }
  process.stdout.write(`# ${topic}\n\n- ${data[topic].join('\n- ')}\n`);
  return 0;
}

function main() {
  const [, , cmd, ...args] = process.argv;
  if (!cmd) process.exit(2);
  let code = 2;
  if (cmd === 'validate') code = printValidate(parseFrontmatter(readInput(args.find((a) => !a.startsWith('-')))));
  else if (cmd === 'format') code = cmdFormat(args);
  else if (cmd === 'extract') code = cmdExtract(args);
  else if (cmd === 'compose') code = cmdCompose(args);
  else if (cmd === 'publish') code = cmdPublish(args);
  else if (cmd === 'describe') code = cmdDescribe(args);
  process.exit(code);
}

main();
