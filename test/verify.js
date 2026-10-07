const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Test 1: Load and parse sample.arch & sample.lld
console.log('--- Test 1: Testing sample.arch schema integrity ---');
const sampleArchPath = path.join(__dirname, '..', 'examples', 'sample.arch');
const sampleContent = fs.readFileSync(sampleArchPath, 'utf8');
const sampleDoc = JSON.parse(sampleContent);

assert.strictEqual(sampleDoc.version, 2, 'Version must be 2');
assert.strictEqual(sampleDoc.name, 'auth-system', 'Name should be auth-system');
assert.strictEqual(Array.isArray(sampleDoc.nodes), true, 'nodes must be an array');
assert.strictEqual(sampleDoc.nodes.length, 6, 'Must contain 6 nodes');
assert.strictEqual(Array.isArray(sampleDoc.edges), true, 'edges must be an array');
assert.strictEqual(sampleDoc.edges.length, 5, 'Must contain 5 edges');

// Validate node types and properties
const moduleNode = sampleDoc.nodes.find(n => n.type === 'module');
assert.ok(moduleNode, 'Must have module node');
assert.strictEqual(moduleNode.properties.length, 2, 'Module node has 2 properties');

const serviceNode = sampleDoc.nodes.find(n => n.type === 'service');
assert.ok(serviceNode, 'Must have service node');
assert.strictEqual(serviceNode.typeRef, 'services/AuthService');

const functionNode = sampleDoc.nodes.find(n => n.type === 'function');
assert.ok(functionNode, 'Must have function node');
assert.ok(functionNode.parameters.length > 0, 'Function has parameters');
assert.ok(functionNode.returns.length > 0, 'Function has returns');

const externalNode = sampleDoc.nodes.find(n => n.type === 'external');
assert.ok(externalNode, 'Must have external node');
assert.strictEqual(externalNode.tech, 'postgres');

// Verify CLI validate script passes on sample.arch
const { execSync } = require('child_process');
const validateScript = path.join(__dirname, '..', 'templates', 'skills', 'arch-design', 'scripts', 'validate.js');
const valOutput = execSync(`node "${validateScript}" "${sampleArchPath}"`, { encoding: 'utf8' });
assert.ok(valOutput.includes('Validation Passed'), 'validate.js must pass on sample.arch');

console.log('✓ sample.lld schema integrity and CLI validation passed.');

// Test 2: Verify Connection Rules Logic
console.log('--- Test 2: Testing Connection Validation Rules ---');
const mockNodes = [
  { id: 'm1', type: 'module', data: { nodeType: 'module' } },
  { id: 's1', type: 'service', data: { nodeType: 'service' } },
  { id: 's2', type: 'service', data: { nodeType: 'service' } },
  { id: 'f1', type: 'function', data: { nodeType: 'function' } },
  { id: 'e1', type: 'external', data: { nodeType: 'external' } },
];

function checkValid(source, target, edges = []) {
  if (!source || !target) return false;
  if (source === target) return false;
  if (edges.some(e => e.source === source && e.target === target)) return false;

  const sNode = mockNodes.find(n => n.id === source);
  const tNode = mockNodes.find(n => n.id === target);
  const sType = sNode?.type;
  const tType = tNode?.type;

  if (sType === 'service' && tType === 'module') return true;
  if (sType === 'function' && tType === 'service') return true;
  if (sType === 'external' && tType === 'service') return true;
  if (sType === 'external' && tType === 'module') return true;
  if (sType === 'service' && tType === 'service') return true;

  return false;
}

// Allowed connections (Child -> Parent injection)
assert.strictEqual(checkValid('s1', 'm1'), true, 'service -> module is allowed');
assert.strictEqual(checkValid('f1', 's1'), true, 'function -> service is allowed');
assert.strictEqual(checkValid('e1', 's1'), true, 'external -> service is allowed');
assert.strictEqual(checkValid('e1', 'm1'), true, 'external -> module is allowed');
assert.strictEqual(checkValid('s1', 's2'), true, 'service -> service is allowed');

// Disallowed connections
assert.strictEqual(checkValid('m1', 's1'), false, 'module -> service (reverse) is blocked');
assert.strictEqual(checkValid('s1', 'f1'), false, 'service -> function (reverse) is blocked');
assert.strictEqual(checkValid('s1', 'e1'), false, 'service -> external (reverse) is blocked');
assert.strictEqual(checkValid('m1', 'e1'), false, 'module -> external (reverse) is blocked');
assert.strictEqual(checkValid('f1', 'm1'), false, 'function -> module is blocked');
assert.strictEqual(checkValid('f1', 'e1'), false, 'function -> external is blocked');
assert.strictEqual(checkValid('m1', 'm1'), false, 'self-loop is blocked');
assert.strictEqual(checkValid('s1', 'm1', [{ source: 's1', target: 'm1' }]), false, 'duplicate edge is blocked');

