const fs = require('fs');
const path = require('path');
const YAML = require('yaml');
const { readFileUtf8 } = require('./utils');
const { diag, makeMeta, makeSummary } = require('./diagnostics');

const pkg = require('../package.json');

const CAPABILITIES = {
  contract: {
    name: 'doc-cli-contract',
    version: '1.0.2',
  },
  tool: {
    name: 'ideamark-cli',
    version: pkg.version,
  },
  features: {
    evidence: {
      emit: ['yaml', 'ndjson'],
      attach: true,
      artifact_out: true,
    },
  },
  commands: {
    describe: {
      formats: ['md', 'json', 'yaml'],
      topics: ['ai-authoring', 'params', 'capabilities', 'checklist', 'vocab'],
      description:
        'Print tool guidance and authoring references for IdeaMark documents.',
      options: {
        '--format': {
          values: ['md', 'json', 'yaml'],
          description: 'Choose a human-readable or machine-readable output.',
        },
      },
    },
    validate: {
      formats: ['ndjson'],
      stdin: true,
      description:
        'Check whether a document conforms to IdeaMark rules and emit diagnostics.',
      options: {
        '--strict': {
          description: 'Enable stricter validation checks.',
        },
        '--mode': {
          values: ['working', 'strict'],
          description: 'Select validation mode.',
        },
        '--fail-on-warn': {
          description: 'Fail the command if any warning is emitted.',
        },
        '--emit-evidence': {
          values: ['yaml', 'ndjson'],
          description: 'Emit an evidence record for the validation result.',
        },
        '--evidence-scope': {
          values: ['document', 'section', 'entity', 'occurrence'],
          description: 'Scope for evidence attachment or reporting.',
        },
        '--evidence-target': {
          description: 'Target ID for section/entity/occurrence scoped evidence.',
        },
        '--attach': {
          description: 'Attach evidence to the input document and write output.',
        },
        '--artifact-out': {
          description: 'Write evidence data to an external artifact file.',
        },
      },
    },
    format: {
      formats: ['md'],
      stdin: true,
      description: 'Normalize IdeaMark documents without changing meaning.',
    },
    extract: {
      formats: ['md'],
      stdin: true,
      description: 'Extract a section or occurrence into a new document.',
    },
    compose: {
      formats: ['md'],
      stdin: false,
      description: 'Compose multiple IdeaMark documents into a single output.',
    },
    publish: {
      formats: ['md'],
      stdin: true,
      description: 'Finalize a working document into a publishable form.',
    },
    ls: {
      formats: ['json', 'md'],
      stdin: true,
      description: 'List IDs and vocab present in a document.',
    },
  },
};

const CHECKLIST = {
  strict_requirements: [
    'header_required',
    'header_singleton',
    'yaml_parseable',
    'id_unique_within_doc',
    'anchorage_required',
    'occurrence_required',
    'entity_ref_valid',
    'occurrence_ref_valid',
    'section_ref_valid',
    'structure_sections_exist',
  ],
};

const VOCAB = {
  anchorage_view: [
    'problem',
    'solution',
    'comparison',
    'discussion',
    'decision',
    'background',
    'pending',
    'structural_hypothesis',
    'observation_series',
    'causal_network',
    'state_transition',
    'event_sequence',
  ],
  anchorage_phase: ['hypothesis', 'exploration', 'plan', 'outcome', 'confirmed', 'evolving'],
  doc_type: ['source', 'derived', 'evolving', 'pattern'],
  status_state: ['in_progress', 'paused', 'completed', 'published'],
};

const TEMPLATE_DIR = path.join(__dirname, '..', 'docs', 'guides', 'ideamark');
const TEMPLATE_MAP = {
  'ai-authoring': {
    json: 'ai-authoring.json',
    md: 'ai-authoring.md',
  },
  params: {
    json: 'params.json',
    md: 'params.md',
  },
};

const FORMAT_FALLBACKS = {
  json: ['json', 'yaml', 'md'],
  yaml: ['yaml', 'json', 'md'],
  md: ['md', 'yaml', 'json'],
};

function resolveTemplate(topic, format) {
  const map = TEMPLATE_MAP[topic];
  if (!map) return null;
  const candidates = FORMAT_FALLBACKS[format] || [format, 'md', 'json', 'yaml'];
  for (const fmt of candidates) {
    const rel = map[fmt];
    if (!rel) continue;
    const full = path.join(TEMPLATE_DIR, rel);
    if (fs.existsSync(full)) return full;
  }
  return null;
}

function describe(topic, format) {
  let data;
  if (topic === 'capabilities') data = CAPABILITIES;
  else if (topic === 'checklist') data = CHECKLIST;
  else if (topic === 'vocab') data = VOCAB;
  else if (TEMPLATE_MAP[topic]) {
    const template = resolveTemplate(topic, format);
    if (!template) {
      const meta = makeMeta('working');
      const diagEntry = diag(
        'error',
        'template_missing',
        `Template not found for ${topic}`,
        { scope: 'describe' },
        'working'
      );
      const diagnostics = [meta, diagEntry, makeSummary([diagEntry])];
      return { ok: false, error: 'template_missing', diagnostics };
    }
    return { ok: true, output: readFileUtf8(template) };
  } else return { ok: false, error: 'unknown topic' };

  if (format === 'json') return { ok: true, output: JSON.stringify(data) };
  if (format === 'yaml') return { ok: true, output: YAML.stringify(data).trimEnd() };
  return { ok: true, output: toMarkdown(topic, data) };
}

