const fs = require('fs');
const path = require('path');
const YAML = require('yaml');
const { readFileUtf8 } = require('./utils');
const { diag, makeMeta, makeSummary } = require('./diagnostics');

const CAPABILITIES = {
  commands: ['validate', 'format', 'extract', 'compose', 'publish', 'describe'],
  version: '0.1.0',
};

const CHECKLIST = {
  strict_requirements: [
    'header_required',
    'header_singleton',
    'yaml_parseable',
    'id_unique_within_doc',
    'section_anchorage_required',
    'occurrence_required',
    'entity_ref_valid',
    'occurrence_ref_valid',
    'section_ref_valid',
    'structure_sections_exist',
  ],
};

const VOCAB = {
  anchorage_view: ['background', 'solution', 'decision', 'plan', 'concept', 'structural_hypothesis'],
  anchorage_phase: ['exploration', 'confirmed', 'implementation', 'validation', 'plan', 'evolving'],
  doc_type: ['source', 'derived', 'evolving', 'pattern'],
  status_state: ['in_progress', 'paused', 'completed', 'published'],
};

const TEMPLATE_DIR = path.join(__dirname, '..', 'docs', 'guides', 'ideamark');
const TEMPLATE_MAP = {
  'ai-authoring': {
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
    return [
      '# ideamark-cli capabilities',
      '',
      `version: ${data.version}`,
      '',
      'commands:',
      ...data.commands.map((c) => `- ${c}`),
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
