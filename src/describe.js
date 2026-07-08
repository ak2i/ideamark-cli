const fs = require('fs');
const path = require('path');
const YAML = require('yaml');
const { readFileUtf8 } = require('./utils');
const { parseDocument } = require('./parser');
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
      routing: { supported: true, entrypoints: ['describe routing', 'describe ls'], selectors: ['source.type', 'occurrence.role', 'entity.kind', 'anchor.type'], fallback_search: true },
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

function describeLs(format, context) {
  const payload = { target: 'guides', audience: context.audience, language: context.lang, available_languages: ['ja-JP', 'en-US'], guides: [{ id: 'ideamark.guides.builtin', sections_count: 0, views: [], domains: [] }] };
  if (format === 'json') return { ok: true, output: JSON.stringify(payload) };
  if (format === 'yaml') return { ok: true, output: YAML.stringify(payload).trimEnd() };
  return { ok: true, output: '# Built-in Guides Catalog\n\n- target: guides\n' };
}

function describeRouting(format, context) {
  const payload = { topic: 'routing', audience: context.audience, language: context.lang, selectors: ['source.type', 'occurrence.role', 'entity.kind', 'anchor.type'], applies_to: ['Stabilizing structural knowledge with durable IDs.'], non_goals: ['Task-loop orchestration as the primary workflow.'], complementary_tools: ['flowmark'] };
  if (format === 'json') return { ok: true, output: JSON.stringify(payload) };
  if (format === 'yaml') return { ok: true, output: YAML.stringify(payload).trimEnd() };
  return { ok: true, output: '# Routing Guide\n\n- Use IdeaMark for structural knowledge stabilization.\n' };
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

function toMarkdown(topic, data, context) {
  if (topic === 'capabilities') {
    return [`# ${data.tool.name}`, `**Package:** ${data.tool.package}`, `**Command:** ${data.tool.command}`, `**Tool Version:** ${data.tool.version}`, `**Doc CLI Contract:** ${data.contract.version}`, `**Document Spec:** ${data.document.version} (${data.document.representation})`, '', '## Summary', 'IdeaMark CLI for v1.2.0 Core validation plus additive Skeleton Graph discovery and basic validation.', '', '## Commands', ...Object.entries(data.commands).map(([name, command]) => `### ${name}\n**Description:** ${command.description}\n**Formats:** \`${command.formats.join('`, `')}\``), '', '## Compatibility Notes', '- Unknown fields in capabilities JSON should be ignored by consumers.', `- Describe default context for this render: audience=${context.audience}, lang=${context.lang}, model=${context.model || 'n/a'}.`, ''].join('\n');
  }
  if (topic === 'checklist') return ['# strict checklist', '', ...data.strict_requirements.map((c) => `- ${c}`), '', '# skeleton basic-shape checks', '', ...data.skeleton_basic_shape.map((c) => `- ${c}`), ''].join('\n');
  return ['# vocab', '', ...Object.entries(data).flatMap(([key, values]) => [`${key}:`, ...values.map((value) => `- ${value}`), ''])].join('\n');
}

module.exports = { describe, buildDescribeContext };