function toMarkdown(topic, data) {
  if (topic === 'capabilities') {
    const toolName = data.tool.name;
    const toolVersion = data.tool.version;
    const contractVersion = data.contract.version;
    return [
      `# ${toolName}`,
      `**Tool Version:** ${toolVersion}`,
      `**Doc CLI Contract:** ${contractVersion}`,
      '',
      '## Summary',
      'IdeaMark CLI for validating, formatting, and composing IdeaMark Markdown documents.',
      '',
      '## Commands',
      'List supported commands. For each command, include:',
      '- **What it does**',
      '- **What it does not do**',
      '- **Formats**',
      '- **Inputs** (file/stdin)',
      '- **Key options** (only the important ones)',
      '',
      '### describe',
      `**Description:** ${data.commands.describe.description}`,
      '**Does:**',
      '- Prints tool guidance and authoring references.',
      '**Does not:**',
      '- Modify input files.',
      `**Formats:** \`${data.commands.describe.formats.join('`, `')}\``,
      `**Topics:** \`${data.commands.describe.topics.join('`, `')}\``,
      '**Input:** file path, `-` (stdin)',
      '',
      '**Key options**',
      '- `--format <md|json|yaml>` — Choose a human-readable (md) or machine-readable (json/yaml) output.',
      '- `--quiet` — Not supported',
      '',
      '### validate',
      `**Description:** ${data.commands.validate.description}`,
      '**Does:**',
      '- Checks required fields, references, and structural constraints.',
      '**Does not:**',
      '- Modify input files.',
      '- Resolve external references.',
      `**Formats:** \`${data.commands.validate.formats.join('`, `')}\``,
      '**Input:** file path, `-` (stdin)',
      '',
      '**Diagnostics / severity**',
      '- **Levels:** `error`, `warning`, `info`',
      '- **Default fail-on:** `error`',
      '- **Strict mode:** Supported',
      '',
      '**Key options**',
      '- `--strict` — Enables stricter validation checks.',
      '- `--fail-on-warn` — Fails if any warning exists.',
      '- `--level <level>` — Not supported',
      '- `--quiet` — Not supported',
      '',
      '### format',
      `**Description:** ${data.commands.format.description}`,
      '**Does:**',
      '- Normalizes formatting and keeps semantic content.',
      '**Does not:**',
      '- Change document meaning.',
      `**Formats:** \`${data.commands.format.formats.join('`, `')}\``,
      '**Input:** file path, `-` (stdin)',
      '',
      '**Key options**',
      '- `--canonical` — Produce canonical YAML blocks.',
      '- `--diagnostics <stderr|stdout|file>` — Choose diagnostics output target.',
      '',
      '### extract',
      `**Description:** ${data.commands.extract.description}`,
      '**Does:**',
      '- Extracts a section or occurrence into a new document.',
      '**Does not:**',
      '- Merge content from multiple documents.',
      `**Formats:** \`${data.commands.extract.formats.join('`, `')}\``,
      '**Input:** file path, `-` (stdin)',
      '',
      '**Key options**',
      '- `--section <id>` — Extract a section by ID.',
      '- `--occ <id>` — Extract an occurrence by ID.',
      '',
      '### compose',
      `**Description:** ${data.commands.compose.description}`,
      '**Does:**',
      '- Merges multiple documents into a single output.',
      '**Does not:**',
      '- Read from stdin.',
      `**Formats:** \`${data.commands.compose.formats.join('`, `')}\``,
      '**Input:** file paths only',
      '',
      '**Key options**',
      '- `--update` — Update an existing document instead of creating a new one.',
      '- `--inherit <mode>` — Control inheritance behavior.',
      '',
      '### publish',
      `**Description:** ${data.commands.publish.description}`,
      '**Does:**',
      '- Finalizes a working document.',
      '**Does not:**',
      '- Validate external references.',
      `**Formats:** \`${data.commands.publish.formats.join('`, `')}\``,
      '**Input:** file path, `-` (stdin)',
      '',
      '**Key options**',
      '- `--diagnostics <stderr|stdout|file>` — Choose diagnostics output target.',
      '',
      '### ls',
      `**Description:** ${data.commands.ls.description}`,
      '**Does:**',
      '- Lists IDs, occurrences, entities, and vocab from a document.',
      '**Does not:**',
      '- Modify input files.',
      `**Formats:** \`${data.commands.ls.formats.join('`, `')}\``,
      '**Input:** file path, `-` (stdin)',
      '',
      '**Key options**',
      '- `--sections|--occurrences|--entities|--vocab` — Filter output categories.',
      '- `--format <json|md>` — Choose output format.',
      '',
      '## Evidence (Cross-cutting)',
      '- **Emit evidence:** Supported (yaml, ndjson)',
      '- **Attach evidence to a document:** Supported',
      '- **Artifact out:** Supported',
      '',
      '## Compatibility Notes',
      'Unknown fields in capabilities JSON should be ignored by consumers.',
      '',
      '## Machine-readable capabilities',
      'This Markdown output corresponds to:',
      '- `<tool> describe capabilities --format json`',
      '',
    ].join('\n');
  }
  if (topic === 'checklist') {
    return [
      '# strict checklist',
      '',
      ...data.strict_requirements.map((c) => `- ${c}`),
      '',
    ].join('\n');
  }
  return [
    '# vocab',
    '',
    'anchorage.view:',
    ...data.anchorage_view.map((c) => `- ${c}`),
    '',
    'anchorage.phase:',
    ...data.anchorage_phase.map((c) => `- ${c}`),
    '',
    'doc_type:',
    ...data.doc_type.map((c) => `- ${c}`),
    '',
    'status.state:',
    ...data.status_state.map((c) => `- ${c}`),
    '',
  ].join('\n');
}

module.exports = { describe };
