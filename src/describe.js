const fs = require('fs');
const path = require('path');
const YAML = require('yaml');
const { readFileUtf8 } = require('./utils');
const { parseDocument } = require('./parser');
const { diag, makeMeta, makeSummary } = require('./diagnostics');

const pkg = require('../package.json');

const CONTRACT_VERSION = '1.0.3';
const DOCUMENT_SPEC_VERSION = '1.0.3';

const PROFILE_MAP = {
  'ai-small': { audience: 'ai', model: 'small', lang: 'en-US' },
  'ai-large': { audience: 'ai', model: 'large', lang: 'en-US' },
  'human-easy': { audience: 'human', lang: 'ja-JP' },
  'human-advanced': { audience: 'human', lang: 'ja-JP' },
};

const BUILTIN_GUIDE_SOURCES = {
  'en-US': path.join(
    __dirname,
    '..',
    'docs',
    'dev',
    'v0.1.3',
    'ideamark-builtin-guides-sample.v0.1.3.ideamark.md'
  ),
  'ja-JP': path.join(
    __dirname,
    '..',
    'docs',
    'dev',
    'v0.1.3',
    'ideamark-builtin-guides-sample.v0.1.3.ja-JP.ideamark.md'
  ),
};

const guideCache = new Map();

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

function normalizeLang(value) {
  if (!value) return null;
  const v = String(value).toLowerCase();
  if (v === 'ja' || v === 'ja-jp') return 'ja-JP';
  if (v === 'en' || v === 'en-us') return 'en-US';
  return null;
}

function buildDescribeContext(format, options) {
  const input = options || {};
  const profile = input.profile ? PROFILE_MAP[input.profile] : null;
  if (input.profile && !profile) {
    return { ok: false, error: 'invalid_profile' };
  }

  let audience = input.audience || (profile && profile.audience) || null;
  if (!audience) {
    audience = format === 'json' ? 'ai' : 'human';
  }
  if (!['human', 'ai'].includes(audience)) {
    return { ok: false, error: 'invalid_audience' };
  }

  let model = input.model || (profile && profile.model) || null;
  if (!model && audience === 'ai') {
    model = format === 'json' ? 'small' : 'large';
  }
  if (model && !['small', 'large'].includes(model)) {
    return { ok: false, error: 'invalid_model' };
  }
  if (audience !== 'ai' && model) {
    return { ok: false, error: 'model_requires_ai' };
  }

  let lang = normalizeLang(input.lang) || (profile && profile.lang) || null;
  if (!lang) {
    lang = audience === 'human' ? 'ja-JP' : 'en-US';
  }

  return {
    ok: true,
    context: {
      audience,
      model: audience === 'ai' ? model : null,
      lang,
      profile: input.profile || null,
    },
  };
}

