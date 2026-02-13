const fs = require('fs');
const path = require('path');

function readInput(inputPath) {
  if (!inputPath || inputPath === '-') {
    return fs.readFileSync(0, 'utf8');
  }
  return fs.readFileSync(inputPath, 'utf8');
}

function writeOutput(content, outPath) {
  if (!outPath || outPath === '-') {
    process.stdout.write(content);
    return;
  }
  fs.writeFileSync(outPath, content, 'utf8');
}

function resolveGoalTemplate(goal) {
  const baseDir = path.resolve(__dirname, '..', '..', 'docs', 'dev', 'v0.1.0', 'internal', 'goals');
  const map = {
    'guides.flowmark': 'guides.flowmark.md',
    'guides.ideamark': 'guides.ideamark.md',
    'spec.cli': 'spec.cli.md'
  };
  const fileName = map[goal];
  if (!fileName) return null;
  return path.join(baseDir, fileName);
}

function ensureTrailingNewline(text) {
  if (text.endsWith('\n')) return text;
  return text + '\n';
}

module.exports = {
  readInput,
  writeOutput,
  resolveGoalTemplate,
  ensureTrailingNewline
};
