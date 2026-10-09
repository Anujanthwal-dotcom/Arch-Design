# Arch Design - Visual Architecture Canvas

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/AnujAnthwal.arch-for-LLD-design?color=blue&label=VS%20Code%20Marketplace)](https://marketplace.visualstudio.com/items?itemName=AnujAnthwal.arch-for-LLD-design)
[![Website Live Demo](https://img.shields.io/badge/Website-Live%20Demo-38bdf8?style=flat&logo=googlechrome&logoColor=white)](https://anujanthwal-dotcom.github.io/Arch-Design/)
[![Docs & CLI Reference](https://img.shields.io/badge/Docs-Agent%20Skills%20%26%20CLI-8b5cf6?style=flat&logo=gitbook&logoColor=white)](https://anujanthwal-dotcom.github.io/Arch-Design/#docs)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

> 🌐 **Live Demo & Documentation**: Try the interactive canvas online at [https://anujanthwal-dotcom.github.io/Arch-Design/](https://anujanthwal-dotcom.github.io/Arch-Design/)

Arch Design is an interactive visual architecture canvas for Visual Studio Code. It allows software architects, engineers, and AI coding agents to map, design, and inspect modules, services, functions, and external infrastructure dependencies.

The `.arch` file format is saved as structured JSON, making it intuitive for humans to design visually and seamless for AI coding agents to implement faithfully.

---

## Features

- **Interactive Canvas**: Pan, zoom, drag cards, view a minimap, and auto-arrange nodes with Dagre layout.
- **Multi-Domain Architectural Presets**: Seamlessly switch or mix presets in the toolbar:
  - **Backend**: Modular monoliths, microservices, domain services, databases, and message queues.
  - **Frontend (React, Vue, Next.js)**: Screens, components, reactive stores (Zustand/Redux), hooks, and APIs.
  - **Mobile (Android & iOS)**: Jetpack Compose / SwiftUI screens, ViewModels, Repositories, Room / CoreData.
  - **Systems Programming (Rust, C++, Go)**: Crates, structs, traits, async runtimes (Tokio), and hardware/OS drivers.
  - **Universal**: Full palette access to all architectural building blocks.
- **Card-Based Architectural Primitives**:
  - **Module**: High-level logical domain, package, crate, or feature boundary.
  - **Component**: UI views, screens, widgets, modals, or pages.
  - **Service**: Business logic services, ViewModels, reactive stores, repositories, and controllers.
  - **Type**: Structs, traits, data contracts, DTOs, interfaces, and schemas.
  - **Function**: Methods and routines specifying input parameters, return values, and data types.
  - **External**: Third-party services, databases, local stores, async runtimes, and external APIs.
- **Focus Mode**: Select any card to highlight its upstream and downstream connections with animated directional flow lines while dimming unrelated cards.
- **Architecture Validation Rules**: Built-in connection rules prevent invalid relationships and keep system designs clean and hierarchical.
- **Adaptive Card Fields**: Multi-line descriptions, properties, parameters, and return fields expand dynamically to fit their text without awkward internal scrollbars.
- **Visual Tech Badges**: Built-in logos and badges for PostgreSQL, Redis, MongoDB, MySQL, Kafka, S3, RabbitMQ, SQLite, Room, CoreData, SwiftData, GraphQL, REST, WebSockets, Tokio, and Hardware/Drivers.
- **AI Agent Readable**: Standardized JSON schema (v2.1) that coding agents can parse directly to generate boilerplate, scaffolding, and full implementations.

---

## Getting Started

### 1. Create a New Architecture File
- Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`).
- Select **Arch: New Architecture File**.
- Choose a location and save as `architecture.arch`.

Alternatively, create any file ending with `.arch` in your workspace and click to open it.

### 2. Navigating the Canvas
- **Domain Preset**: Select **Universal**, **Backend**, **Frontend**, **Mobile**, or **Systems (Rust)** in the toolbar to adapt available cards.
- **Add Nodes**: Use the top toolbar to insert Cards tailored to your domain.
- **Connect Nodes**: Click and drag from any card's connection handle to another card.
- **Focus Mode**: Click on any card to isolate and trace its complete dependency tree.
- **Auto Layout**: Click the Layout button in the toolbar to automatically organize and align nodes.

### 3. Equip AI Coding Agents (Agent Skill)
Arch Design includes an open **Agent Skill** specification so modern AI coding assistants (Google Antigravity, Claude Code, Cursor, Windsurf, Copilot, Cline, Aider) can natively read, understand, validate, and draw `.arch` diagrams.

#### Installation
- Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`).
- Select **Arch: Install Agent Skill**.
- Choose your preferred scope:
  - **Current Workspace (`.agents/skills/arch-design/` & `AGENTS.md`)**: Recommended for projects and shared team repositories.
  - **Global User Profile (`~/.gemini/config/skills/arch-design/`)**: Available across all projects on your machine.

#### Agent Discovery & Compatibility

| Coding Agent | Discovery Mechanism | Setup Needed |
| :--- | :--- | :--- |
| **Google Antigravity** | Scans `.agents/skills/` & global config | Zero-config (native skill discovery) |
| **Claude Code** | Reads `AGENTS.md` and `CLAUDE.md` | Auto-configured via root `AGENTS.md` |
| **Cursor (Composer)** | Reads `.cursorrules` and `AGENTS.md` | Auto-configured via root `AGENTS.md` |
| **Windsurf (Cascade)**| Reads `.windsurfrules` and `AGENTS.md` | Auto-configured via root `AGENTS.md` |

#### Bundled CLI Tools for Agents & Developers
The skill includes standalone Node.js tools in `.agents/skills/arch-design/scripts/` so agents and CI workflows never make syntax errors or guess coordinate math:

```bash
# 1. Validate schema integrity & architecture rules
node .agents/skills/arch-design/scripts/validate.js architecture.arch

# 2. Auto-layout visual coordinates using Dagre graph ranking
node .agents/skills/arch-design/scripts/layout.js architecture.arch
```

#### Bundled Multi-Domain Reference Architectures
- `sample.arch`: Backend Modular Monolith
- `sample-frontend.arch`: React / Zustand E-Commerce Frontend
- `sample-mobile.arch`: Android / iOS Clean Architecture + MVVM
- `sample-rust.arch`: Systems Programming Tokio Packet Engine

For interactive examples, live canvas demo, and documentation, visit [https://anujanthwal-dotcom.github.io/Arch-Design/](https://anujanthwal-dotcom.github.io/Arch-Design/).

---

## Architectural Rules

Arch enforces clean separation of concerns across all software domains:

| Source | Target | Relationship |
| :--- | :--- | :--- |
| **Service** | **Module** | Service injected into module (`injects`) |
| **Function** | **Service** | Function implements / provides method to service (`implements`) |
| **External** | **Service / Module** | External dependency injected into service or module (`injects`) |
| **Service** | **Service** | Dependency service injected into consumer service (`injects`) |
| **Module** | **Module** | Submodule is part of / injected into parent module (`submodule`) |
| **Component** | **Component** | Parent UI component renders child component (`renders`) |
| **Service** | **Component** | ViewModel / Store provides state to component (`observes`) |
| **Component** | **Service** | Component delegates user actions to ViewModel/Store (`uses`) |
| **Component** | **Module** | Component belongs to feature module (`belongsTo`) |
| **Function** | **Component** | Helper function used in component (`helper`) |
| **Type** | **Type** | Struct implements Trait / interface inheritance (`implements`) |
| **Type** | **Service / Component / Function** | Data contract / DTO definition (`defines`) |
| **Type** | **Module** | Type declared in crate/module (`declares`) |
| **Function** | **Type** | Method implemented directly on struct/trait (`implements`) |

Direct invalid connections (such as components bypassing state to connect directly to databases, or parent modules driving child implementations) are blocked to maintain architectural Low-Level Design integrity.

---

## File Format & AI Integration

Arch files are stored in human-readable and agent-parsable JSON (v2).

### Schema Structure
```json
{
  "version": 2,
  "name": "auth-system",
  "nodes": [
    {
      "id": "m1",
      "type": "module",
      "label": "Authentication",
      "pos": { "x": 100, "y": 100 },
      "description": "User authentication and session domain",
      "properties": [
        { "id": "p1", "title": "Scope", "description": "Handles login, registration, and JWT issuance" }
      ]
    },
    {
      "id": "s1",
      "type": "service",
      "label": "AuthService",
      "pos": { "x": 420, "y": 100 },
      "description": "Core authentication logic",
      "properties": []
    },
    {
      "id": "f1",
      "type": "function",
      "label": "verifyToken",
      "pos": { "x": 740, "y": 100 },
      "description": "Verifies incoming JWT signature",
      "parameters": [
        { "id": "param1", "name": "token", "type": "string", "description": "Bearer JWT token" }
      ],
      "returns": [
        { "id": "ret1", "name": "payload", "type": "TokenPayload", "description": "Decoded user claims" }
      ],
      "properties": []
    },
    {
      "id": "e1",
      "type": "external",
      "label": "PostgreSQL",
      "pos": { "x": 420, "y": 360 },
      "description": "Primary user store",
      "tech": "postgres",
      "properties": []
    }
  ],
  "edges": [
    { "id": "e1", "from": "s1", "to": "m1", "type": "injects" },
    { "id": "e2", "from": "f1", "to": "s1", "type": "implements" },
    { "id": "e3", "from": "e1", "to": "s1", "type": "injects" }
  ]
}
```

---

## Development

```bash
# Install dependencies
bun install

# Build extension and webview bundle
bun run compile

# Run automated schema and layout tests
bun run test

# Package VSIX for installation or marketplace publishing
bun run package
```