const { parseIdeaMark } = require('../parser/ideamark');

const REQUIRED_HEADER_KEYS = [
  'ideamark_version',
  'doc_id',
  'doc_type',
  'status',
  'created_at',
  'updated_at',
  'lang'
];

function validateText(text) {
  const parsed = parseIdeaMark(text);
  const errors = [...(parsed.errors || [])];
  const warnings = [];

  if (!parsed.header || !parsed.header.data) {
    errors.push({
      code: 'E_HEADER_MISSING',
      message: 'Document header not found.'
    });
  } else {
    const header = parsed.header.data;
    for (const key of REQUIRED_HEADER_KEYS) {
      if (typeof header[key] === 'undefined' || header[key] === null) {
        errors.push({
          code: 'E_HEADER_REQUIRED',
          message: `Header missing required key: ${key}`
        });
      }
    }
  }

  const sectionIds = new Set(parsed.sections.map((s) => s.data.section_id));
  const registry = parsed.registries.length > 0 ? parsed.registries[parsed.registries.length - 1].data : null;

  if (registry && registry.structure && Array.isArray(registry.structure.sections)) {
    registry.structure.sections.forEach((sectionId) => {
      if (!sectionIds.has(sectionId)) {
        errors.push({
          code: 'E_STRUCTURE_SECTION_MISSING',
          message: `structure.sections references missing section_id: ${sectionId}`
        });
      }
    });
  }

  return { errors, warnings };
}

module.exports = { validateText };
