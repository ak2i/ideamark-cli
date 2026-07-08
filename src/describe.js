const fs = require('fs');
const path = require('path');
const YAML = require('yaml');
const { readFileUtf8 } = require('./utils');
const { diag, makeMeta, makeSummary } = require('./diagnostics');

const pkg = require('../package.json');

const CONTRACT_VERSION = '1.2.0-draft.2';
const DOCUMENT_SPEC_VERSION = 'ideamark-core-v1.2.0';
const TOOL_NAME = 'ideamark-cli';
const TOOL_COMMAND = 'ideamark';

const PROFILE_MAP = {
  'ai-small': { audience: 'ai', model: 'small', lang: 'en-US' },
  'ai-large': { audience: 'ai', model: 'large', lang: 'en-US' },
  'human-easy': { audience: 'human', lang: 'ja-JP' },
  'human-advanced': { audience: 'human', lang: 'ja-JP' },
};

const TEMPLATE_DIR = path.join(__dirname, '..', 'docs', 'guides', 'ideamark');
const TEMPLATE_MAP = {
  'ai-authoring': { json: 'ai-authoring.json', md: 'ai-authoring.md' },
  'prompt-authoring': { json: 'prompt-authoring.json', md: 'prompt-authoring.md' },
  params: { json: 'params.json', md: 'params.md' },
};

const FORMAT_FALLBACKS = {
  json: ['json', 'yaml', 'md'],
  yaml: ['yaml', 'json', 'md'],
  md: ['md', 'yaml', 'json'],
};

const CHECKLIST = {
  strict_requirements: [
    'header_required',
    'header_singleton',
    'yaml_parseable',
    'entity_required',
    'id_unique_within_doc',
    'occurrence_required',
    'section_required',
    'entity_payload_required',
    'entity_payload_content_required',
    'entity_payload_ref_uri_required',
    'occurrence_entity_required',
    'occurrence_role_required',
    'entity_ref_valid',
    'occurrence_ref_valid',
    'section_occurrences_required',
    'relation_ref_valid',
  ],
  skeleton_basic_shape: [
    'SKEL-01 skeletons array shape',
    'SKEL-03 graph id validity',
    'SKEL-05/SKEL-06 nodes and links arrays',
    'SKEL-07/SKEL-08 node and link ids',
    'SKEL-09 link endpoints resolve inside the graph',
    'SKEL-10 node refs resolve to Core objects when local',
  ],
};

const VOCAB = {
  atomicity_basis: ['interpretive', 'lexical', 'structural'],
  doc_type: ['source', 'derived', 'evolving', 'pattern'],
  status_state: ['in_progress', 'paused', 'completed', 'published'],
  occurrence_role_examples: ['claim', 'evidence', 'observation', 'assumption', 'constraint', 'objective'],
  relation_ref_targets: ['entity_ref', 'section_ref'],
  skeleton_role_examples: ['retrieval', 'projection', 'authoring', 'comparison'],
  skeleton_status_examples: ['draft', 'active', 'deprecated'],
  skeleton_slot_examples: ['problem', 'constraint', 'evidence', 'substitution', 'outcome'],
  skeleton_link_type_examples: ['depends_on', 'supports', 'contrasts', 'replaces', 'requires', 'enables'],
};

const DISCOVERY_SELECTORS = [
  'source.type',
  'occurrence.role',
  'entity.kind',
  'anchor.type',
  'skeleton.role',
  'skeleton.slot',
];