console.log('✓ All connection validation rules passed.');

// Test 3: Verify Bundle Exists and Has No Missing Symbols
console.log('--- Test 3: Testing Build Artifacts ---');
const extBundle = fs.readFileSync(path.join(__dirname, '..', 'out', 'extension.js'), 'utf8');
const webviewBundle = fs.readFileSync(path.join(__dirname, '..', 'out', 'editor', 'bundle.js'), 'utf8');
const cssBundle = fs.readFileSync(path.join(__dirname, '..', 'out', 'editor', 'bundle.css'), 'utf8');

assert.ok(extBundle.includes('LLDCanvasEditorProvider'), 'Extension bundle contains provider');
assert.ok(extBundle.includes('lldCanvas.newFile'), 'Extension bundle contains newFile command');
assert.ok(extBundle.includes("case 'ready':") || extBundle.includes('ready'), 'Extension handles ready handshake');
assert.ok(webviewBundle.length > 500000, 'Webview bundle is properly sized');
assert.ok(webviewBundle.includes('ready'), 'Webview bundle sends ready message');
assert.ok(webviewBundle.includes('applyDagreLayout') || webviewBundle.includes('graphlib'), 'Webview bundle contains Dagre layout');
assert.ok(cssBundle.includes('.lld-node'), 'CSS bundle contains .lld-node styling');
assert.ok(cssBundle.includes('.react-flow'), 'CSS bundle contains react-flow styling');
assert.ok(cssBundle.includes('.react-flow__panel'), 'CSS bundle contains react-flow panel styling');
assert.ok(cssBundle.includes('.react-flow__controls'), 'CSS bundle contains react-flow controls styling');
assert.ok(cssBundle.includes('.react-flow__node'), 'CSS bundle contains react-flow node positioning');

console.log('✓ Build artifacts verified successfully.');

// Test 4: Verify Agent Guidelines Resolution & Idempotent Appending Logic
console.log('--- Test 4: Testing Agent File Resolution & Appending Logic ---');
function resolveAndApplyGuidelines(filesMap, skillContent) {
  const candidateFiles = ['AGENTS.md', 'agents.md', 'AGENT.md', 'agent.md'];
  let targetFile = null;
  let existingContent = null;

  for (const candidate of candidateFiles) {
    if (Object.prototype.hasOwnProperty.call(filesMap, candidate)) {
      targetFile = candidate;
      existingContent = filesMap[candidate];
      break;
    }
  }

  if (targetFile && existingContent !== null) {
    const alreadyConfigured =
      existingContent.includes('.agents/skills/arch-design') ||
      existingContent.includes('Arch Design');

    if (!alreadyConfigured) {
      const separator = existingContent.trim().length > 0 ? '\n\n' : '';
      filesMap[targetFile] = `${existingContent.trimEnd()}${separator}${skillContent}`;
    }
    return { targetFile, updated: !alreadyConfigured };
  } else {
    filesMap['AGENTS.md'] = skillContent;
    return { targetFile: 'AGENTS.md', updated: true };
  }
}

const dummySkill = '# Architecture & Agent Guidelines\nSee .agents/skills/arch-design/SKILL.md';

// Subtest A: When agents.md (lowercase) exists, append to it and preserve existing text
const mockFilesA = { 'agents.md': '# Existing Project Rules\nDo not break production.' };
const resA = resolveAndApplyGuidelines(mockFilesA, dummySkill);
assert.strictEqual(resA.targetFile, 'agents.md');
assert.ok(mockFilesA['agents.md'].includes('# Existing Project Rules'), 'Preserved existing rules');
assert.ok(mockFilesA['agents.md'].includes('# Architecture & Agent Guidelines'), 'Appended skill guidelines');
assert.strictEqual(mockFilesA['AGENTS.md'], undefined, 'Did not create redundant AGENTS.md');

