#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const manifestPath = path.join(root, 'docs', 'guides', 'ideamark', 'describe-manifest.json');

function fail(message) {
  console.error(`check:describe: ${message}`);
  process.exitCode = 1;
}

function readJson(relativePath) {
  const fullPath = path.join(root, relativePath);
  try {
    return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  } catch (error) {
    fail(`${relativePath} is not valid JSON: ${error.message}`);
    return null;
  }
}

function hasOwn(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}

function runIdeamark(args) {
  const result = spawnSync(process.execPath, [path.join(root, 'bin', 'ideamark.js'), ...args], {
    cwd: root,
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    fail(`ideamark ${args.join(' ')} failed with exit code ${result.status}`);
    if (result.stderr) console.error(result.stderr.trim());
    return null;
  }
  return result.stdout;
}

function assertEqual(label, actual, expected) {
  if (actual !== expected) {
    fail(`${label} mismatch: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

function checkRequiredPath(object, relativePath, label) {
  let current = object;
  for (const key of relativePath.split('.')) {
    if (!current || typeof current !== 'object' || !hasOwn(current, key)) {
      fail(`${label} missing required field ${relativePath}`);
      return undefined;
    }
    current = current[key];
  }
  return current;
}

const manifest = readJson('docs/guides/ideamark/describe-manifest.json');
const pkg = readJson('package.json');
if (!manifest || !pkg) process.exit(1);

const describeJs = fs.readFileSync(path.join(root, manifest.runtime_constants.file), 'utf8');
const contractConst = new RegExp(`const\\s+${manifest.runtime_constants.contract}\\s*=\\s*['\"]([^'\"]+)['\"]`).exec(describeJs);
const documentSpecConst = new RegExp(`const\\s+${manifest.runtime_constants.document_spec}\\s*=\\s*['\"]([^'\"]+)['\"]`).exec(describeJs);

if (!contractConst) fail(`Cannot find ${manifest.runtime_constants.contract} in ${manifest.runtime_constants.file}`);
if (!documentSpecConst) fail(`Cannot find ${manifest.runtime_constants.document_spec} in ${manifest.runtime_constants.file}`);
if (contractConst) assertEqual('runtime contract version', contractConst[1], manifest.doc_cli_contract_version);
if (documentSpecConst) assertEqual('runtime document spec version', documentSpecConst[1], manifest.document_spec_version);

for (const guide of manifest.json_guides) {
  const doc = readJson(guide.file);
  if (!doc) continue;
  assertEqual(`${guide.file} contract.name`, checkRequiredPath(doc, 'contract.name', guide.file), 'doc-cli-contract');
  assertEqual(`${guide.file} contract.version`, checkRequiredPath(doc, 'contract.version', guide.file), manifest.doc_cli_contract_version);
  assertEqual(`${guide.file} tool.name`, checkRequiredPath(doc, 'tool.name', guide.file), manifest.tool);
  assertEqual(`${guide.file} tool.version`, checkRequiredPath(doc, 'tool.version', guide.file), pkg.version);
  assertEqual(`${guide.file} document.name`, checkRequiredPath(doc, 'document.name', guide.file), 'ideamark');
  assertEqual(`${guide.file} document.version`, checkRequiredPath(doc, 'document.version', guide.file), manifest.document_spec_version);
  assertEqual(`${guide.file} document.representation`, checkRequiredPath(doc, 'document.representation', guide.file), manifest.document_representation);
}

const capabilitiesText = runIdeamark(['describe', 'capabilities', '--format', 'json']);
if (capabilitiesText) {
  try {
    const capabilities = JSON.parse(capabilitiesText);
    assertEqual('describe capabilities tool.version', checkRequiredPath(capabilities, 'tool.version', 'capabilities'), pkg.version);
    assertEqual('describe capabilities contract.version', checkRequiredPath(capabilities, 'contract.version', 'capabilities'), manifest.doc_cli_contract_version);
    assertEqual('describe capabilities document.version', checkRequiredPath(capabilities, 'document.version', 'capabilities'), manifest.document_spec_version);
    const topics = checkRequiredPath(capabilities, 'commands.describe.topics', 'capabilities');
    if (Array.isArray(topics)) {
      for (const topic of manifest.describe_topics) {
        if (!topics.includes(topic)) fail(`describe capabilities does not list topic ${topic}`);
      }
    } else {
      fail('describe capabilities commands.describe.topics is not an array');
    }
  } catch (error) {
    fail(`describe capabilities --format json is not valid JSON: ${error.message}`);
  }
}

for (const guide of manifest.json_guides) {
  const output = runIdeamark(['describe', guide.topic, '--format', 'json']);
  if (!output) continue;
  try {
    const doc = JSON.parse(output);
    assertEqual(`describe ${guide.topic} tool.version`, checkRequiredPath(doc, 'tool.version', guide.topic), pkg.version);
    assertEqual(`describe ${guide.topic} contract.version`, checkRequiredPath(doc, 'contract.version', guide.topic), manifest.doc_cli_contract_version);
    assertEqual(`describe ${guide.topic} document.version`, checkRequiredPath(doc, 'document.version', guide.topic), manifest.document_spec_version);
  } catch (error) {
    fail(`describe ${guide.topic} --format json is not valid JSON: ${error.message}`);
  }
}

if (process.exitCode) {
  console.error('\ncheck:describe: failed');
  process.exit(process.exitCode);
}

console.log('check:describe: ok');