const BUILTIN_GUIDES = [
  {
    id: 'ideamark.guides.routing',
    topic: 'routing',
    title: 'IdeaMark routing guide',
    description: 'Discovery metadata for deciding when IdeaMark applies in a v1.2.0 tool chain.',
    formats: ['md', 'json', 'yaml'],
    languages: ['ja-JP', 'en-US'],
    domains: ['routing', 'scope', 'discovery'],
    views: ['background', 'decision'],
    sections: [
      {
        id: 'SEC-IMK-SCOPE-BACKGROUND',
        title: 'IdeaMark scope background',
        view: 'background',
        domains: ['routing', 'scope'],
        selectors: ['source.type', 'occurrence.role', 'entity.kind', 'anchor.type'],
        summary: 'Use IdeaMark when the problem centers on stable, reusable knowledge structure with durable IDs and resolvable local references.',
      },
      {
        id: 'SEC-IMK-SCOPE-NON-GOALS',
        title: 'IdeaMark non-goals',
        view: 'decision',
        domains: ['routing', 'boundary'],
        selectors: ['source.type'],
        summary: 'IdeaMark does not perform retrieval ranking, source dereferencing, storage orchestration, or task-loop execution by itself.',
      },
      {
        id: 'SEC-IMK-SCOPE-COMPLEMENTARY-TOOLS',
        title: 'Complementary tools',
        view: 'decision',
        domains: ['routing', 'interoperability'],
        selectors: ['source.type'],
        summary: 'Route iterative task execution to FlowMark first; route stable structural knowledge capture, validation, and projection-driven authoring to IdeaMark.',
      },
    ],
  },
  {
    id: 'ideamark.guides.ai-authoring',
    topic: 'ai-authoring',
    title: 'IdeaMark AI authoring guide',
    description: 'Guidance for generating valid IdeaMark Core v1.2.0 YAML documents.',
    formats: ['md', 'json'],
    languages: ['ja-JP', 'en-US'],
    domains: ['authoring', 'validation', 'projection'],
    views: ['background', 'procedure'],
    sections: [
      {
        id: 'SEC-IMK-AUTHORING-PROJECTION-FIRST',
        title: 'Projection-first extraction',
        view: 'procedure',
        domains: ['authoring', 'projection'],
        selectors: ['entity.kind', 'occurrence.role'],
        summary: 'Read the projection before the source and let it determine reusable entities, occurrences, sections, relations, and perspectives.',
      },
      {
        id: 'SEC-IMK-AUTHORING-REFERENCE-INTEGRITY',
        title: 'Reference integrity',
        view: 'procedure',
        domains: ['authoring', 'validation'],
        selectors: ['entity.kind', 'occurrence.role'],
        summary: 'Every occurrence must resolve to an entity, every section occurrence must resolve, and local references must remain stable.',
      },
    ],
  },
  {
    id: 'ideamark.guides.prompt-authoring',
    topic: 'prompt-authoring',
    title: 'IdeaMark prompt authoring guide',
    description: 'Guidance for building external LLM prompts that preserve v1.2.0 structure and reference validity.',
    formats: ['md', 'json'],
    languages: ['ja-JP', 'en-US'],
    domains: ['prompting', 'authoring', 'projection'],
    views: ['procedure'],
    sections: [
      {
        id: 'SEC-IMK-PROMPT-REFERENCE-MAPPING',
        title: 'Reference mapping rules',
        view: 'procedure',
        domains: ['prompting', 'validation'],
        selectors: ['entity.kind', 'occurrence.role'],
        summary: 'Prompts should explicitly require entity, occurrence, section, and relation references to resolve locally.',
      },
      {
        id: 'SEC-IMK-PROMPT-GENERATION-FLOW',
        title: 'Generation flow',
        view: 'procedure',
        domains: ['prompting', 'workflow'],
        selectors: ['source.type', 'entity.kind'],
        summary: 'Collect source materials and projection, describe relevant guidance, assemble prompts, generate, validate, repair, and validate strictly.',
      },
    ],
  },
  {
    id: 'ideamark.guides.params',
    topic: 'params',
    title: 'IdeaMark parameter guide',
    description: 'Machine-readable and human-readable parameter inventory for v1.2.0 document generation.',
    formats: ['md', 'json'],
    languages: ['ja-JP', 'en-US'],
    domains: ['params', 'schema', 'validation'],
    views: ['reference'],
    sections: [
      {
        id: 'SEC-IMK-PARAMS-CORE-UNITS',
        title: 'Core units',
        view: 'reference',
        domains: ['params', 'schema'],
        selectors: ['source.type', 'entity.kind', 'occurrence.role'],
        summary: 'The core authoring units are meta, sources, sections, occurrences, entities, relations, perspectives, and optional skeletons.',
      },
    ],
  },
];

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
  if (input.profile && !profile) return { ok: false, error: 'invalid_profile' };
  let audience = input.audience || (profile && profile.audience) || null;
  if (!audience) audience = format === 'json' ? 'ai' : 'human';
  if (!['human', 'ai'].includes(audience)) return { ok: false, error: 'invalid_audience' };
  let model = input.model || (profile && profile.model) || null;
  if (!model && audience === 'ai') model = format === 'json' ? 'small' : 'large';
  if (model && !['small', 'large'].includes(model)) return { ok: false, error: 'invalid_model' };
  if (audience !== 'ai' && model) return { ok: false, error: 'model_requires_ai' };
  let lang = normalizeLang(input.lang) || (profile && profile.lang) || null;
  if (!lang) lang = audience === 'human' ? 'ja-JP' : 'en-US';
  return { ok: true, context: { audience, model: audience === 'ai' ? model : null, lang, profile: input.profile || null } };
}