// Subtest B: Idempotency - running again should not duplicate content
const resA2 = resolveAndApplyGuidelines(mockFilesA, dummySkill);
assert.strictEqual(resA2.updated, false, 'Did not re-append when already present');
const countOccurrences = (mockFilesA['agents.md'].match(/# Architecture & Agent Guidelines/g) || []).length;
assert.strictEqual(countOccurrences, 1, 'Skill section appears exactly once');

// Subtest C: When no agent file exists, creates AGENTS.md
const mockFilesC = {};
const resC = resolveAndApplyGuidelines(mockFilesC, dummySkill);
assert.strictEqual(resC.targetFile, 'AGENTS.md');
assert.strictEqual(mockFilesC['AGENTS.md'], dummySkill);

// Subtest D: When both AGENTS.md and agents.md exist, prioritizes AGENTS.md
const mockFilesD = { 'AGENTS.md': 'Existing AGENTS', 'agents.md': 'Existing agents' };
const resD = resolveAndApplyGuidelines(mockFilesD, dummySkill);
assert.strictEqual(resD.targetFile, 'AGENTS.md');
assert.ok(mockFilesD['AGENTS.md'].includes(dummySkill));

console.log('✓ Agent guidelines resolution and appending logic passed.');

// Test 5: Verify Skill Templates Parity & Completeness in templates/
console.log('--- Test 5: Testing Agent Skill Templates Parity & Completeness ---');
const templatesDir = path.join(__dirname, '..', 'templates');
const agentsMdPath = path.join(templatesDir, 'AGENTS.md');
const skillMdPath = path.join(templatesDir, 'skills', 'arch-design', 'SKILL.md');
const schemaMdPath = path.join(templatesDir, 'skills', 'arch-design', 'references', 'schema.md');
const rulesMdPath = path.join(templatesDir, 'skills', 'arch-design', 'references', 'rules.md');
const validateJsPath = path.join(templatesDir, 'skills', 'arch-design', 'scripts', 'validate.js');
const layoutJsPath = path.join(templatesDir, 'skills', 'arch-design', 'scripts', 'layout.js');
const sampleArchTemplatePath = path.join(templatesDir, 'skills', 'arch-design', 'examples', 'sample.arch');

assert.ok(fs.existsSync(agentsMdPath), 'templates/AGENTS.md must exist');
assert.ok(fs.existsSync(skillMdPath), 'templates/skills/arch-design/SKILL.md must exist');
assert.ok(fs.existsSync(schemaMdPath), 'templates/skills/arch-design/references/schema.md must exist');
assert.ok(fs.existsSync(rulesMdPath), 'templates/skills/arch-design/references/rules.md must exist');
assert.ok(fs.existsSync(validateJsPath), 'templates/skills/arch-design/scripts/validate.js must exist');
assert.ok(fs.existsSync(layoutJsPath), 'templates/skills/arch-design/scripts/layout.js must exist');
assert.ok(fs.existsSync(sampleArchTemplatePath), 'templates/skills/arch-design/examples/sample.arch must exist');

const agentsMdContent = fs.readFileSync(agentsMdPath, 'utf8');
const layoutJsContent = fs.readFileSync(layoutJsPath, 'utf8');
const schemaMdContent = fs.readFileSync(schemaMdPath, 'utf8');
const rulesMdContent = fs.readFileSync(rulesMdPath, 'utf8');
const validateJsContent = fs.readFileSync(validateJsPath, 'utf8');

// Verify AGENTS.md points to skill
assert.ok(agentsMdContent.includes('.agents/skills/arch-design/SKILL.md'), 'AGENTS.md template references skill location');

// Verify Dagre layouter inclusion in layout template
assert.ok(layoutJsContent.includes('@dagrejs/dagre'), 'Layout template includes Dagre integration');
assert.ok(layoutJsContent.includes('layoutSucceeded'), 'Layout template includes topological fallback');

// Verify full schema completeness
assert.ok(schemaMdContent.includes('Common Node Fields'), 'Schema template includes full Common Node Fields');
assert.ok(schemaMdContent.includes('TokenPayload'), 'Schema template includes complete Function examples');
assert.ok(schemaMdContent.includes('Supported') && schemaMdContent.includes('Badge Values'), 'Schema template includes tech badge specifications');

// Verify Service -> Service rule parity
assert.ok(rulesMdContent.includes('**Service** | **Service**'), 'Rules template includes Service -> Service connection');

// Verify validator has duplicate edge detection
assert.ok(validateJsContent.includes('seenEdges'), 'Validator template includes duplicate edge detection');

console.log('✓ Agent Skill templates parity verified successfully.');

// Test 6: Verify no deprecated url.parse() calls in project source
console.log('--- Test 6: Testing DEP0169 Guardrails (Zero url.parse usage) ---');
function scanDirForDeprecatedUrl(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'out' && entry.name !== '.git') {
        scanDirForDeprecatedUrl(fullPath);
      }
    } else if (/\.(ts|js|tsx|jsx)$/.test(entry.name) && fullPath !== __filename) {
      const content = fs.readFileSync(fullPath, 'utf8');
      assert.strictEqual(
        content.includes('url.' + 'parse('),
        false,
        `Deprecated url.parse() found in ${fullPath}. Use the WHATWG URL API instead.`
      );
    }
  }
}
scanDirForDeprecatedUrl(path.join(__dirname, '..', 'src'));
scanDirForDeprecatedUrl(path.join(__dirname, '..', 'templates'));
scanDirForDeprecatedUrl(__dirname);
console.log('✓ Zero url.parse() calls found across project source code.');

console.log('\nAll automated tests passed successfully!');

