# Arch Design - Visual Architecture Canvas

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/AnujAnthwal.arch-for-LLD-design?color=blue&label=VS%20Code%20Marketplace)](https://marketplace.visualstudio.com/items?itemName=AnujAnthwal.arch-for-LLD-design)
[![Website Live Demo](https://img.shields.io/badge/Website-Live%20Demo-38bdf8?style=flat&logo=googlechrome&logoColor=white)](https://anujanthwal.github.io/agent-arch/)
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

---

## Architectural Rules

Arch enforces clean separation of concerns:

| Source | Target | Relationship |
| :--- | :--- | :--- |
| **Module** | **Service** | Module encapsulates service |
| **Service** | **Function** | Service contains function |
| **Service** | **External** | Service connects to external dependency |
| **Module** | **External** | Module depends on external dependency |

Direct invalid connections (such as functions directly calling modules or externals driving services) are blocked to maintain architectural integrity.

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
    { "id": "e1", "from": "m1", "to": "s1", "type": "contains" },
    { "id": "e2", "from": "s1", "to": "f1", "type": "contains" },
    { "id": "e3", "from": "s1", "to": "e1", "type": "uses" }
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