function buildCapabilities() {
  return {
    contract: { name: 'doc-cli-contract', version: CONTRACT_VERSION },
    tool: { name: TOOL_NAME, package: pkg.name, command: TOOL_COMMAND, version: pkg.version },
    document: { name: 'ideamark', version: DOCUMENT_SPEC_VERSION, representation: 'single-yaml-mapping' },
    features: {
      evidence: { emit: ['yaml', 'ndjson'], attach: true, artifact_out: true },
      skeletons: { basic_validation: true, core_required: false, projection_profile: 'discovery_only', retrieval_engine: false },
      routing: { supported: true, entrypoints: ['describe routing', 'describe ls'], selectors: DISCOVERY_SELECTORS, fallback_search: true },
      languages: { available: ['ja-JP', 'en-US'], default: { human: 'ja-JP', automation: 'en-US' } },
    },
    commands: {
      describe: { formats: ['md', 'json', 'yaml'], topics: ['ai-authoring', 'prompt-authoring', 'params', 'capabilities', 'checklist', 'vocab', 'ls', 'routing'], description: 'Print tool guidance and discovery metadata for IdeaMark authoring and routing.' },
      validate: { formats: ['ndjson'], stdin: true, description: 'Check whether a document conforms to IdeaMark rules and emit diagnostics.' },
      lint: { formats: ['ndjson', 'json', 'md'], stdin: true, description: 'Emit non-blocking diagnostics for IdeaMark documents. Does not modify input.' },
      diff: { formats: ['ndjson', 'json', 'md'], stdin: false, description: 'Emit structural differences between two IdeaMark documents.' },
      format: { formats: ['md'], stdin: true, description: 'Normalize IdeaMark Core v1.2.0 YAML documents without changing meaning.' },
      extract: { formats: ['md'], stdin: true, description: 'Extract a section or occurrence into a new document.' },
      compose: { formats: ['md'], stdin: false, description: 'Compose multiple IdeaMark documents into a single output.' },
      publish: { formats: ['md'], stdin: true, description: 'Finalize a working document into a publishable form.' },
      ls: { formats: ['json', 'md'], stdin: true, description: 'List IDs, vocab, and optional Skeleton Graph summaries present in a document.' },
    },
  };
}

function resolveTemplate(topic, format) {
  const map = TEMPLATE_MAP[topic];
  if (!map) return null;
  for (const fmt of FORMAT_FALLBACKS[format] || [format, 'md', 'json', 'yaml']) {
    const rel = map[fmt];
    if (!rel) continue;
    const full = path.join(TEMPLATE_DIR, rel);
    if (fs.existsSync(full)) return full;
  }
  return null;
}

