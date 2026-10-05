export const SKILL_MD_CONTENT = `---
name: arch-design
description: >-
  Use this skill whenever reading, inspecting, understanding, creating, editing,
  or validating Arch Design (.arch and .lld) visual architecture canvas files,
  or when converting codebase architecture into visual architecture diagrams.
---

# Arch Design Skill: Visual Architecture & LLD for Coding Agents

This skill teaches AI coding agents how to interact bidirectionally with **Arch Design** visual architecture files (\`.arch\` and \`.lld\`).

By using \`.arch\` files:
- **Agents understand code before writing it**: Inspect modules, service boundaries, typed method signatures, and infrastructure dependencies.
- **Agents document architecture as code evolves**: Generate or update clean visual diagrams directly in the repository.

---

## 1. How to Understand an Existing Architecture

When starting a coding or refactoring task in a repository with \`.arch\` files:

1. **Locate Architecture Files**:
   Search the repository for \`*.arch\` or \`*.lld\` files:
   \`\`\`bash
   find . -name "*.arch" -o -name "*.lld"
   \`\`\`
2. **Inspect the JSON Hierarchy**:
   Read the file and map out the system:
   - **Modules (\`type: "module"\`)**: Note high-level domain boundaries and scope.
   - **Services (\`type: "service"\`)**: Note service names and \`typeRef\` (file or class targets).
   - **Functions (\`type: "function"\`)**: Read exact \`parameters\` (names, types, required flags) and \`returns\` contracts.
   - **Externals (\`type: "external"\`)**: Identify underlying infrastructure (e.g. \`postgres\`, \`redis\`, \`kafka\`, \`s3\`).
3. **Trace Dependencies**:
   Inspect the \`edges\` array:
   - Trace upstream callers and downstream dependencies before modifying existing methods.

---

## 2. How to Draw or Update an Architecture Diagram

When asked to create a new architecture or update an existing \`.arch\` file:

### Step 1: Draft Nodes & Edges
Refer to the schema reference: [references/schema.md](./references/schema.md).
- Create unique IDs prefixed by type: \`m1\` (Module), \`s1\` (Service), \`f1\` (Function), \`e1\` (External).
- Assign types, labels, descriptions, parameters, returns, and tech badges.
- Connect nodes according to the allowed connection rules: [references/rules.md](./references/rules.md).

### Step 2: Auto-Calculate Visual Coordinates
Do not guess pixel math manually. Run the layout script to automatically assign non-overlapping Dagre coordinates:
\`\`\`bash
node .agents/skills/arch-design/scripts/layout.js path/to/file.arch
\`\`\`

### Step 3: Validate the Architecture
Always run the validation script to verify schema integrity and rule compliance:
\`\`\`bash
node .agents/skills/arch-design/scripts/validate.js path/to/file.arch
\`\`\`
If errors are reported, correct the JSON structure until validation passes with exit code 0.

---

## 3. Allowed Architectural Rules Quick Reference

Arch Design enforces strict Low-Level Design separation of concerns:

- ✅ **Module -> Service** (\`contains\`)
- ✅ **Service -> Function** (\`contains\`)
- ✅ **Service -> External** (\`uses\`)
- ✅ **Module -> External** (\`uses\`)
- ✅ **Service -> Service** (\`uses\`)
- ❌ **Function -> Module / Service / External** (Blocked)
- ❌ **External -> Service** (Blocked)
- ❌ **Self-loops & duplicate edges** (Blocked)
`;

export const SCHEMA_MD_CONTENT = `# Arch Design (.arch) JSON Schema Specification (v2)

Arch Design files (\`.arch\` or \`.lld\`) are stored in structured JSON (version 2).

## Root Document Structure
\`\`\`json
{
  "version": 2,
  "name": "system-name",
  "nodes": [],
  "edges": []
}
\`\`\`

## Node Types
- **module**: Domain boundary or package.
- **service**: Business logic class or service controller (\`typeRef\` path).
- **function**: Executable routine with \`parameters\` and \`returns\` arrays.
- **external**: External dependencies with \`tech\` badges (\`postgres\`, \`mysql\`, \`redis\`, \`mongodb\`, \`kafka\`, \`rabbitmq\`, \`s3\`).

## Edge Schema
\`\`\`json
{
  "id": "edge-1",
  "from": "m1",
  "to": "s1",
  "type": "contains"
}
\`\`\`
`;

export const RULES_MD_CONTENT = `# Arch Design Architectural Connection Rules

## Connection Matrix
- **Module -> Service**: Allowed (\`contains\`)
- **Service -> Function**: Allowed (\`contains\`)
- **Service -> External**: Allowed (\`uses\`)
- **Module -> External**: Allowed (\`uses\`)
- **Service -> Service**: Allowed (\`uses\`)
- **Function -> Any**: Blocked
- **External -> Any**: Blocked
- **Self-loops & Duplicate Edges**: Blocked
`;

