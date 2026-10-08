---
name: arch-design
description: >-
  Use this skill whenever reading, inspecting, understanding, creating, editing,
  or validating Arch Design (.arch and .lld) visual architecture canvas files,
  or when converting codebase architecture into visual architecture diagrams
  across Frontend, Mobile, Systems (Rust), or Backend domains.
---

# Arch Design Skill: Multi-Domain Visual Architecture & LLD for Coding Agents

This skill teaches AI coding agents how to interact bidirectionally with **Arch Design** visual architecture files (`.arch` and `.lld`) across multiple architectural paradigms:
- **Backend**: Modular monoliths, microservices, domain boundaries, services, DBs.
- **Frontend (React, Vue, Next.js)**: Screens, components, reactive stores, hooks, REST/GraphQL APIs.
- **Mobile (Android & iOS)**: Jetpack Compose / SwiftUI screens, ViewModels, Repositories, Room / CoreData.
- **Systems Programming (Rust, C++, Go)**: Crates, structs, traits, async runtimes (Tokio), OS/FFI/Hardware.

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
   - **Modules (`type: "module"`)**: High-level domain boundary, crate, or feature scope.
   - **Components (`type: "component"`)**: UI screens, views, widgets, or pages (check `subType` like `"screen"` or `"component"`).
   - **Services (`type: "service"`)**: Business logic service, ViewModel, Store, or Repository (check `typeRef` and `subType`).
   - **Types (`type: "type"`)**: Structs, traits, interfaces, DTOs, or domain entities (check `subType` like `"struct"`, `"trait"`, `"model"`).
   - **Functions (`type: "function"`)**: Typed method signatures (`parameters` and `returns`).
   - **Externals (`type: "external"`)**: Underlying infrastructure or third-party dependencies (`postgres`, `room`, `sqlite`, `rest`, `graphql`, `tokio`).
3. **Trace Dependencies**:
   Inspect the `edges` array:
   - Tracing upstream callers and downstream dependencies ensures clean refactoring without breaking contracts.

---

## 2. How to Draw or Update an Architecture Diagram

When asked to create a new architecture or update an existing `.arch` file:

### Step 1: Draft Nodes & Edges
Refer to the schema reference: [references/schema.md](./references/schema.md).
- Specify `domain`: `"backend"`, `"frontend"`, `"mobile"`, `"systems"`, or `"universal"`.
- Create unique IDs prefixed by type: `m1` (Module), `c1` (Component), `s1` (Service), `t1` (Type), `f1` (Function), `e1` (External).
- Assign types, labels, descriptions, parameters, returns, subTypes, and tech badges.
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

Arch Design enforces Low-Level Design separation of concerns across all domains:

### Backend & Clean Architecture
- ✅ **Service $\rightarrow$ Module** (`injects`)
- ✅ **Function $\rightarrow$ Service** (`implements`)
- ✅ **External $\rightarrow$ Service / Module** (`injects`)
- ✅ **Service $\rightarrow$ Service** (`injects`)
- ✅ **Module $\rightarrow$ Module** (`submodule`)

### Frontend & Mobile (MVVM / Component Trees)
- ✅ **Component $\rightarrow$ Component** (`renders`)
- ✅ **Service $\rightarrow$ Component** (`observes` state from Store / ViewModel)
- ✅ **Component $\rightarrow$ Service** (`uses` ViewModel / Store)
- ✅ **Component $\rightarrow$ Module** (`belongsTo` feature module)
- ✅ **Function $\rightarrow$ Component** (`helper` utility)

### Systems Programming & Contracts (Rust, C++, TypeScript)
- ✅ **Type $\rightarrow$ Type** (`implements` trait / extends interface)
- ✅ **Type $\rightarrow$ Service / Component / Function** (`defines` contract / DTO)
- ✅ **Type $\rightarrow$ Module** (`declares` in crate/module)
- ✅ **Function $\rightarrow$ Type** (`implements` method on struct/trait)

### Prohibited Connections
- ❌ **External $\rightarrow$ Component** (Blocked: UI components must not bypass ViewModels/State to call raw DBs)
- ❌ **External $\rightarrow$ External** (Blocked)
- ❌ **Self-loops & duplicate edges** (Blocked)

---

## 4. Helper Tools & Domain Examples

- [Validator Script](./scripts/validate.js): Validates JSON schema and tier connection rules.
- [Layout Script](./scripts/layout.js): Computes Dagre coordinates automatically based on tier ranking.
- [Full Schema Reference](./references/schema.md): Complete JSON v2 tier and archetype specification.
- [Rules Reference](./references/rules.md): Architectural matrix and tier principles.

### Canonical Real-World Reference Architectures:
- [Android Clean Architecture](./examples/nowinandroid.arch): Google *Now in Android* (Compose screens, StateFlow ViewModels, UseCases, Repositories, Room DAOs).
- [Next.js Commerce](./examples/nextjs-commerce.arch): Next.js App Router (RSC pages, Client components, Zustand store, Server Actions, Zod schemas, Shopify API).
- [Rust Systems Engine](./examples/tokio-hyper.arch): Async Tokio & Hyper engine (Crates, Structs, Traits, green-thread tasks, kernel epoll I/O).
- [iOS SwiftUI Clean](./examples/swiftui-clean.arch): Apple SwiftUI + SwiftData (SwiftUI views, Observable ViewModels, Coordinators, SwiftData ModelContainer).
- [Backend Auth Monolith](./examples/sample.arch): Backend authentication and JWT modular monolith.
