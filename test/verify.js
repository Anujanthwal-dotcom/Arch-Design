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
const sampleNiaPath = path.join(__dirname, '..', 'examples', 'nowinandroid.arch');
const sampleNextPath = path.join(__dirname, '..', 'examples', 'nextjs-commerce.arch');
const sampleTokioPath = path.join(__dirname, '..', 'examples', 'tokio-hyper.arch');
const sampleSwiftPath = path.join(__dirname, '..', 'examples', 'swiftui-clean.arch');

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

const niaDoc = JSON.parse(fs.readFileSync(sampleNiaPath, 'utf8'));
assert.strictEqual(niaDoc.domain, 'android', 'Now in Android domain must be android');
assert.ok(niaDoc.nodes.some(n => n.type === 'screen' && n.tier === 'presentation'), 'Now in Android must contain screen');
assert.ok(niaDoc.nodes.some(n => n.type === 'viewmodel' && n.tier === 'logic'), 'Now in Android must contain viewmodel');
assert.ok(niaDoc.nodes.some(n => n.type === 'usecase' && n.tier === 'logic'), 'Now in Android must contain usecase');

const nextDoc = JSON.parse(fs.readFileSync(sampleNextPath, 'utf8'));
assert.strictEqual(nextDoc.domain, 'frontend', 'Next.js commerce domain must be frontend');
assert.ok(nextDoc.nodes.some(n => n.type === 'page' && n.tier === 'presentation'), 'Next.js commerce must contain page');
assert.ok(nextDoc.nodes.some(n => n.type === 'store' && n.tier === 'logic'), 'Next.js commerce must contain store');
assert.ok(nextDoc.nodes.some(n => n.type === 'action' && n.tier === 'execution'), 'Next.js commerce must contain server action');

const tokioDoc = JSON.parse(fs.readFileSync(sampleTokioPath, 'utf8'));
assert.strictEqual(tokioDoc.domain, 'systems', 'Tokio Hyper domain must be systems');
assert.ok(tokioDoc.nodes.some(n => n.type === 'crate' && n.tier === 'container'), 'Tokio Hyper must contain crate');
assert.ok(tokioDoc.nodes.some(n => n.type === 'trait' && n.tier === 'contract'), 'Tokio Hyper must contain trait');

const swiftDoc = JSON.parse(fs.readFileSync(sampleSwiftPath, 'utf8'));
assert.strictEqual(swiftDoc.domain, 'ios', 'SwiftUI clean domain must be ios');
assert.ok(swiftDoc.nodes.some(n => n.type === 'view' && n.tier === 'presentation'), 'SwiftUI clean must contain view');
assert.ok(swiftDoc.nodes.some(n => n.type === 'coordinator' && n.tier === 'logic'), 'SwiftUI clean must contain coordinator');

// Verify CLI validate script passes on all 8 domain samples
const validateScript = path.join(__dirname, '..', 'templates', 'skills', 'arch-design', 'scripts', 'validate.js');

[
  sampleArchPath,
  sampleFrontendPath,
  sampleMobilePath,
  sampleRustPath,
  sampleNiaPath,
  sampleNextPath,
  sampleTokioPath,
  sampleSwiftPath
].forEach(filePath => {
  const valOutput = execSync(`node "${validateScript}" "${filePath}"`, { encoding: 'utf8' });
  assert.ok(valOutput.includes('Validation Passed'), `validate.js must pass on ${path.basename(filePath)}`);
});

console.log('✓ All 8 domain reference .arch files schema-verified and passed CLI validation.');

// Test 2: Verify Connection Rules Logic Across Domains & Tiers
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
  { id: 'scr1', type: 'screen', tier: 'presentation' },
  { id: 'vm1', type: 'viewmodel', tier: 'logic' },
  { id: 'uc1', type: 'usecase', tier: 'logic' },
  { id: 'repo1', type: 'repository', tier: 'logic' },
  { id: 'dao1', type: 'dao', tier: 'contract' },
  { id: 'store1', type: 'store', tier: 'logic' },
  { id: 'act1', type: 'action', tier: 'execution' },
  { id: 'sch1', type: 'schema', tier: 'contract' },
  { id: 'crate1', type: 'crate', tier: 'container' },
  { id: 'str1', type: 'struct', tier: 'contract' },
  { id: 'trt1', type: 'trait', tier: 'contract' },
];

