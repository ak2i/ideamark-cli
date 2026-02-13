#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { extractSectionsFromText } = require('../src/commands/extract');
const { composeDocuments } = require('../src/commands/compose');
const { describeDocuments } = require('../src/commands/describe');
const { validateText } = require('../src/commands/validate');
const { readInput, writeOutput } = require('../src/commands/utils');

function printHelp() {
  const msg = `ideamark CLI (v0.1.0)

Usage:
  ideamark extract sections --input <path|-> [--select '<selector>'] [--format md|json]
  ideamark compose --inputs <path>... [--select '<selector>'] [--format md|json]
  ideamark describe --inputs <path>... --goal <goal> [--select '<selector>'] [--format md|json]
  ideamark validate --input <path|->

Options:
  --input <path|->
  --inputs <path>...
  --select <selector>
  --format md|json
  --include-yaml section|none
  --include-body true|false
  --limit <n>
  --with-provenance
  --provenance-style frontmatter|footer|both
  --sort default|structure|file|timestamp
  --goal guides.flowmark|guides.ideamark|spec.cli
  --out <path|->
  --version
  --help
`;
  process.stdout.write(msg);
}

function readVersion() {
  const pkgPath = path.resolve(__dirname, '..', 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  return pkg.version || '0.0.0';
}

function parseArgs(argv) {
  const opts = {
    format: 'md',
    includeYaml: 'section',
    includeBody: true,
    withProvenance: false,
    provenanceStyle: 'frontmatter',
    sort: 'default'
  };

  let command = null;
  let subcommand = null;
  let i = 0;

  while (i < argv.length) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      opts.help = true;
      i += 1;
      continue;
    }
    if (arg === '--version') {
      opts.version = true;
      i += 1;
      continue;
    }
    if (!command) {
      command = arg;
      i += 1;
      continue;
    }
    if (command === 'extract' && !subcommand && !arg.startsWith('-')) {
      subcommand = arg;
      i += 1;
      continue;
    }

    if (arg === '--input') {
      opts.input = argv[i + 1];
      i += 2;
      continue;
    }
    if (arg === '--inputs') {
      const inputs = [];
      let j = i + 1;
      while (j < argv.length && !argv[j].startsWith('-')) {
        inputs.push(argv[j]);
        j += 1;
      }
      opts.inputs = (opts.inputs || []).concat(inputs);
      i = j;
      continue;
    }
    if (arg === '--select') {
      opts.select = argv[i + 1];
      i += 2;
      continue;
    }
    if (arg === '--format') {
      opts.format = argv[i + 1] || opts.format;
      i += 2;
      continue;
    }
    if (arg === '--include-yaml') {
      opts.includeYaml = argv[i + 1] || opts.includeYaml;
      i += 2;
      continue;
    }
    if (arg === '--include-body') {
      const value = argv[i + 1];
      opts.includeBody = value !== 'false';
      i += 2;
      continue;
    }
    if (arg === '--limit') {
      opts.limit = Number(argv[i + 1]);
      i += 2;
      continue;
    }
    if (arg === '--with-provenance') {
      opts.withProvenance = true;
      i += 1;
      continue;
    }
    if (arg === '--provenance-style') {
      opts.provenanceStyle = argv[i + 1] || opts.provenanceStyle;
      i += 2;
      continue;
    }
    if (arg === '--sort') {
      opts.sort = argv[i + 1] || opts.sort;
      i += 2;
      continue;
    }
    if (arg === '--goal') {
      opts.goal = argv[i + 1];
      i += 2;
      continue;
    }
    if (arg === '--out') {
      opts.out = argv[i + 1];
      i += 2;
      continue;
    }

    i += 1;
  }

  return { command, subcommand, opts };
}

function run() {
  const { command, subcommand, opts } = parseArgs(process.argv.slice(2));

  if (opts.version) {
    process.stdout.write(readVersion() + '\n');
    return process.exit(0);
  }

  if (opts.help || !command) {
    printHelp();
    return process.exit(opts.help ? 0 : 1);
  }

  try {
    if (command === 'extract') {
      if (subcommand !== 'sections') {
        throw new Error('Unknown extract target. Use: ideamark extract sections');
      }
      const inputPath = opts.input;
      if (!inputPath && process.stdin.isTTY) {
        throw new Error('Missing --input <path|->');
      }
      const text = readInput(inputPath || '-');
      const result = extractSectionsFromText(text, {
        selector: opts.select,
        includeYaml: opts.includeYaml,
        includeBody: opts.includeBody,
        limit: opts.limit,
        path: inputPath || null
      });
      if (result.errors && result.errors.length > 0) {
        process.stderr.write(JSON.stringify({ errors: result.errors }, null, 2) + '\n');
        return process.exit(1);
      }

      if (opts.format === 'json') {
        const payload = { doc: result.doc, sections: result.sections };
        writeOutput(JSON.stringify(payload, null, 2) + '\n', opts.out);
        return process.exit(0);
      }

      const output = result.sections.map((s) => s.markdown).join('\n\n');
      writeOutput(output + (output.endsWith('\n') ? '' : '\n'), opts.out);
      return process.exit(0);
    }

    if (command === 'compose') {
      const inputs = opts.inputs || [];
      if (inputs.length === 0) {
        throw new Error('Missing --inputs <path>...');
      }
      const docs = inputs.map((inputPath) => ({
        path: inputPath,
        text: readInput(inputPath)
      }));

      const result = composeDocuments(docs, {
        selector: opts.select,
        sort: opts.sort,
        limit: opts.limit,
        withProvenance: opts.withProvenance,
        provenanceStyle: opts.provenanceStyle
      });

      if (opts.format === 'json') {
        writeOutput(JSON.stringify(result, null, 2) + '\n', opts.out);
        return process.exit(0);
      }

      writeOutput(result.composed, opts.out);
      return process.exit(0);
    }

    if (command === 'describe') {
      const inputs = opts.inputs || [];
      if (inputs.length === 0) {
        throw new Error('Missing --inputs <path>...');
      }
      if (!opts.goal) {
        throw new Error('Missing --goal <goal>');
      }

      const docs = inputs.map((inputPath) => ({
        path: inputPath,
        text: readInput(inputPath)
      }));

      const result = describeDocuments(docs, {
        selector: opts.select,
        goal: opts.goal,
        format: opts.format,
        sort: opts.sort,
        withProvenance: true,
        provenanceStyle: opts.provenanceStyle
      });

      if (opts.format === 'json') {
        writeOutput(JSON.stringify(result, null, 2) + '\n', opts.out);
        return process.exit(0);
      }

      writeOutput(result.prompt, opts.out);
      return process.exit(0);
    }

    if (command === 'validate') {
      const inputPath = opts.input;
      if (!inputPath && process.stdin.isTTY) {
        throw new Error('Missing --input <path|->');
      }
      const text = readInput(inputPath || '-');
      const result = validateText(text);
      writeOutput(JSON.stringify(result, null, 2) + '\n', opts.out);
      if (result.errors.length > 0) return process.exit(2);
      if (result.warnings.length > 0) return process.exit(1);
      return process.exit(0);
    }

    throw new Error(`Unknown command: ${command}`);
  } catch (err) {
    const msg = err && err.message ? err.message : String(err);
    if (msg.includes('selector')) {
      process.stderr.write(msg + '\n');
      return process.exit(3);
    }
    process.stderr.write(msg + '\n');
    return process.exit(1);
  }
}

run();