function baseDiscoveryEnvelope(topic, context) {
  return {
    contract: { name: 'doc-cli-contract', version: CONTRACT_VERSION },
    tool: { name: TOOL_NAME, package: pkg.name, command: TOOL_COMMAND, version: pkg.version },
    document: { name: 'ideamark', version: DOCUMENT_SPEC_VERSION, representation: 'single-yaml-mapping' },
    topic,
    audience: context.audience,
    language: context.lang,
  };
}

function guideSummary(guide, includeSections) {
  const out = {
    id: guide.id,
    topic: guide.topic,
    title: guide.title,
    description: guide.description,
    formats: guide.formats,
    languages: guide.languages,
    sections_count: guide.sections.length,
    section_ids: guide.sections.map((section) => section.id),
    views: guide.views,
    domains: guide.domains,
  };
  if (includeSections) out.sections = guide.sections.map((section) => ({ ...section }));
  return out;
}

function describeLs(format, context, options = {}) {
  const target = options.target || 'guides';
  if (target !== 'guides') return { ok: false, error: 'unsupported_target' };
  const includeSections = Boolean(options.sections);
  const payload = {
    ...baseDiscoveryEnvelope('ls', context),
    target,
    available_targets: ['guides'],
    available_languages: ['ja-JP', 'en-US'],
    guides: BUILTIN_GUIDES.map((guide) => guideSummary(guide, includeSections)),
  };
  if (options.vocab) payload.vocab = VOCAB;
  if (format === 'json') return { ok: true, output: JSON.stringify(payload) };
  if (format === 'yaml') return { ok: true, output: YAML.stringify(payload).trimEnd() };
  return { ok: true, output: discoveryLsMarkdown(payload) };
}

function routingSource() {
  const routingGuide = BUILTIN_GUIDES.find((guide) => guide.topic === 'routing');
  return {
    type: 'builtin_guidance',
    guide_id: routingGuide.id,
    topic: routingGuide.topic,
    section_ids: routingGuide.sections.map((section) => section.id),
  };
}

function describeRouting(format, context) {
  const source = routingSource();
  const payload = {
    ...baseDiscoveryEnvelope('routing', context),
    routing: {
      supported: true,
      entrypoints: ['describe routing', 'describe ls --target guides --sections'],
      selectors: DISCOVERY_SELECTORS,
      fallback_search: true,
    },
    selectors: DISCOVERY_SELECTORS,
    source,
    applies_to: [
      'Stabilizing structural knowledge with durable IDs.',
      'Projection-driven reusable knowledge capture from source materials.',
      'Validation, linting, and discovery over local IdeaMark Core v1.2.0 YAML structures.',
      'Skeleton Graph basic-shape discovery when optional skeletons are present.',
    ],
    non_goals: [
      'Task-loop orchestration as the primary workflow.',
      'External source dereferencing or truth verification.',
      'Retrieval ranking, storage management, or projection compatibility scoring.',
    ],
    complementary_tools: ['flowmark'],
    decision_rules: [
      {
        when: 'The task asks for stable entities, occurrences, sections, local reference validation, or projection-driven extraction.',
        route: 'ideamark',
      },
      {
        when: 'The task asks for iterative task execution or process orchestration before durable knowledge capture.',
        route: 'flowmark_then_ideamark',
      },
    ],
  };
  if (format === 'json') return { ok: true, output: JSON.stringify(payload) };
  if (format === 'yaml') return { ok: true, output: YAML.stringify(payload).trimEnd() };
  return { ok: true, output: routingMarkdown(payload) };
}