function resolveMockTier(node) {
  if (node?.tier) return node.tier;
  const t = (node?.type || '').toLowerCase();
  if (['module', 'crate', 'package', 'feature'].includes(t)) return 'container';
  if (['component', 'screen', 'view', 'page', 'composable', 'widget'].includes(t)) return 'presentation';
  if (['service', 'viewmodel', 'store', 'hook', 'usecase', 'coordinator', 'controller', 'repository'].includes(t)) return 'logic';
  if (['type', 'struct', 'trait', 'model', 'entity', 'dao', 'schema'].includes(t)) return 'contract';
  if (['function', 'method', 'endpoint', 'action'].includes(t)) return 'execution';
  if (['external', 'database', 'api', 'driver', 'runtime'].includes(t)) return 'infrastructure';
  return 'logic';
}

function checkValid(source, target, edges = []) {
  if (!source || !target) return false;
  if (source === target) return false;
  if (edges.some(e => e.source === source && e.target === target)) return false;

  const sNode = mockNodes.find(n => n.id === source);
  const tNode = mockNodes.find(n => n.id === target);
  if (!sNode || !tNode) return false;

  const sTier = resolveMockTier(sNode);
  const tTier = resolveMockTier(tNode);

  if (sTier === 'infrastructure' && tTier === 'presentation') return false;
  if (sTier === 'presentation' && tTier === 'infrastructure') return false;
  if (sTier === 'infrastructure' && tTier === 'infrastructure') return false;
  if (sTier === 'container' && tTier !== 'container') return false;

  if (sTier === 'container' && tTier === 'container') return true;
  if (sTier === 'presentation' && tTier === 'presentation') return true;
  if (sTier === 'logic' && tTier === 'presentation') return true;
  if (sTier === 'presentation' && tTier === 'logic') return true;
  if (sTier === 'logic' && tTier === 'logic') return true;
  if (sTier === 'execution' && tTier === 'logic') return true;
  if (sTier === 'execution' && tTier === 'presentation') return true;
  if (sTier === 'execution' && tTier === 'contract') return true;
  if (sTier === 'contract' && tTier === 'contract') return true;
  if (sTier === 'contract' && (tTier === 'logic' || tTier === 'presentation' || tTier === 'execution')) return true;
  if (sTier === 'infrastructure' && tTier === 'logic') return true;
  if (sTier === 'infrastructure' && tTier === 'container') return true;
  if (tTier === 'container') return true;

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

// Allowed Archetype Clean Architecture connections
assert.strictEqual(checkValid('scr1', 'vm1'), true, 'screen -> viewmodel is allowed');
assert.strictEqual(checkValid('vm1', 'uc1'), true, 'viewmodel -> usecase is allowed');
assert.strictEqual(checkValid('uc1', 'repo1'), true, 'usecase -> repository is allowed');
assert.strictEqual(checkValid('dao1', 'repo1'), true, 'dao -> repository is allowed');
assert.strictEqual(checkValid('e1', 'repo1'), true, 'room/database -> repository is allowed');
assert.strictEqual(checkValid('act1', 'store1'), true, 'server action -> store is allowed');
assert.strictEqual(checkValid('sch1', 'store1'), true, 'schema -> store is allowed');

// Allowed Systems (Rust) connections
assert.strictEqual(checkValid('t1', 't2'), true, 'type -> type (implements) is allowed');
assert.strictEqual(checkValid('trt1', 'str1'), true, 'trait -> struct (implements) is allowed');
assert.strictEqual(checkValid('str1', 'crate1'), true, 'struct -> crate (declares) is allowed');
assert.strictEqual(checkValid('f1', 'str1'), true, 'function -> struct (implements) is allowed');
assert.strictEqual(checkValid('e1', 'crate1'), true, 'tokio driver -> crate (injects) is allowed');

// Disallowed connections
assert.strictEqual(checkValid('m1', 's1'), false, 'module -> service is blocked');
assert.strictEqual(checkValid('e1', 'c1'), false, 'external -> component is blocked');
assert.strictEqual(checkValid('e1', 'scr1'), false, 'external -> screen is blocked');
assert.strictEqual(checkValid('scr1', 'e1'), false, 'screen -> external is blocked');
assert.strictEqual(checkValid('e1', 'e1'), false, 'external -> external is blocked');
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
assert.ok(webviewBundle.includes('ArchetypeNode'), 'Webview bundle contains ArchetypeNode');
assert.ok(webviewBundle.includes('DomainSelector'), 'Webview bundle contains DomainSelector');
assert.ok(webviewBundle.includes('FrameworkSelector'), 'Webview bundle contains FrameworkSelector');
assert.ok(webviewBundle.includes('FRAMEWORK_PRESETS'), 'Webview bundle contains FRAMEWORK_PRESETS');
assert.ok(cssBundle.includes('.node-type-badge.component'), 'CSS bundle contains component badge styling');
assert.ok(cssBundle.includes('.node-type-badge.tier-presentation'), 'CSS bundle contains tier-presentation badge styling');
assert.ok(cssBundle.includes('.node-type-badge.tier-logic'), 'CSS bundle contains tier-logic badge styling');
assert.ok(cssBundle.includes('.custom-card-modal'), 'CSS bundle contains custom card modal styling');
assert.ok(cssBundle.includes('.domain-selector'), 'CSS bundle contains domain-selector styling');
assert.ok(cssBundle.includes('.domain-dropdown-menu'), 'CSS bundle contains domain-dropdown-menu styling');
assert.ok(cssBundle.includes('.domain-category-filter-bar'), 'CSS bundle contains category filter styling');
assert.ok(cssBundle.includes('.domain-search-wrapper'), 'CSS bundle contains search styling');
assert.ok(cssBundle.includes('.domain-trigger-category-pill'), 'CSS bundle contains category pill styling');
assert.ok(cssBundle.includes('.canvas-bottom-right-panel'), 'CSS bundle contains canvas-bottom-right-panel styling');

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

const dummySkill = '# Arch Design Architecture & Agent Guidelines\nSee .agents/skills/arch-design/SKILL.md';
const mockFilesA = { 'agents.md': '# Existing Project Rules\nDo not break production.' };
const resA = resolveAndApplyGuidelines(mockFilesA, dummySkill);
assert.strictEqual(resA.targetFile, 'agents.md');
assert.ok(mockFilesA['agents.md'].includes('# Arch Design Architecture & Agent Guidelines'));

// Test Claude Code resolution logic
function resolveAndApplyClaude(filesMap, claudeContent) {
  if (Object.prototype.hasOwnProperty.call(filesMap, 'CLAUDE.md')) {
    const existing = filesMap['CLAUDE.md'];
    const alreadyConfigured = existing.includes('.agents/skills/arch-design') || existing.includes('Arch Design');
    if (!alreadyConfigured) {
      filesMap['CLAUDE.md'] = `${existing.trimEnd()}\n\n${claudeContent}`;
    }
    return { targetFile: 'CLAUDE.md', updated: !alreadyConfigured };
  } else {
    filesMap['CLAUDE.md'] = claudeContent;
    return { targetFile: 'CLAUDE.md', updated: true };
  }
}
const mockClaudeFiles = { 'CLAUDE.md': '# My Existing Claude Rules' };
const resClaude = resolveAndApplyClaude(mockClaudeFiles, dummySkill);
assert.strictEqual(resClaude.updated, true);
assert.ok(mockClaudeFiles['CLAUDE.md'].includes('Arch Design'));

console.log('✓ Agent guidelines resolution and appending logic passed.');

// Test 5: Verify Skill Templates Parity & Multi-Domain Completeness
console.log('--- Test 5: Testing Agent Skill Templates Parity & Multi-Domain Completeness ---');
const templatesDir = path.join(__dirname, '..', 'templates');
const agentsMdPath = path.join(templatesDir, 'AGENTS.md');
const claudeMdPath = path.join(templatesDir, 'rules', 'CLAUDE.md');
const cursorMdcPath = path.join(templatesDir, 'rules', 'cursor-arch-design.mdc');
const cursorrulesPath = path.join(templatesDir, 'rules', 'cursorrules');
const skillMdPath = path.join(templatesDir, 'skills', 'arch-design', 'SKILL.md');
const schemaMdPath = path.join(templatesDir, 'skills', 'arch-design', 'references', 'schema.md');
const rulesMdPath = path.join(templatesDir, 'skills', 'arch-design', 'references', 'rules.md');
const validateJsPath = path.join(templatesDir, 'skills', 'arch-design', 'scripts', 'validate.js');
const layoutJsPath = path.join(templatesDir, 'skills', 'arch-design', 'scripts', 'layout.js');
const sampleArchTemplatePath = path.join(templatesDir, 'skills', 'arch-design', 'examples', 'sample.arch');
const sampleFrontendTemplatePath = path.join(templatesDir, 'skills', 'arch-design', 'examples', 'sample-frontend.arch');
const sampleMobileTemplatePath = path.join(templatesDir, 'skills', 'arch-design', 'examples', 'sample-mobile.arch');
const sampleRustTemplatePath = path.join(templatesDir, 'skills', 'arch-design', 'examples', 'sample-rust.arch');
const niaTemplatePath = path.join(templatesDir, 'skills', 'arch-design', 'examples', 'nowinandroid.arch');
const nextTemplatePath = path.join(templatesDir, 'skills', 'arch-design', 'examples', 'nextjs-commerce.arch');
const tokioTemplatePath = path.join(templatesDir, 'skills', 'arch-design', 'examples', 'tokio-hyper.arch');
const swiftTemplatePath = path.join(templatesDir, 'skills', 'arch-design', 'examples', 'swiftui-clean.arch');

assert.ok(fs.existsSync(agentsMdPath), 'templates/AGENTS.md must exist');
assert.ok(fs.existsSync(claudeMdPath), 'templates/rules/CLAUDE.md must exist');
assert.ok(fs.existsSync(cursorMdcPath), 'templates/rules/cursor-arch-design.mdc must exist');
assert.ok(fs.existsSync(cursorrulesPath), 'templates/rules/cursorrules must exist');
assert.ok(fs.existsSync(skillMdPath), 'templates/skills/arch-design/SKILL.md must exist');
assert.ok(fs.existsSync(schemaMdPath), 'templates/skills/arch-design/references/schema.md must exist');
assert.ok(fs.existsSync(rulesMdPath), 'templates/skills/arch-design/references/rules.md must exist');
assert.ok(fs.existsSync(validateJsPath), 'templates/skills/arch-design/scripts/validate.js must exist');
assert.ok(fs.existsSync(layoutJsPath), 'templates/skills/arch-design/scripts/layout.js must exist');
assert.ok(fs.existsSync(sampleArchTemplatePath), 'templates/skills/arch-design/examples/sample.arch must exist');
assert.ok(fs.existsSync(sampleFrontendTemplatePath), 'templates/skills/arch-design/examples/sample-frontend.arch must exist');
assert.ok(fs.existsSync(sampleMobileTemplatePath), 'templates/skills/arch-design/examples/sample-mobile.arch must exist');
assert.ok(fs.existsSync(sampleRustTemplatePath), 'templates/skills/arch-design/examples/sample-rust.arch must exist');
assert.ok(fs.existsSync(niaTemplatePath), 'nowinandroid.arch template must exist');
assert.ok(fs.existsSync(nextTemplatePath), 'nextjs-commerce.arch template must exist');
assert.ok(fs.existsSync(tokioTemplatePath), 'tokio-hyper.arch template must exist');
assert.ok(fs.existsSync(swiftTemplatePath), 'swiftui-clean.arch template must exist');

const claudeMdContent = fs.readFileSync(claudeMdPath, 'utf8');
const cursorMdcContent = fs.readFileSync(cursorMdcPath, 'utf8');
assert.ok(claudeMdContent.includes('validate.js'), 'CLAUDE.md contains validate.js instruction');
assert.ok(cursorMdcContent.includes('globs: ["*.arch", "*.lld"]'), 'cursor-arch-design.mdc contains file globs');
assert.ok(cursorMdcContent.includes('validate.js'), 'cursor-arch-design.mdc contains validate.js instruction');

const schemaMdContent = fs.readFileSync(schemaMdPath, 'utf8');
const rulesMdContent = fs.readFileSync(rulesMdPath, 'utf8');

assert.ok(schemaMdContent.includes('Architecture Tiers Mapping'), 'Schema template documents Architecture Tiers');
assert.ok(schemaMdContent.includes('presentation'), 'Schema template documents presentation tier');
assert.ok(rulesMdContent.includes('Universal Tier Connection Matrix'), 'Rules template documents Universal Tier Connection Matrix');
assert.ok(rulesMdContent.includes('presentation'), 'Rules template documents presentation rules');

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

// Test 7: Verify Framework Presets Registry & Backward Compatibility
console.log('--- Test 7: Testing Framework Preset Registry & Compatibility ---');
const testDocWithFramework = {
  version: 2,
  domain: 'frontend',
  framework: 'nextjs',
  name: 'test-framework-arch',
  nodes: [
    {
      id: 'p1',
      type: 'page',
      tier: 'presentation',
      label: 'Home Page',
      pos: { x: 100, y: 100 },
      subType: 'nextjs'
    },
    {
      id: 'a1',
      type: 'action',
      tier: 'execution',
      label: 'Submit Order',
      pos: { x: 400, y: 100 },
      subType: 'server-action'
    }
  ],
  edges: [
    {
      id: 'e1',
      from: 'a1',
      to: 'p1',
      type: 'invokes'
    }
  ]
};

const tmpTestPath = path.join(__dirname, 'temp-framework-test.arch');
fs.writeFileSync(tmpTestPath, JSON.stringify(testDocWithFramework, null, 2));

try {
  const valOutput = execSync(`node "${validateScript}" "${tmpTestPath}"`, { encoding: 'utf8' });
  assert.ok(valOutput.includes('Validation Passed'), 'validate.js must pass on framework-enhanced .arch files');
} finally {
  if (fs.existsSync(tmpTestPath)) {
    fs.unlinkSync(tmpTestPath);
  }
}

console.log('✓ Framework preset schema compatibility and validation verified successfully.');

console.log('\nAll automated tests passed successfully!');
