#!/usr/bin/env node

/**
 * Arch Design CLI Validator
 * Usage: node validate.js <path-to-file.arch>
 * Returns exit code 0 if valid, 1 if invalid with actionable error output.
 */

const fs = require('fs');
const path = require('path');

const filePath = process.argv[2];

if (!filePath) {
  console.error('Error: Please provide an .arch file path to validate.');
  console.error('Usage: node validate.js <path/to/file.arch>');
  process.exit(1);
}

const resolvedPath = path.resolve(process.cwd(), filePath);

if (!fs.existsSync(resolvedPath)) {
  console.error(`Error: File does not exist: ${resolvedPath}`);
  process.exit(1);
}

let doc;
try {
  const content = fs.readFileSync(resolvedPath, 'utf8');
  doc = JSON.parse(content);
} catch (err) {
  console.error(`Error: Failed to parse JSON: ${err.message}`);
  process.exit(1);
}

const errors = [];
const warnings = [];

// 1. Root structure validation
if (doc.version !== 2) {
  errors.push(`Invalid version: ${doc.version}. Version must be exactly 2.`);
}

if (!Array.isArray(doc.nodes)) {
  errors.push('Document "nodes" property must be an array.');
}

if (!Array.isArray(doc.edges)) {
  errors.push('Document "edges" property must be an array.');
}

if (errors.length > 0) {
  reportAndExit(errors, warnings);
}

// 2. Nodes validation
const validNodeTypes = new Set(['module', 'service', 'component', 'type', 'function', 'external']);
const nodeMap = new Map();

doc.nodes.forEach((node, idx) => {
  const id = node.id || `node[${idx}]`;
  if (!node.id) {
    errors.push(`Node at index ${idx} is missing required 'id'.`);
  } else if (nodeMap.has(node.id)) {
    errors.push(`Duplicate node id detected: '${node.id}'.`);
  } else {
    nodeMap.set(node.id, node);
  }

  if (!node.type || !validNodeTypes.has(node.type)) {
    errors.push(`Node '${id}' has invalid type: '${node.type}'. Must be one of: module, service, component, type, function, external.`);
  }

  if (!node.label) {
    warnings.push(`Node '${id}' is missing a 'label' title.`);
  }

  if (!node.pos || typeof node.pos.x !== 'number' || typeof node.pos.y !== 'number') {
    errors.push(`Node '${id}' missing valid 'pos' coordinates ({ x: number, y: number }).`);
  }

  if (node.type === 'function') {
    if (node.parameters && !Array.isArray(node.parameters)) {
      errors.push(`Function node '${id}' 'parameters' must be an array.`);
    }
    if (node.returns && !Array.isArray(node.returns)) {
      errors.push(`Function node '${id}' 'returns' must be an array.`);
    }
  }
});

// 3. Edges & Architectural Connection Rules validation
const seenEdges = new Set();

doc.edges.forEach((edge, idx) => {
  const id = edge.id || `edge[${idx}]`;
  if (!edge.from || !edge.to) {
    errors.push(`Edge '${id}' must have both 'from' and 'to' properties.`);
    return;
  }

  if (edge.from === edge.to) {
    errors.push(`Edge '${id}' is a self-loop (from '${edge.from}' to '${edge.to}'). Self-loops are blocked.`);
  }

  const edgeKey = `${edge.from}->${edge.to}`;
  if (seenEdges.has(edgeKey)) {
    errors.push(`Duplicate edge detected from '${edge.from}' to '${edge.to}'.`);
  }
  seenEdges.add(edgeKey);

  const sourceNode = nodeMap.get(edge.from);
  const targetNode = nodeMap.get(edge.to);

  if (!sourceNode) {
    errors.push(`Edge '${id}' references non-existent source node: '${edge.from}'.`);
  }
  if (!targetNode) {
    errors.push(`Edge '${id}' references non-existent target node: '${edge.to}'.`);
  }

  if (sourceNode && targetNode) {
    const sType = sourceNode.type;
    const tType = targetNode.type;

    // Check allowed LLD relationships across domains
    const isAllowed =
      (sType === 'service' && tType === 'module') ||
      (sType === 'function' && tType === 'service') ||
      (sType === 'external' && tType === 'service') ||
      (sType === 'external' && tType === 'module') ||
      (sType === 'service' && tType === 'service') ||
      (sType === 'module' && tType === 'module') ||
      (sType === 'component' && tType === 'component') ||
      (sType === 'service' && tType === 'component') ||
      (sType === 'component' && tType === 'service') ||
      (sType === 'component' && tType === 'module') ||
      (sType === 'function' && tType === 'component') ||
      (sType === 'type' && tType === 'type') ||
      (sType === 'type' && tType === 'service') ||
      (sType === 'type' && tType === 'component') ||
      (sType === 'type' && tType === 'function') ||
      (sType === 'type' && tType === 'module') ||
      (sType === 'function' && tType === 'type');

    if (!isAllowed) {
      errors.push(
        `Architectural violation in edge '${id}': Connection from '${sType}' ('${sourceNode.label}') to '${tType}' ('${targetNode.label}') is disallowed.`
      );
    }
  }
});

reportAndExit(errors, warnings);

function reportAndExit(errors, warnings) {
  if (warnings.length > 0) {
    console.warn(`\nWarnings (${warnings.length}):`);
    warnings.forEach((w) => console.warn(`  [!] ${w}`));
  }

  if (errors.length > 0) {
    console.error(`\nValidation Failed (${errors.length} errors):`);
    errors.forEach((e) => console.error(`  [X] ${e}`));
    process.exit(1);
  } else {
    console.log(`\n✓ Validation Passed: '${path.basename(resolvedPath)}' is schema-compliant and adheres to all Arch Design rules.`);
    console.log(`  Nodes: ${doc.nodes.length}, Edges: ${doc.edges.length}`);
    process.exit(0);
  }
}
