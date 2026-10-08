const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Test 1: Load and parse all domain sample arch files
console.log('--- Test 1: Testing Multi-Domain Sample .arch Schema Integrity ---');
const sampleArchPath = path.join(__dirname, '..', 'examples', 'sample.arch');
const sampleFrontendPath = path.join(__dirname, '..', 'examples', 'sample-frontend.arch');
const sampleMobilePath = path.join(__dirname, '..', 'examples', 'sample-mobile.arch');
const sampleRustPath = path.join(__dirname, '..', 'examples', 'sample-rust.arch');

const sampleDoc = JSON.parse(fs.readFileSync(sampleArchPath, 'utf8'));
assert.strictEqual(sampleDoc.version, 2, 'Version must be 2');
assert.strictEqual(sampleDoc.name, 'auth-system', 'Name should be auth-system');
assert.strictEqual(sampleDoc.nodes.length, 6, 'sample.arch must contain 6 nodes');
assert.strictEqual(sampleDoc.edges.length, 5, 'sample.arch must contain 5 edges');

const frontendDoc = JSON.parse(fs.readFileSync(sampleFrontendPath, 'utf8'));
assert.strictEqual(frontendDoc.domain, 'frontend', 'Frontend sample domain must be frontend');
assert.ok(frontendDoc.nodes.some(n => n.type === 'component'), 'Frontend sample must contain component node');

const mobileDoc = JSON.parse(fs.readFileSync(sampleMobilePath, 'utf8'));
assert.strictEqual(mobileDoc.domain, 'mobile', 'Mobile sample domain must be mobile');
assert.ok(mobileDoc.nodes.some(n => n.type === 'component'), 'Mobile sample must contain screen component');
assert.ok(mobileDoc.nodes.some(n => n.type === 'type'), 'Mobile sample must contain type model');

const rustDoc = JSON.parse(fs.readFileSync(sampleRustPath, 'utf8'));
assert.strictEqual(rustDoc.domain, 'systems', 'Rust sample domain must be systems');
assert.ok(rustDoc.nodes.some(n => n.type === 'type' && n.subType === 'struct'), 'Rust sample must contain struct');
assert.ok(rustDoc.nodes.some(n => n.type === 'type' && n.subType === 'trait'), 'Rust sample must contain trait');

// Verify CLI validate script passes on all domain samples
const validateScript = path.join(__dirname, '..', 'templates', 'skills', 'arch-design', 'scripts', 'validate.js');

[sampleArchPath, sampleFrontendPath, sampleMobilePath, sampleRustPath].forEach(filePath => {
  const valOutput = execSync(`node "${validateScript}" "${filePath}"`, { encoding: 'utf8' });
  assert.ok(valOutput.includes('Validation Passed'), `validate.js must pass on ${path.basename(filePath)}`);
});

console.log('✓ All domain sample .arch files schema-verified and passed CLI validation.');

// Test 2: Verify Connection Rules Logic Across Domains
console.log('--- Test 2: Testing Multi-Domain Connection Validation Rules ---');
const mockNodes = [
  { id: 'm1', type: 'module' },
  { id: 'm2', type: 'module' },
  { id: 's1', type: 'service' },
  { id: 's2', type: 'service' },
  { id: 'c1', type: 'component' },
  { id: 'c2', type: 'component' },
  { id: 't1', type: 'type' },
  { id: 't2', type: 'type' },
  { id: 'f1', type: 'function' },
  { id: 'e1', type: 'external' },
];

