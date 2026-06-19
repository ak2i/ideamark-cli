#!/usr/bin/env node
const path = require('path');
const { describe } = require('../src/describe');
const { readFileUtf8, writeFileUtf8, writeStdout, writeStderr } = require('../src/utils');

const TEMPLATE_PATH = path.join(
  __dirname,
  '..',
  'docs',
  'samples',
  '00-chatgpt-conversion-template',
  'chatgpt-conversion-prompt-template.md'
);

function usage() {
  return [
    'Usage:',
    '  node scripts/build-chatgpt-conversion-prompt.js --source <textfile> --output <prompt.md>',
    '       [--lang ja-JP|en-US] [--target-file <output.ideamark.yaml>] [--artifacts-dir <dir>]',
    '',
    'Example:',
    '  node scripts/build-chatgpt-conversion-prompt.js \\',
    '    --source ./tmp/source.txt \\',
    '    --output ./tmp/chatgpt-prompt.md \\',
    '    --lang ja-JP \\',
    '    --target-file output.ideamark.yaml \\',
    '    --artifacts-dir ./tmp/describe',
    '',
  ].join('\n');
}

function parseArgs(argv) {
  const out = {
    source: null,
    output: null,
    lang: 'ja-JP',
    targetFile: 'output.ideamark.yaml',
    artifactsDir: null,
  };

  const args = [...argv];
  while (args.length) {
    const arg = args.shift();
    if (arg === '--source') out.source = args.shift() || null;
    else if (arg === '--output') out.output = args.shift() || null;
    else if (arg === '--lang') out.lang = args.shift() || null;
    else if (arg === '--target-file') out.targetFile = args.shift() || null;
    else if (arg === '--artifacts-dir') out.artifactsDir = args.shift() || null;
    else if (arg === '-h' || arg === '--help') out.help = true;
    else out.error = `unknown argument: ${arg}`;
  }

  if (!out.help) {
    if (!out.source) out.error = out.error || '--source is required';
    if (!out.output) out.error = out.error || '--output is required';
  }

  return out;
}

function getDescribeOutput(topic, format, options) {
  const result = describe(topic, format, options);
  if (!result.ok) {
    throw new Error(`describe failed for ${topic}/${format}: ${result.error}`);
  }
  return result.output;
}

function normalizeLanguage(lang) {
  if (lang === 'ja' || lang === 'ja-JP') return 'ja-JP';
  if (lang === 'en' || lang === 'en-US') return 'en-US';
  throw new Error(`unsupported language: ${lang}`);
}

function renderPrompt(template, replacements) {
  let out = template;
  for (const [key, value] of Object.entries(replacements)) {
    out = out.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
  }
  return out;
}

function buildPromptBundle(options) {
  const lang = normalizeLanguage(options.lang || 'ja-JP');
  const describeOptions = {
    audience: 'ai',
    model: 'large',
    lang,
  };

  const sourceText = readFileUtf8(options.source);
  const template = readFileUtf8(TEMPLATE_PATH);
  const outputs = {
    promptAuthoringJson: getDescribeOutput('prompt-authoring', 'json', describeOptions),
    aiAuthoringJson: getDescribeOutput('ai-authoring', 'json', describeOptions),
    paramsJson: getDescribeOutput('params', 'json', describeOptions),
    checklistMd: getDescribeOutput('checklist', 'md', describeOptions),
    vocabMd: getDescribeOutput('vocab', 'md', describeOptions),
  };

  const prompt = renderPrompt(template, {
    output_filename: options.targetFile || 'output.ideamark.yaml',
    lang,
    describe_prompt_authoring_json: outputs.promptAuthoringJson,
    describe_ai_authoring_json: outputs.aiAuthoringJson,
    describe_params_json: outputs.paramsJson,
    describe_checklist_md: outputs.checklistMd,
    describe_vocab_md: outputs.vocabMd,
    source_text: sourceText,
  });

  return {
    prompt,
    describeOutputs: {
      'describe.prompt-authoring.json': `${outputs.promptAuthoringJson}\n`,
      'describe.ai-authoring.json': `${outputs.aiAuthoringJson}\n`,
      'describe.params.json': `${outputs.paramsJson}\n`,
      'describe.checklist.md': outputs.checklistMd.endsWith('\n') ? outputs.checklistMd : `${outputs.checklistMd}\n`,
      'describe.vocab.md': outputs.vocabMd.endsWith('\n') ? outputs.vocabMd : `${outputs.vocabMd}\n`,
    },
  };
}

function main() {
  const parsed = parseArgs(process.argv.slice(2));
  if (parsed.help) {
    writeStdout(`${usage()}\n`);
    process.exit(0);
  }
  if (parsed.error) {
    writeStderr(`${parsed.error}\n\n${usage()}\n`);
    process.exit(2);
  }

  try {
    const bundle = buildPromptBundle(parsed);
    writeFileUtf8(parsed.output, bundle.prompt);
    if (parsed.artifactsDir) {
      for (const [name, content] of Object.entries(bundle.describeOutputs)) {
        writeFileUtf8(path.join(parsed.artifactsDir, name), content);
      }
    }
    writeStdout(`${parsed.output}\n`);
  } catch (err) {
    writeStderr(`${err.message}\n`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  TEMPLATE_PATH,
  parseArgs,
  renderPrompt,
  buildPromptBundle,
};
