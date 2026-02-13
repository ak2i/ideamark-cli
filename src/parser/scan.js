function scanFencedBlocks(text) {
  const lines = text.split(/\r?\n/);
  const blocks = [];

  let inFence = false;
  let info = '';
  let startLine = 0;
  let contentLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!inFence) {
      const startMatch = line.match(/^(\s*)```(.*)$/);
      if (startMatch) {
        inFence = true;
        info = (startMatch[2] || '').trim();
        startLine = i + 1;
        contentLines = [];
      }
      continue;
    }

    const endMatch = line.match(/^(\s*)```\s*$/);
    if (endMatch) {
      const endLine = i + 1;
      blocks.push({
        info,
        content: contentLines.join('\n'),
        startLine,
        endLine
      });
      inFence = false;
      info = '';
      startLine = 0;
      contentLines = [];
    } else {
      contentLines.push(line);
    }
  }

  return blocks;
}

module.exports = { scanFencedBlocks };
