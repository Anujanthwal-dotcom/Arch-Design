# Arch Design - Visual Architecture Canvas

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/AnujAnthwal.arch-for-LLD-design?color=blue&label=VS%20Code%20Marketplace)](https://marketplace.visualstudio.com/items?itemName=AnujAnthwal.arch-for-LLD-design)
[![Website Live Demo](https://img.shields.io/badge/Website-Live%20Demo-38bdf8?style=flat&logo=googlechrome&logoColor=white)](https://anujanthwal-dotcom.github.io/Arch-Design/)
[![Docs & CLI Reference](https://img.shields.io/badge/Docs-Agent%20Skills%20%26%20CLI-8b5cf6?style=flat&logo=gitbook&logoColor=white)](https://anujanthwal-dotcom.github.io/Arch-Design/#docs)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

Arch Design is an interactive visual architecture canvas for Visual Studio Code. It allows software architects, engineers, and AI coding agents to map, design, and inspect modules, services, functions, and external infrastructure dependencies.

The `.arch` file format is saved as structured JSON, making it intuitive for humans to design visually and seamless for AI coding agents to implement faithfully.

---

## Features

- **Interactive Canvas**: Pan, zoom, drag cards, view a minimap, and auto-arrange nodes with Dagre layout.
- **Card-Based Architectural Hierarchy**:
  - **Module**: High-level logical domain or boundary.
  - **Service**: Service class, component, or controller within a module.
  - **Function**: Methods and routines specifying input parameters, return values, and data types.
  - **External**: Third-party services, databases, queues, and caches.
- **Focus Mode**: Select any card to highlight its upstream and downstream connections with animated directional flow lines while dimming unrelated cards.
- **Architecture Validation Rules**: Built-in connection rules prevent invalid relationships and keep system designs clean and hierarchical.
- **Adaptive Card Fields**: Multi-line descriptions, properties, parameters, and return fields expand dynamically to fit their text without awkward internal scrollbars.
- **Visual Tech Badges**: Built-in support and logos for popular external technologies like PostgreSQL, Redis, MongoDB, MySQL, Kafka, S3, RabbitMQ, and more.
- **AI Agent Readable**: Standardized JSON schema that coding agents can parse directly to generate boilerplate, scaffolding, and full implementations.

---

## Getting Started

### 1. Create a New Architecture File
- Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`).
- Select **Arch: New Architecture File**.
- Choose a location and save as `architecture.arch`.

Alternatively, create any file ending with `.arch` in your workspace and click to open it.

### 2. Navigating the Canvas
- **Add Nodes**: Use the top toolbar to insert Modules, Services, Functions, or External services.
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

#### Prompt Recipes for Coding Agents

- **Generate Code from a Diagram:**
  > *"Inspect our architecture in `architecture.arch`. Implement the service and functions specified in the canvas, strictly respecting parameter types, return signatures, and external database connections."*

- **Create a Diagram for a New Feature:**
  > *"Use the Arch Design skill to create a visual architecture diagram `user-auth.arch` for our user authentication service. Include a UserModule, AuthService, verifyToken function, and PostgreSQL external store. Run layout.js and validate.js when finished."*

- **Audit Codebase for Architecture Compliance:**
  > *"Compare our implementation in `src/` against `architecture.arch`. Identify any services calling unauthorized databases or functions bypassing domain boundaries according to our Low-Level Design rules."*

For complete guides and interactive examples, check out the [Documentation & CLI Reference](https://anujanthwal-dotcom.github.io/Arch-Design/#docs).

---

## Architectural Rules

Arch enforces clean separation of concerns:

| Source | Target | Relationship |
| :--- | :--- | :--- |
| **Service** | **Module** | Service is injected into module (`injects`) |
| **Function** | **Service** | Function implements / provides method to service (`implements`) |
| **External** | **Service** | External dependency is injected into service (`injects`) |
| **External** | **Module** | External dependency is injected into module (`injects`) |
| **Service** | **Service** | Dependency service is injected into consumer service (`injects`) |

Direct invalid connections (such as functions directly calling modules or parent modules driving children) are blocked to maintain architectural Low-Level Design integrity.

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
npm install

# Build extension and webview bundle
npm run compile

# Run automated schema and layout tests
npm test

# Package VSIX for installation or marketplace publishing
npm run package
```