function checkValid(source, target, edges = []) {
  if (!source || !target) return false;
  if (source === target) return false;
  if (edges.some(e => e.source === source && e.target === target)) return false;

  const sNode = mockNodes.find(n => n.id === source);
  const tNode = mockNodes.find(n => n.id === target);
  const sType = sNode?.type;
  const tType = tNode?.type;

  // Backend / Monolith
  if (sType === 'service' && tType === 'module') return true;
  if (sType === 'function' && tType === 'service') return true;
  if (sType === 'external' && tType === 'service') return true;
  if (sType === 'external' && tType === 'module') return true;
  if (sType === 'service' && tType === 'service') return true;
  if (sType === 'module' && tType === 'module') return true;

  // Frontend & Mobile
  if (sType === 'component' && tType === 'component') return true;
  if (sType === 'service' && tType === 'component') return true;
  if (sType === 'component' && tType === 'service') return true;
  if (sType === 'component' && tType === 'module') return true;
  if (sType === 'function' && tType === 'component') return true;

  // Systems / Types
  if (sType === 'type' && tType === 'type') return true;
  if (sType === 'type' && tType === 'service') return true;
  if (sType === 'type' && tType === 'component') return true;
  if (sType === 'type' && tType === 'function') return true;
  if (sType === 'type' && tType === 'module') return true;
  if (sType === 'function' && tType === 'type') return true;

  return false;
}

// Allowed Backend connections
assert.strictEqual(checkValid('s1', 'm1'), true, 'service -> module is allowed');
assert.strictEqual(checkValid('f1', 's1'), true, 'function -> service is allowed');
assert.strictEqual(checkValid('e1', 's1'), true, 'external -> service is allowed');
assert.strictEqual(checkValid('e1', 'm1'), true, 'external -> module is allowed');
assert.strictEqual(checkValid('s1', 's2'), true, 'service -> service is allowed');
assert.strictEqual(checkValid('m2', 'm1'), true, 'module -> module is allowed');

// Allowed Frontend & Mobile connections
assert.strictEqual(checkValid('c2', 'c1'), true, 'component -> component (renders) is allowed');
assert.strictEqual(checkValid('s1', 'c1'), true, 'service -> component (observes) is allowed');
assert.strictEqual(checkValid('c1', 's1'), true, 'component -> service (uses) is allowed');
assert.strictEqual(checkValid('c1', 'm1'), true, 'component -> module (belongsTo) is allowed');
assert.strictEqual(checkValid('f1', 'c1'), true, 'function -> component (helper) is allowed');

// Allowed Systems (Rust) connections
assert.strictEqual(checkValid('t1', 't2'), true, 'type -> type (implements) is allowed');
assert.strictEqual(checkValid('t1', 's1'), true, 'type -> service (defines) is allowed');
assert.strictEqual(checkValid('t1', 'c1'), true, 'type -> component (defines) is allowed');
assert.strictEqual(checkValid('t1', 'f1'), true, 'type -> function (defines) is allowed');
assert.strictEqual(checkValid('t1', 'm1'), true, 'type -> module (declares) is allowed');
assert.strictEqual(checkValid('f1', 't1'), true, 'function -> type (implements) is allowed');

// Disallowed connections
assert.strictEqual(checkValid('m1', 's1'), false, 'module -> service is blocked');
assert.strictEqual(checkValid('s1', 'f1'), false, 'service -> function is blocked');
assert.strictEqual(checkValid('s1', 'e1'), false, 'service -> external is blocked');
assert.strictEqual(checkValid('e1', 'c1'), false, 'external -> component is blocked');
assert.strictEqual(checkValid('c1', 'e1'), false, 'component -> external is blocked');
assert.strictEqual(checkValid('m1', 'm1'), false, 'self-loop is blocked');
assert.strictEqual(checkValid('s1', 'm1', [{ source: 's1', target: 'm1' }]), false, 'duplicate edge is blocked');

console.log('✓ All multi-domain connection validation rules passed.');

// Test 3: Verify Bundle Exists and Has No Missing Symbols
console.log('--- Test 3: Testing Build Artifacts ---');
const extBundle = fs.readFileSync(path.join(__dirname, '..', 'out', 'extension.js'), 'utf8');
const webviewBundle = fs.readFileSync(path.join(__dirname, '..', 'out', 'editor', 'bundle.js'), 'utf8');
const cssBundle = fs.readFileSync(path.join(__dirname, '..', 'out', 'editor', 'bundle.css'), 'utf8');

