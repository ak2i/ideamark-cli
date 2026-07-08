# Development Guide

This guide summarizes the day-to-day development workflow for `ideamark-cli`, including local CLI testing with `npm link`, package verification, and npm package deployment.

The commands below assume the repository root is the current working directory.

## Scope

Use this document when you need to:

- run the CLI from source during development
- test local changes before committing
- expose the local checkout as the `ideamark` command with `npm link`
- verify package contents with `npm pack`
- run the release preflight and publish to npm
- troubleshoot common local development issues

## Prerequisites

- Node.js `>=20`
- npm bundled with the selected Node.js installation
- Git
- npm account access when publishing

Check the local toolchain:

```bash
node --version
npm --version
git --version
```

The package declares Node.js `>=20` in `package.json`. Use the same major Node version locally and in CI when possible.

## Repository setup

Clone and enter the repository:

```bash
git clone https://github.com/ak2i/ideamark-cli.git
cd ideamark-cli
```

Confirm that you are on `main` unless you intentionally work on another branch:

```bash
git branch --show-current
git status
```

Install dependencies:

```bash
npm install
```

The current runtime is CommonJS and the CLI entrypoint is:

```text
bin/ideamark.js
```

The installed command name is:

```text
ideamark
```

## Running the CLI directly from source

During quick local checks, run the CLI through Node without linking:

```bash
node bin/ideamark.js --version
node bin/ideamark.js --help
node bin/ideamark.js describe capabilities --format json
```

Validate a sample or fixture:

```bash
node bin/ideamark.js validate --strict docs/samples/04-rfc3986-uri-overview/rfc3986-uri-overview-sample.ideamark.yaml
```

When diagnosing command behavior, prefer the direct source invocation first. It avoids confusion with a globally linked or globally installed `ideamark` command.

## Local command testing with npm link

Use `npm link` when you want the local checkout to behave like an installed CLI package.

Create the global link from the repository root:

```bash
npm link
```

Confirm which executable is being used:

```bash
which ideamark
ideamark --version
ideamark --help
```

Run normal CLI checks through the linked command:

```bash
ideamark describe capabilities --format json
ideamark describe ai-authoring --format json --audience ai --model large --lang ja-JP
ideamark validate --strict docs/samples/04-rfc3986-uri-overview/rfc3986-uri-overview-sample.ideamark.yaml
ideamark ls docs/samples/04-rfc3986-uri-overview/rfc3986-uri-overview-sample.ideamark.yaml --sections --entities --skeletons --format json
```

After editing source files, the linked command reads the current checkout, so you usually do not need to run `npm link` again.

### Unlinking

Remove the global link when you want to return to a normal globally installed package or avoid accidental use of the development checkout:

```bash
npm unlink -g ideamark-cli
```

Then verify the command resolution:

```bash
which ideamark || true
ideamark --version
```

If `ideamark` still resolves to an unexpected path, inspect npm global binaries:

```bash
npm bin -g
npm root -g
```

## Development checks

Run the full internal test suite:

```bash
npm test
```

Run describe metadata consistency checks:

```bash
npm run check:describe
```

Run package dry-run checks:

```bash
npm run pack:dry-run
```

Run the v0.3.1 retrieval fixture harness:

```bash
npm run retrieval:v0.3.1
```

Older compatibility runners are still available:

```bash
npm run smoke:v0.1.3
npm run smoke:v0.3.0
npm run llm-metrics:v0.1.3
```

Recommended pre-commit check sequence:

```bash
npm test
npm run check:describe
npm run retrieval:v0.3.1
npm run pack:dry-run
```

If you changed generated describe guidance or package metadata, run `check:describe` before opening a PR or publishing.

## Working with describe guides

The `describe` command is part of the public tool contract. When editing guide files or runtime describe behavior, verify both human-facing and machine-readable outputs.

Useful checks:

```bash
node bin/ideamark.js describe capabilities --format json
node bin/ideamark.js describe capabilities --format md
node bin/ideamark.js describe ai-authoring --format json --audience ai --model large --lang ja-JP
node bin/ideamark.js describe params --format json --audience ai --model large --lang ja-JP
node bin/ideamark.js describe checklist --format md --audience ai --model large --lang ja-JP
node bin/ideamark.js describe vocab --format md --audience ai --model large --lang ja-JP
node bin/ideamark.js describe routing --format json
```

Then run:

```bash
npm run check:describe
```

This catches mismatches between runtime constants, guide JSON, package version, document spec version, and listed describe topics.

