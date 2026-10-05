#!/usr/bin/env node

/**
 * Arch Design CLI Auto-Layouter
 * Usage: node layout.js <path-to-file.arch> [output-path.arch]
 * Reads an .arch file, assigns clean non-overlapping (x, y) coordinates, and writes back.
 */

const fs = require('fs');
const path = require('path');

const inputPath = process.argv[2];
const outputPath = process.argv[3] || inputPath;

if (!inputPath) {
  console.error('Error: Please provide an .arch file path to layout.');
  console.error('Usage: node layout.js <input.arch> [output.arch]');
  process.exit(1);
}

const resolvedInput = path.resolve(process.cwd(), inputPath);
const resolvedOutput = path.resolve(process.cwd(), outputPath);

if (!fs.existsSync(resolvedInput)) {
  console.error(`Error: File does not exist: ${resolvedInput}`);
  process.exit(1);
}

let doc;
try {
  doc = JSON.parse(fs.readFileSync(resolvedInput, 'utf8'));
} catch (err) {
  console.error(`Error: Failed to parse JSON: ${err.message}`);
  process.exit(1);
}

if (!Array.isArray(doc.nodes) || !Array.isArray(doc.edges)) {
  console.error('Error: Invalid .arch file: nodes and edges must be arrays.');
  process.exit(1);
}

// Try using Dagre if available, otherwise use topological ranker
let layoutSucceeded = false;

try {
  const dagre = require('@dagrejs/dagre');
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: 'LR',
    nodesep: 60,
    ranksep: 100,
    marginx: 60,
    marginy: 60
  });

  doc.nodes.forEach(node => {
    let height = 140;
    if (node.type === 'service') height = 180;
    if (node.type === 'function') height = 160;
    if (node.type === 'external') height = 120;
    g.setNode(node.id, { width: 300, height });
  });

  doc.edges.forEach(edge => {
    g.setEdge(edge.from, edge.to);
  });

  dagre.layout(g);

  doc.nodes.forEach(node => {
    const pos = g.node(node.id);
    if (pos) {
      node.pos = {
        x: Math.round(pos.x - 150),
        y: Math.round(pos.y - 70)
      };
    }
  });

  layoutSucceeded = true;
} catch (e) {
  // Fallback topological grid layout
  layoutSucceeded = false;
}

if (!layoutSucceeded) {
  // Fallback: Group by architectural hierarchy
  const rankMap = new Map();
  const inDegree = new Map();

  doc.nodes.forEach(n => inDegree.set(n.id, 0));
  doc.edges.forEach(e => {
    inDegree.set(e.to, (inDegree.get(e.to) || 0) + 1);
  });

  // Modules: rank 0, Services: rank 1, Functions & Externals: rank 2
  const ranks = [[], [], []];

  doc.nodes.forEach(node => {
    if (node.type === 'module') ranks[0].push(node);
    else if (node.type === 'service') ranks[1].push(node);
    else ranks[2].push(node);
  });

  ranks.forEach((group, colIdx) => {
    const colX = 60 + colIdx * 350;
    group.forEach((node, rowIdx) => {
      node.pos = {
        x: colX,
        y: 60 + rowIdx * 190
      };
    });
  });
}

fs.writeFileSync(resolvedOutput, JSON.stringify(doc, null, 2), 'utf8');
console.log(`✓ Successfully updated coordinates in: '${path.basename(resolvedOutput)}'`);