export const VALIDATE_JS_CONTENT = `#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const filePath = process.argv[2];
if (!filePath) {
  console.error('Error: Please provide an .arch file path to validate.');
  process.exit(1);
}

const resolvedPath = path.resolve(process.cwd(), filePath);
if (!fs.existsSync(resolvedPath)) {
  console.error('Error: File does not exist:', resolvedPath);
  process.exit(1);
}

let doc;
try {
  doc = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));
} catch (err) {
  console.error('Error: Failed to parse JSON:', err.message);
  process.exit(1);
}

const errors = [];
if (doc.version !== 2) errors.push('Invalid version. Version must be 2.');
if (!Array.isArray(doc.nodes)) errors.push('Nodes must be an array.');
if (!Array.isArray(doc.edges)) errors.push('Edges must be an array.');

if (errors.length > 0) {
  console.error('Validation failed:', errors.join(', '));
  process.exit(1);
}

const validTypes = new Set(['module', 'service', 'function', 'external']);
const nodeMap = new Map();

doc.nodes.forEach((n, i) => {
  if (!n.id) errors.push(\`Node at index \${i} missing id.\`);
  else if (nodeMap.has(n.id)) errors.push(\`Duplicate node id: \${n.id}\`);
  else nodeMap.set(n.id, n);

  if (!validTypes.has(n.type)) errors.push(\`Node \${n.id} has invalid type: \${n.type}\`);
  if (!n.pos || typeof n.pos.x !== 'number' || typeof n.pos.y !== 'number') {
    errors.push(\`Node \${n.id} missing valid pos coordinates.\`);
  }
});

doc.edges.forEach((e) => {
  if (e.from === e.to) errors.push(\`Self loop on \${e.from} is blocked.\`);
  const s = nodeMap.get(e.from);
  const t = nodeMap.get(e.to);
  if (!s || !t) {
    errors.push(\`Edge \${e.id} references invalid node ID.\`);
    return;
  }
  const allowed = (s.type === 'module' && t.type === 'service') ||
                  (s.type === 'service' && t.type === 'function') ||
                  (s.type === 'service' && t.type === 'external') ||
                  (s.type === 'module' && t.type === 'external') ||
                  (s.type === 'service' && t.type === 'service');
  if (!allowed) {
    errors.push(\`Disallowed connection from \${s.type} to \${t.type}.\`);
  }
});

if (errors.length > 0) {
  console.error(\`Validation Failed (\${errors.length} errors):\`, errors.join('\\n  '));
  process.exit(1);
} else {
  console.log(\`✓ Validation Passed: '\${path.basename(resolvedPath)}' is schema-compliant.\`);
  process.exit(0);
}
`;

export const LAYOUT_JS_CONTENT = `#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const inputPath = process.argv[2];
const outputPath = process.argv[3] || inputPath;

if (!inputPath) {
  console.error('Usage: node layout.js <input.arch> [output.arch]');
  process.exit(1);
}

const resolvedInput = path.resolve(process.cwd(), inputPath);
const resolvedOutput = path.resolve(process.cwd(), outputPath);

let doc;
try {
  doc = JSON.parse(fs.readFileSync(resolvedInput, 'utf8'));
} catch (err) {
  console.error('Error parsing JSON:', err.message);
  process.exit(1);
}

const ranks = [[], [], []];
doc.nodes.forEach((n) => {
  if (n.type === 'module') ranks[0].push(n);
  else if (n.type === 'service') ranks[1].push(n);
  else ranks[2].push(n);
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

fs.writeFileSync(resolvedOutput, JSON.stringify(doc, null, 2), 'utf8');
console.log(\`✓ Successfully updated coordinates in: '\${path.basename(resolvedOutput)}'\`);
`;

export const AGENTS_MD_CONTENT = `# Architecture & Agent Guidelines

This project uses **Arch Design** (\`.arch\`) files to visually map modules, services, functions, and external infrastructure dependencies.

## Working with Architecture Diagrams (.arch files)

When inspecting, modifying, or creating system architectures:
1. Refer to the **Arch Design Agent Skill**: [\`.agents/skills/arch-design/SKILL.md\`](./.agents/skills/arch-design/SKILL.md).
2. Schema & Type Reference: [\`.agents/skills/arch-design/references/schema.md\`](./.agents/skills/arch-design/references/schema.md).
3. Validate any \`.arch\` changes using the CLI validator:
   \`\`\`bash
   node .agents/skills/arch-design/scripts/validate.js <file.arch>
   \`\`\`
4. Automatically lay out new nodes using Dagre:
   \`\`\`bash
   node .agents/skills/arch-design/scripts/layout.js <file.arch>
   \`\`\`
`;
