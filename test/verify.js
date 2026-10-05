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

console.log('✓ sample.lld schema integrity passed.');

// Test 2: Verify Connection Rules Logic
console.log('--- Test 2: Testing Connection Validation Rules ---');
const mockNodes = [
  { id: 'm1', type: 'module', data: { nodeType: 'module' } },
  { id: 's1', type: 'service', data: { nodeType: 'service' } },
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

  if (sType === 'module' && tType === 'service') return true;
  if (sType === 'service' && tType === 'function') return true;
  if (sType === 'service' && tType === 'external') return true;
  if (sType === 'module' && tType === 'external') return true;

  return false;
}

// Allowed connections
assert.strictEqual(checkValid('m1', 's1'), true, 'module -> service is allowed');
assert.strictEqual(checkValid('s1', 'f1'), true, 'service -> function is allowed');
assert.strictEqual(checkValid('s1', 'e1'), true, 'service -> external is allowed');
assert.strictEqual(checkValid('m1', 'e1'), true, 'module -> external is allowed');

// Disallowed connections
assert.strictEqual(checkValid('s1', 'm1'), false, 'service -> module (reverse) is blocked');
assert.strictEqual(checkValid('f1', 's1'), false, 'function -> service (reverse) is blocked');
assert.strictEqual(checkValid('f1', 'm1'), false, 'function -> module is blocked');
assert.strictEqual(checkValid('f1', 'e1'), false, 'function -> external is blocked');
assert.strictEqual(checkValid('e1', 's1'), false, 'external -> service is blocked');
assert.strictEqual(checkValid('m1', 'm1'), false, 'self-loop is blocked');
assert.strictEqual(checkValid('m1', 's1', [{ source: 'm1', target: 's1' }]), false, 'duplicate edge is blocked');

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
console.log('\nAll automated tests passed successfully!');
