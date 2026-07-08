#!/usr/bin/env node
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function run(command, args, options = {}) {
  const display = [command, ...args].join(' ');
  console.log(`\n$ ${display}`);
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    ...options,
  });
  if (result.error) {
    console.error(`\nrelease: failed to run ${display}`);
    console.error(result.error.message);
    process.exit(1);
  }
  if (result.status !== 0) {
    console.error(`\nrelease: command failed with exit code ${result.status}: ${display}`);
    process.exit(result.status || 1);
  }
}

function usage() {
  console.log([
    'Usage:',
    '  npm run release',
    '  npm run release -- --publish',
    '  npm run release -- --publish --tag next',
    '',
    'Default mode is a safe release preflight:',
    '  1. npm test',
    '  2. npm pack --dry-run',
    '  3. npm pack',
    '',
    'Publishing is opt-in. Add --publish to run npm publish after the preflight.',
    'Scoped packages are published with --access public.',
  ].join('\n'));
}

const args = process.argv.slice(2);
if (args.includes('-h') || args.includes('--help')) {
  usage();
  process.exit(0);
}

const publish = args.includes('--publish');
let tag = 'latest';
for (let i = 0; i < args.length; i += 1) {
  if (args[i] === '--tag') {
    tag = args[i + 1];
    if (!tag || tag.startsWith('-')) {
      console.error('release: --tag requires a value.');
      process.exit(2);
    }
  }
}

const allowedArgs = new Set(['--publish', '--tag']);
for (let i = 0; i < args.length; i += 1) {
  const value = args[i];
  if (value === '--tag') {
    i += 1;
    continue;
  }
  if (!allowedArgs.has(value)) {
    console.error(`release: unknown option: ${value}`);
    usage();
    process.exit(2);
  }
}

const root = path.resolve(__dirname, '..');
const pkgPath = path.join(root, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

if (pkg.private === true) {
  console.error('release: package.json has private=true. Refusing to release.');
  process.exit(1);
}

console.log(`release: preparing ${pkg.name}@${pkg.version}`);
console.log(`release: publish=${publish ? 'yes' : 'no'} tag=${tag}`);

run('npm', ['test'], { cwd: root });
run('npm', ['pack', '--dry-run'], { cwd: root });
run('npm', ['pack'], { cwd: root });

if (!publish) {
  console.log('\nrelease: preflight complete. No package was published.');
  console.log('release: publish with: npm run release -- --publish');
  process.exit(0);
}

run('npm', ['whoami'], { cwd: root });
const publishArgs = ['publish', '--tag', tag];
if (pkg.name && pkg.name.startsWith('@')) {
  publishArgs.push('--access', 'public');
}
run('npm', publishArgs, { cwd: root });
console.log(`\nrelease: published ${pkg.name}@${pkg.version} with dist-tag ${tag}`);
