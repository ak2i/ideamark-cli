const fs = require('fs');
const path = require('path');

function readFileUtf8(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function writeFileUtf8(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function readStdinUtf8() {
  return fs.readFileSync(0, 'utf8');
}

function isStdinPath(p) {
  return !p || p === '-';
}

function writeStdout(content) {
  process.stdout.write(content);
}

function writeStderr(content) {
  process.stderr.write(content);
}

function nowDate() {
  return new Date().toISOString().slice(0, 10);
}

function uuidV4() {
  return require('crypto').randomUUID();
}

function deepClone(obj) {
  return obj == null ? obj : JSON.parse(JSON.stringify(obj));
}

function stableStringify(obj) {
  return JSON.stringify(sortKeys(obj));
}

function sortKeys(value) {
  if (Array.isArray(value)) {
    return value.map(sortKeys);
  }
  if (value && typeof value === 'object') {
    const out = {};
    Object.keys(value)
      .sort()
      .forEach((k) => {
        out[k] = sortKeys(value[k]);
      });
    return out;
  }
  return value;
}

module.exports = {
  readFileUtf8,
  writeFileUtf8,
  readStdinUtf8,
  isStdinPath,
  writeStdout,
  writeStderr,
  nowDate,
  uuidV4,
  deepClone,
  stableStringify,
  sortKeys,
};
