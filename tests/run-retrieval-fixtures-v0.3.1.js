#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
const YAML = require('yaml');

const root = path.join(__dirname, 'fixtures', 'v1.2.0', 'retrieval');
const cases = JSON.parse(fs.readFileSync(path.join(root, 'cases.json'), 'utf8'));

function match(required, doc) {
  const graphs = Array.isArray(doc.skeletons) ? doc.skeletons : [];
  const best = { matched: false, missing_slots: required.slots || [], missing_links: required.links || [] };
  for (const graph of graphs) {
    const nodes = Array.isArray(graph.nodes) ? graph.nodes : [];
    const links = Array.isArray(graph.links) ? graph.links : [];
    const slots = new Set(nodes.map((n) => n && n.slot).filter(Boolean));
    const nodeSlot = new Map(nodes.map((n) => [n && n.id, n && n.slot]));
    const missing_slots = (required.slots || []).filter((slot) => !slots.has(slot));
    const missing_links = (required.links || []).filter((want) => !links.some((link) => link && link.type === want.type && nodeSlot.get(link.from) === want.from_slot && nodeSlot.get(link.to) === want.to_slot));
    if (missing_slots.length + missing_links.length < best.missing_slots.length + best.missing_links.length) Object.assign(best, { missing_slots, missing_links });
  }
  best.matched = best.missing_slots.length === 0 && best.missing_links.length === 0;
  return best;
}

for (const c of cases) {
  const docPath = path.resolve(root, c.document);
  const doc = YAML.parse(fs.readFileSync(docPath, 'utf8'));
  assert.deepEqual(match(c.required_skeleton, doc), c.expected, c.name);
}
console.log(`retrieval fixture harness passed (${cases.length} cases; structural matching only, no retrieval engine or reconstruction scoring)`);
