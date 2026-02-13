const fs = require('fs');
const { composeDocuments } = require('./compose');
const { resolveGoalTemplate, ensureTrailingNewline } = require('./utils');

function buildMessages(templateText) {
  const systemIndex = templateText.indexOf('## SYSTEM RULES');
  const taskIndex = templateText.indexOf('## TASK');

  if (systemIndex === -1 || taskIndex === -1 || taskIndex <= systemIndex) {
    return [{ role: 'user', content: templateText.trim() }];
  }

  const systemText = templateText.slice(systemIndex + '## SYSTEM RULES'.length, taskIndex).trim();
  const userText = templateText.slice(taskIndex).trim();

  return [
    { role: 'system', content: systemText },
    { role: 'user', content: userText }
  ];
}

function describeDocuments(inputs, options) {
  const templatePath = resolveGoalTemplate(options.goal);
  if (!templatePath || !fs.existsSync(templatePath)) {
    throw new Error(`Unknown goal: ${options.goal}`);
  }

  const templateText = fs.readFileSync(templatePath, 'utf8');
  const composed = composeDocuments(inputs, {
    selector: options.selector,
    sort: options.sort || 'default',
    withProvenance: options.withProvenance,
    provenanceStyle: options.provenanceStyle || 'frontmatter'
  });

  const replaced = templateText.replace('{{COMPOSED_MATERIALS}}', composed.composed.trim());
  const prompt = ensureTrailingNewline(replaced);

  if (options.format === 'json') {
    return {
      messages: buildMessages(prompt),
      meta: {
        goal: options.goal,
        select: options.selector || null,
        with_provenance: Boolean(options.withProvenance)
      }
    };
  }

  return { prompt };
}

module.exports = { describeDocuments };