## Package contents verification

Before publishing, inspect the package payload:

```bash
npm pack --dry-run
```

The package uses the `files` array in `package.json`, so only listed paths are included in the npm artifact. If a new runtime file, script, guide, sample, release note, or spec must be distributed, add it to `package.json` and re-run:

```bash
npm run pack:dry-run
```

To create a local tarball for install testing:

```bash
npm pack
```

Install the tarball in another temporary project:

```bash
mkdir -p /tmp/ideamark-cli-install-test
cd /tmp/ideamark-cli-install-test
npm init -y
npm install /path/to/ideamark-cli/ideamark-cli-<version>.tgz
npx ideamark --version
npx ideamark --help
```

Replace `<version>` with the package version shown by `node -p "require('./package.json').version"` from the repository root.

## Release preflight

The release script has a safe default mode. It does not publish unless `--publish` is provided.

Run the release preflight:

```bash
npm run release
```

The preflight runs:

1. `npm test`
2. `npm pack --dry-run`
3. `npm pack`

Use this mode to verify that the package can be built and packed before publishing.

## Publishing to npm

Publishing is opt-in.

Before publishing:

```bash
git status
npm whoami
npm run check:describe
npm test
npm run release
```

Publish with the default `latest` dist-tag:

```bash
npm run release -- --publish
```

Publish with a non-latest dist-tag, for example `next`:

```bash
npm run release -- --publish --tag next
```

The release script runs `npm whoami` before `npm publish`, so authentication problems should fail before the publish step.

## Version and release metadata checklist

When preparing a new package version, check all version-bearing files that apply to the change:

- `package.json`
- `package-lock.json`, if changed by `npm install` or version updates
- `docs/release/v<version>.md`
- describe guide JSON files under `docs/guides/ideamark/`
- runtime describe constants referenced by `scripts/check-describe-sync.js`
- `README.md` version notes and command examples
- `package.json` `files` entries for any new distributable docs, guides, specs, samples, or scripts

Then run:

```bash
npm run check:describe
npm test
npm run pack:dry-run
```

## Main branch workflow

For direct updates on `main`:

```bash
git checkout main
git pull --ff-only origin main
npm install
npm test
npm run check:describe
npm run pack:dry-run
git status
```

After making changes, review the diff:

```bash
git diff --stat
git diff
```

Commit with a focused message:

```bash
git add <changed-files>
git commit -m "docs: update development workflow"
git push origin main
```

If `git push origin main` fails with `origin` missing, add the remote explicitly:

```bash
git remote -v
git remote add origin https://github.com/ak2i/ideamark-cli.git
git push -u origin main
```

If `origin` exists but points to the wrong URL:

```bash
git remote set-url origin https://github.com/ak2i/ideamark-cli.git
git push origin main
```

## Troubleshooting

### `ideamark` runs an old version

Check whether the command comes from a linked checkout, global install, or project-local dependency:

```bash
which ideamark
ideamark --version
npm ls -g ideamark-cli --depth=0
```

For a linked checkout, re-run the command from the repository and confirm the source version:

```bash
node -p "require('./package.json').version"
node bin/ideamark.js --version
```

### `npm link` points to the wrong checkout

Unlink and link again from the intended repository root:

```bash
npm unlink -g ideamark-cli
cd /path/to/ideamark-cli
npm link
which ideamark
ideamark --version
```

### Publish fails because the package is private

The release script refuses to publish when `package.json` has `private: true`. Confirm the package metadata before release:

```bash
node -p "require('./package.json').private"
node -p "require('./package.json').name + '@' + require('./package.json').version"
```

### Describe outputs fail consistency checks

Run the check and inspect the failing field:

```bash
npm run check:describe
```

Common causes are:

- package version changed but guide JSON still has the old tool version
- document spec version changed in runtime constants but not in guide metadata
- a new describe topic was implemented but not listed in capabilities or the manifest

### Package tarball misses a file

Run:

```bash
npm pack --dry-run
```

If a required file is missing, add it to the `files` array in `package.json`, then re-run the dry run.

## Quick command reference

```bash
# install
npm install

# direct source CLI
node bin/ideamark.js --version
node bin/ideamark.js --help

# global local link
npm link
ideamark --version
npm unlink -g ideamark-cli

# tests and checks
npm test
npm run check:describe
npm run retrieval:v0.3.1
npm run pack:dry-run

# release preflight
npm run release

# publish
npm run release -- --publish
npm run release -- --publish --tag next
```
