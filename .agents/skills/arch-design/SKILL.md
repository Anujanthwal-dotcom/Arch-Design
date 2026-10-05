---
name: arch-design
description: >-
  Use this skill whenever reading, inspecting, understanding, creating, editing,
  or validating Arch Design (.arch and .lld) visual architecture canvas files,
  or when converting codebase architecture into visual architecture diagrams.
---

# Arch Design Skill: Visual Architecture & LLD for Coding Agents

This skill teaches AI coding agents how to interact bidirectionally with **Arch Design** visual architecture files (`.arch` and `.lld`).

By using `.arch` files:
- **Agents understand code before writing it**: Inspect modules, service boundaries, typed method signatures, and infrastructure dependencies.
- **Agents document architecture as code evolves**: Generate or update clean visual diagrams directly in the repository.

---

## 1. How to Understand an Existing Architecture

When starting a coding or refactoring task in a repository with `.arch` files:

1. **Locate Architecture Files**:
   Search the repository for `*.arch` or `*.lld` files:
   ```bash
   find . -name "*.arch" -o -name "*.lld"
   ```
2. **Inspect the JSON Hierarchy**:
   Read the file and map out the system:
   - **Modules (`type: "module"`)**: Note high-level domain boundaries and scope.
   - **Services (`type: "service"`)**: Note service names and `typeRef` (file or class targets).
   - **Functions (`type: "function"`)**: Read exact `parameters` (names, types, required flags) and `returns` contracts.
   - **Externals (`type: "external"`)**: Identify underlying infrastructure (e.g. `postgres`, `redis`, `kafka`, `s3`).
3. **Trace Dependencies**:
   Inspect the `edges` array:
   - Trace upstream callers and downstream dependencies before modifying existing methods.

---

## 2. How to Draw or Update an Architecture Diagram

When asked to create a new architecture or update an existing `.arch` file:

### Step 1: Draft Nodes & Edges
Refer to the schema reference: [references/schema.md](./references/schema.md).
- Create unique IDs prefixed by type: `m1` (Module), `s1` (Service), `f1` (Function), `e1` (External).
- Assign types, labels, descriptions, parameters, returns, and tech badges.
- Connect nodes according to the allowed connection rules: [references/rules.md](./references/rules.md).

### Step 2: Auto-Calculate Visual Coordinates
Do not guess pixel math manually. Run the layout script to automatically assign non-overlapping Dagre coordinates:
```bash
node .agents/skills/arch-design/scripts/layout.js path/to/file.arch
```

### Step 3: Validate the Architecture
Always run the validation script to verify schema integrity and rule compliance:
```bash
node .agents/skills/arch-design/scripts/validate.js path/to/file.arch
```
If errors are reported, correct the JSON structure until validation passes with exit code 0.

---

## 3. Allowed Architectural Rules Quick Reference

Arch Design enforces strict Low-Level Design separation of concerns:

- ✅ **Module $\rightarrow$ Service** (`contains`)
- ✅ **Service $\rightarrow$ Function** (`contains`)
- ✅ **Service $\rightarrow$ External** (`uses`)
- ✅ **Module $\rightarrow$ External** (`uses`)
- ✅ **Service $\rightarrow$ Service** (`uses`)
- ❌ **Function $\rightarrow$ Module / Service / External** (Blocked)
- ❌ **External $\rightarrow$ Service** (Blocked)
- ❌ **Self-loops & duplicate edges** (Blocked)

---

## 4. Helper Tools

- [Validator Script](./scripts/validate.js): Validates JSON schema and connection rules.
- [Layout Script](./scripts/layout.js): Computes Dagre coordinates automatically.
- [Full Schema Reference](./references/schema.md): Complete JSON v2 type specification.
- [Rules Reference](./references/rules.md): Architectural matrix and principles.
- [Example File](./examples/sample.arch): Complete reference architecture.