function buildCapabilities() {
  return {
    contract: {
      name: 'doc-cli-contract',
      version: CONTRACT_VERSION,
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
      routing: {
        supported: true,
        entrypoints: ['describe routing', 'describe ls'],
        selectors: ['view', 'domain', 'role'],
        fallback_search: true,
      },
      languages: {
        available: ['ja-JP', 'en-US'],
        default: {
          human: 'ja-JP',
          automation: 'en-US',
        },
      },
    },
    commands: {
      describe: {
        formats: ['md', 'json', 'yaml'],
        topics: ['ai-authoring', 'params', 'capabilities', 'checklist', 'vocab', 'ls', 'routing'],
        description:
          'Print tool guidance and discovery metadata for IdeaMark authoring and routing.',
        options: {
          '--format': {
            values: ['md', 'json', 'yaml'],
            description: 'Choose a human-readable or machine-readable output.',
          },
          '--audience': {
            values: ['human', 'ai'],
            description: 'Select the audience profile for describe output defaults.',
          },
          '--lang': {
            values: ['ja', 'en', 'ja-JP', 'en-US'],
            description: 'Select language for describe output and built-in guides.',
          },
          '--model': {
            values: ['small', 'large'],
            description: 'Select model profile for AI-oriented guidance output.',
          },
          '--profile': {
            values: Object.keys(PROFILE_MAP),
            description: 'Resolve describe options by profile alias.',
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
        },
      },
      lint: {
        formats: ['ndjson', 'json', 'md'],
        stdin: true,
        description:
          'Emit non-blocking diagnostics for IdeaMark documents. Does not modify input.',
        options: {
          '--strict': {
            description: 'Fail (exit 1) if any error-level diagnostics exist.',
          },
          '--format': {
            values: ['ndjson', 'json', 'md'],
            description: 'Output format.',
          },
          '--profile': {
            values: ['minimal', 'diagnostic', 'strict'],
            description: 'Select lint rule profile.',
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
}

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

function loadBuiltinGuide(language) {
  const lang = normalizeLang(language) || 'en-US';
  const cacheKey = lang;
  if (guideCache.has(cacheKey)) return guideCache.get(cacheKey);

  const file = BUILTIN_GUIDE_SOURCES[lang];
  if (!file || !fs.existsSync(file)) {
    const result = { ok: false, error: 'guide_source_missing' };
    guideCache.set(cacheKey, result);
    return result;
  }

  const doc = parseDocument(readFileUtf8(file));
  if (doc.parseErrors && doc.parseErrors.length > 0) {
    const result = { ok: false, error: 'guide_source_invalid' };
    guideCache.set(cacheKey, result);
    return result;
  }

  const sections = Object.entries(doc.registry.sections || {})
    .map(([id, value]) => {
      const anchorage = value && value.anchorage ? value.anchorage : {};
      return {
        id,
        view: anchorage.view || null,
        phase: anchorage.phase || null,
        domain: Array.isArray(anchorage.domain) ? anchorage.domain : [],
      };
    })
    .sort((a, b) => a.id.localeCompare(b.id));

  const views = new Set();
  const domains = new Set();
  for (const section of sections) {
    if (section.view) views.add(section.view);
    for (const d of section.domain) domains.add(d);
  }

  const guide = {
    id: 'ideamark.guides.builtin.v0.1.3.sample',
    language: lang,
    views: Array.from(views).sort(),
    domains: Array.from(domains).sort(),
    sections,
  };

  const result = { ok: true, guide };
  guideCache.set(cacheKey, result);
  return result;
}

function describeBuiltinLs(format, context, options) {
  const target = options.target || 'guides';
  if (target !== 'guides') return { ok: false, error: 'unsupported_target' };

  const loaded = loadBuiltinGuide(context.lang);
  if (!loaded.ok) return loaded;

  const includeSections = !!options.sections;
  const includeVocab = !!options.vocab;
  const guide = loaded.guide;

  const payload = {
    target: 'guides',
    audience: context.audience,
    language: guide.language,
    available_languages: ['ja-JP', 'en-US'],
    guides: [
      {
        id: guide.id,
        sections_count: guide.sections.length,
        views: guide.views,
        domains: guide.domains,
      },
    ],
  };

  if (includeSections) {
    payload.guides[0].sections = guide.sections;
  }

  if (includeVocab) {
    payload.vocab = {
      'anchorage.view': guide.views,
      'anchorage.domain': guide.domains,
    };
  }

  if (format === 'json') return { ok: true, output: JSON.stringify(payload) };
  if (format === 'yaml') return { ok: true, output: YAML.stringify(payload).trimEnd() };

  const lines = [
    '# Built-in Guides Catalog',
    '',
    `- target: ${payload.target}`,
    `- language: ${payload.language}`,
    `- available_languages: ${payload.available_languages.join(', ')}`,
    '',
  ];

  for (const g of payload.guides) {
    lines.push(`## ${g.id}`);
    lines.push(`- sections_count: ${g.sections_count}`);
    lines.push(`- views: ${g.views.join(', ')}`);
    lines.push(`- domains: ${g.domains.join(', ')}`);
    if (g.sections) {
      lines.push('- sections:');
      for (const section of g.sections) {
        lines.push(
          `  - ${section.id} (view=${section.view || 'n/a'}, phase=${section.phase || 'n/a'}, domain=${
            section.domain.join('|') || 'n/a'
          })`
        );
      }
    }
    lines.push('');
  }

  if (payload.vocab) {
    lines.push('## vocab');
    lines.push(`- anchorage.view: ${payload.vocab['anchorage.view'].join(', ')}`);
    lines.push(`- anchorage.domain: ${payload.vocab['anchorage.domain'].join(', ')}`);
    lines.push('');
  }

  return { ok: true, output: lines.join('\n') };
}

function routingNarrative(language) {
  if (language === 'ja-JP') {
    return {
      applies_to: [
        '要件・仕様を安定したID付き構造へ固定したいとき',
        '参照整合を取りながら再利用可能な知識にしたいとき',
      ],
      non_goals: [
        '反復的な作業項目の順序入れ替え中心の運用',
        'タスク実行ループの管理を主目的とする運用',
      ],
      complementary_tools: ['flowmark'],
      recommendation: {
        ideamark_first: '知識構造の安定化・検証が主目的なら IdeaMark を使う。',
        flowmark_first: '反復作業管理が主目的なら FlowMark を先に使う。',
        combined: '両方必要なら FlowMark -> IdeaMark の順で使う。',
      },
    };
  }

  return {
    applies_to: [
      'Stabilizing requirements/specs with durable section and entity IDs.',
      'Maintaining reusable knowledge with traceable references and validation.',
    ],
    non_goals: [
      'Managing iterative checklist execution with frequent ordering changes.',
      'Task-loop orchestration as the primary workflow.',
    ],
    complementary_tools: ['flowmark'],
    recommendation: {
      ideamark_first: 'Use IdeaMark first when structural knowledge stabilization is the main goal.',
      flowmark_first: 'Use FlowMark first when iterative task management is the main goal.',
      combined: 'If both are needed, use FlowMark -> IdeaMark.',
    },
  };
}

function describeRouting(format, context) {
  const loaded = loadBuiltinGuide(context.lang);
  if (!loaded.ok) return loaded;

  const routingSections = loaded.guide.sections
    .filter((section) => section.domain.includes('routing'))
    .map((section) => section.id);

  const narrative = routingNarrative(loaded.guide.language);
  const payload = {
    topic: 'routing',
    audience: context.audience,
    language: loaded.guide.language,
    selectors: ['view', 'domain', 'role'],
    ...narrative,
    source: {
      target: 'guides',
      section_ids: routingSections,
    },
  };

  if (format === 'json') return { ok: true, output: JSON.stringify(payload) };
  if (format === 'yaml') return { ok: true, output: YAML.stringify(payload).trimEnd() };

  const lines = [
    '# Routing Guide',
    '',
    `- language: ${payload.language}`,
    `- selectors: ${payload.selectors.join(', ')}`,
    '',
    '## Applies To',
    ...payload.applies_to.map((item) => `- ${item}`),
    '',
    '## Non-goals',
    ...payload.non_goals.map((item) => `- ${item}`),
    '',
    '## Complementary Tools',
    ...payload.complementary_tools.map((item) => `- ${item}`),
    '',
    '## Recommendation',
    `- ${payload.recommendation.ideamark_first}`,
    `- ${payload.recommendation.flowmark_first}`,
    `- ${payload.recommendation.combined}`,
    '',
    '## Source Sections',
    ...payload.source.section_ids.map((id) => `- ${id}`),
    '',
  ];

  return { ok: true, output: lines.join('\n') };
}

function describe(topic, format, options) {
  const contextResult = buildDescribeContext(format, options || {});
  if (!contextResult.ok) return { ok: false, error: contextResult.error };
  const context = contextResult.context;

  if (topic === 'ls') {
    return describeBuiltinLs(format, context, options || {});
  }

  if (topic === 'routing') {
    return describeRouting(format, context);
  }

  let data;
  if (topic === 'capabilities') data = buildCapabilities();
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
  } else {
    return { ok: false, error: 'unknown_topic' };
  }

  if (format === 'json') return { ok: true, output: JSON.stringify(data) };
  if (format === 'yaml') return { ok: true, output: YAML.stringify(data).trimEnd() };
  return { ok: true, output: toMarkdown(topic, data, context) };
}

function toMarkdown(topic, data, context) {
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
      'IdeaMark CLI for authoring support, validation, transformation, and routing-aware guidance discovery.',
      '',
      '## Commands',
      '### describe',
      `**Description:** ${data.commands.describe.description}`,
      '**Does:**',
      '- Provides authoring guidance and tool discovery topics.',
      '- Supports orthogonal audience/lang/model describe options.',
      '**Does not:**',
      '- Modify input files.',
      `**Formats:** \`${data.commands.describe.formats.join('`, `')}\``,
      `**Topics:** \`${data.commands.describe.topics.join('`, `')}\``,
      '**Input:** Not required',
      '',
      '**Key options**',
      '- `--format <md|json|yaml>` — Select output format.',
      '- `--audience <human|ai>` — Select default intent and language/model profile.',
      '- `--lang <ja|en|ja-JP|en-US>` — Select guidance language.',
      '- `--model <small|large>` — Use only when audience is `ai`.',
      '- `--profile <alias>` — Apply profile alias (`ai-small`, `ai-large`, `human-easy`, `human-advanced`).',
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
      '- `--fail-on <level>` — Not supported',
      '- `--level <level>` — Not supported',
      '- `--quiet` — Not supported',
      '',
      '### format',
      `**Description:** ${data.commands.format.description}`,
      `**Formats:** \`${data.commands.format.formats.join('`, `')}\``,
      '**Input:** file path, `-` (stdin)',
      '',
      '### lint',
      `**Description:** ${data.commands.lint.description}`,
      `**Formats:** \`${data.commands.lint.formats.join('`, `')}\``,
      '**Input:** file path, `-` (stdin)',
      '',
      '**Key options**',
      '- `--strict` — Fails when any error-level diagnostics exist.',
      '- `--profile <minimal|diagnostic|strict>` — Select lint rule profile.',
      '',
      '### extract',
      `**Description:** ${data.commands.extract.description}`,
      `**Formats:** \`${data.commands.extract.formats.join('`, `')}\``,
      '**Input:** file path, `-` (stdin)',
      '',
      '### compose',
      `**Description:** ${data.commands.compose.description}`,
      `**Formats:** \`${data.commands.compose.formats.join('`, `')}\``,
      '**Input:** file paths only',
      '',
      '### publish',
      `**Description:** ${data.commands.publish.description}`,
      `**Formats:** \`${data.commands.publish.formats.join('`, `')}\``,
      '**Input:** file path, `-` (stdin)',
      '',
      '### ls',
      `**Description:** ${data.commands.ls.description}`,
      `**Formats:** \`${data.commands.ls.formats.join('`, `')}\``,
      '**Input:** file path, `-` (stdin)',
      '',
      '## Evidence (Cross-cutting)',
      '- **Emit evidence:** Supported (yaml, ndjson)',
      '- **Attach evidence to a document:** Supported',
      '- **Artifact out:** Supported',
      '',
      '## Compatibility Notes',
      '- Unknown fields in capabilities JSON should be ignored by consumers.',
      `- Describe default context for this render: audience=${context.audience}, lang=${context.lang}, model=${context.model || 'n/a'}.`,
      `- Document spec baseline: ${DOCUMENT_SPEC_VERSION}.`,
      '',
      '## Machine-readable capabilities',
      'This Markdown output corresponds to:',
      '- `<tool> describe capabilities --format json`',
      '',
    ].join('\n');
  }

  if (topic === 'checklist') {
    return ['# strict checklist', '', ...data.strict_requirements.map((c) => `- ${c}`), ''].join('\n');
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

module.exports = { describe, buildDescribeContext };