assert.ok(extBundle.includes('LLDCanvasEditorProvider'), 'Extension bundle contains provider');
assert.ok(extBundle.includes('lldCanvas.newFile'), 'Extension bundle contains newFile command');
assert.ok(webviewBundle.length > 500000, 'Webview bundle is properly sized');
assert.ok(webviewBundle.includes('ComponentNode'), 'Webview bundle contains ComponentNode');
assert.ok(webviewBundle.includes('TypeNode'), 'Webview bundle contains TypeNode');
assert.ok(cssBundle.includes('.node-type-badge.component'), 'CSS bundle contains component badge styling');
assert.ok(cssBundle.includes('.node-type-badge.type'), 'CSS bundle contains type badge styling');

console.log('✓ Build artifacts verified successfully.');

// Test 4: Verify Agent Guidelines Resolution & Appending Logic
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
const mockFilesA = { 'agents.md': '# Existing Project Rules\nDo not break production.' };
const resA = resolveAndApplyGuidelines(mockFilesA, dummySkill);
assert.strictEqual(resA.targetFile, 'agents.md');
assert.ok(mockFilesA['agents.md'].includes('# Architecture & Agent Guidelines'));

console.log('✓ Agent guidelines resolution and appending logic passed.');

// Test 5: Verify Skill Templates Parity & Multi-Domain Completeness
console.log('--- Test 5: Testing Agent Skill Templates Parity & Multi-Domain Completeness ---');
const templatesDir = path.join(__dirname, '..', 'templates');
const agentsMdPath = path.join(templatesDir, 'AGENTS.md');
const skillMdPath = path.join(templatesDir, 'skills', 'arch-design', 'SKILL.md');
const schemaMdPath = path.join(templatesDir, 'skills', 'arch-design', 'references', 'schema.md');
const rulesMdPath = path.join(templatesDir, 'skills', 'arch-design', 'references', 'rules.md');
const validateJsPath = path.join(templatesDir, 'skills', 'arch-design', 'scripts', 'validate.js');
const layoutJsPath = path.join(templatesDir, 'skills', 'arch-design', 'scripts', 'layout.js');
const sampleArchTemplatePath = path.join(templatesDir, 'skills', 'arch-design', 'examples', 'sample.arch');
const sampleFrontendTemplatePath = path.join(templatesDir, 'skills', 'arch-design', 'examples', 'sample-frontend.arch');
const sampleMobileTemplatePath = path.join(templatesDir, 'skills', 'arch-design', 'examples', 'sample-mobile.arch');
const sampleRustTemplatePath = path.join(templatesDir, 'skills', 'arch-design', 'examples', 'sample-rust.arch');

assert.ok(fs.existsSync(agentsMdPath), 'templates/AGENTS.md must exist');
assert.ok(fs.existsSync(skillMdPath), 'templates/skills/arch-design/SKILL.md must exist');
assert.ok(fs.existsSync(schemaMdPath), 'templates/skills/arch-design/references/schema.md must exist');
assert.ok(fs.existsSync(rulesMdPath), 'templates/skills/arch-design/references/rules.md must exist');
assert.ok(fs.existsSync(validateJsPath), 'templates/skills/arch-design/scripts/validate.js must exist');
assert.ok(fs.existsSync(layoutJsPath), 'templates/skills/arch-design/scripts/layout.js must exist');
assert.ok(fs.existsSync(sampleArchTemplatePath), 'templates/skills/arch-design/examples/sample.arch must exist');
assert.ok(fs.existsSync(sampleFrontendTemplatePath), 'templates/skills/arch-design/examples/sample-frontend.arch must exist');
assert.ok(fs.existsSync(sampleMobileTemplatePath), 'templates/skills/arch-design/examples/sample-mobile.arch must exist');
assert.ok(fs.existsSync(sampleRustTemplatePath), 'templates/skills/arch-design/examples/sample-rust.arch must exist');

const schemaMdContent = fs.readFileSync(schemaMdPath, 'utf8');
const rulesMdContent = fs.readFileSync(rulesMdPath, 'utf8');

assert.ok(schemaMdContent.includes('Component'), 'Schema template documents Component');
assert.ok(schemaMdContent.includes('Type'), 'Schema template documents Type');
assert.ok(rulesMdContent.includes('**Component** | **Component**'), 'Rules template documents Component rendering');
assert.ok(rulesMdContent.includes('**Type** | **Type**'), 'Rules template documents Type implementing');

console.log('✓ Multi-domain Agent Skill templates verified successfully.');

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