function describe(topic, format, options) {
  const contextResult = buildDescribeContext(format, options || {});
  if (!contextResult.ok) return { ok: false, error: contextResult.error };
  const context = contextResult.context;
  if (topic === 'ls') return describeLs(format, context, options || {});
  if (topic === 'routing') return describeRouting(format, context);
  let data;
  if (topic === 'capabilities') data = buildCapabilities();
  else if (topic === 'checklist') data = CHECKLIST;
  else if (topic === 'vocab') data = VOCAB;
  else if (TEMPLATE_MAP[topic]) {
    const template = resolveTemplate(topic, format);
    if (!template) {
      const meta = makeMeta('working');
      const diagEntry = diag('error', 'template_missing', `Template not found for ${topic}`, { scope: 'describe' }, 'working');
      return { ok: false, error: 'template_missing', diagnostics: [meta, diagEntry, makeSummary([diagEntry])] };
    }
    return { ok: true, output: readFileUtf8(template) };
  } else return { ok: false, error: 'unknown_topic' };
  if (format === 'json') return { ok: true, output: JSON.stringify(data) };
  if (format === 'yaml') return { ok: true, output: YAML.stringify(data).trimEnd() };
  return { ok: true, output: toMarkdown(topic, data, context) };
}

function discoveryLsMarkdown(payload) {
  const lines = [
    '# Built-in Guides Catalog',
    '',
    `- target: ${payload.target}`,
    `- language: ${payload.language}`,
    '',
    '## Guides',
  ];
  for (const guide of payload.guides) {
    lines.push(`- ${guide.id} (${guide.topic}) — ${guide.title}`);
    lines.push(`  - sections: ${guide.section_ids.join(', ')}`);
  }
  if (payload.vocab) {
    lines.push('', '## Vocab');
    for (const [key, values] of Object.entries(payload.vocab)) lines.push(`- ${key}: ${values.join(', ')}`);
  }
  lines.push('');
  return lines.join('\n');
}

function routingMarkdown(payload) {
  const lines = [
    '# Routing Guide',
    '',
    `- language: ${payload.language}`,
    `- source guide: ${payload.source.guide_id}`,
    `- source sections: ${payload.source.section_ids.join(', ')}`,
    '',
    '## Applies to',
    ...payload.applies_to.map((item) => `- ${item}`),
    '',
    '## Non-goals',
    ...payload.non_goals.map((item) => `- ${item}`),
    '',
    '## Complementary tools',
    ...payload.complementary_tools.map((item) => `- ${item}`),
    '',
  ];
  return lines.join('\n');
}

function toMarkdown(topic, data, context) {
  if (topic === 'capabilities') {
    return [`# ${data.tool.name}`, `**Package:** ${data.tool.package}`, `**Command:** ${data.tool.command}`, `**Tool Version:** ${data.tool.version}`, `**Doc CLI Contract:** ${data.contract.version}`, `**Document Spec:** ${data.document.version} (${data.document.representation})`, '', '## Summary', 'IdeaMark CLI for v1.2.0 Core validation plus additive Skeleton Graph discovery and basic validation.', '', '## Commands', ...Object.entries(data.commands).map(([name, command]) => `### ${name}\n**Description:** ${command.description}\n**Formats:** \`${command.formats.join('`, `')}\``), '', '## Compatibility Notes', '- Unknown fields in capabilities JSON should be ignored by consumers.', `- Describe default context for this render: audience=${context.audience}, lang=${context.lang}, model=${context.model || 'n/a'}.`, ''].join('\n');
  }
  if (topic === 'checklist') return ['# strict checklist', '', ...data.strict_requirements.map((c) => `- ${c}`), '', '# skeleton basic-shape checks', '', ...data.skeleton_basic_shape.map((c) => `- ${c}`), ''].join('\n');
  return ['# vocab', '', ...Object.entries(data).flatMap(([key, values]) => [`${key}:`, ...values.map((value) => `- ${value}`), ''])].join('\n');
}

module.exports = { describe, buildDescribeContext };
