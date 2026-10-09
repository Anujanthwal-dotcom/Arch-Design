<div align="center">

# 🏛️ Arch Design — Visual Architecture Canvas for VS Code

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/AnujAnthwal.arch-for-LLD-design?color=38bdf8&label=VS%20Code%20Marketplace&logo=visualstudiocode&logoColor=white)](https://marketplace.visualstudio.com/items?itemName=AnujAnthwal.arch-for-LLD-design)
[![Website Live Demo](https://img.shields.io/badge/Web_Canvas-Live_Demo-0ea5e9?style=flat&logo=googlechrome&logoColor=white)](https://anujanthwal-dotcom.github.io/Arch-Design/)
[![Docs & CLI Reference](https://img.shields.io/badge/Docs-Agent_Skills_%26_CLI-8b5cf6?style=flat&logo=gitbook&logoColor=white)](https://anujanthwal-dotcom.github.io/Arch-Design/#docs)
[![License: MIT](https://img.shields.io/badge/License-MIT-10b981.svg)](https://opensource.org/licenses/MIT)
[![Support Author](https://img.shields.io/badge/Buy_Me_a_Coffee-FFDD00?style=flat&logo=buymeacoffee&logoColor=black)](https://buymeacoffee.com/anuj_anthwal)

**The interactive visual canvas for mapping Low-Level Design (LLD), system boundaries, and code dependencies — built for engineers and modern AI coding agents.**

[🌐 Try Interactive Web Demo](https://anujanthwal-dotcom.github.io/Arch-Design/) • [📦 VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=AnujAnthwal.arch-for-LLD-design) • [🤖 Agent Skill Guide](#-ai-agent-integration--skills)

</div>

---

## 💡 Overview

**Arch Design** brings interactive architectural modeling directly inside Visual Studio Code. It provides a visual canvas for mapping modules, UI screens, business services, data contracts, and external infrastructure dependencies for `.arch` and `.lld` files.

Every diagram is saved as clean, version-controllable JSON (v2.1). This creates a **single source of truth** that humans can visually design and inspect, and AI coding agents (Google Antigravity, Claude Code, Cursor, Windsurf, OpenCode, Aider) can parse, validate, and faithfully implement into real code.

> [!TIP]
> **Try without installing**: Test the interactive canvas directly in your browser at [anujanthwal-dotcom.github.io/Arch-Design/](https://anujanthwal-dotcom.github.io/Arch-Design/).

---

## ⚡ Key Highlights

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ARCH DESIGN ECOSYSTEM                           │
│                                                                        │
│   👨‍💻 Human Architect                  🤖 AI Coding Agents              │
│   Visual Canvas • Drag & Drop         Reads JSON • Implements Code      │
│   Focus Mode • 1-Click Code Jump       Validates Rules • Auto-Layout     │
│             │                                     │                    │
│             ▼                                     ▼                    │
│   ┌──────────────────────────────────────────────────────────────┐     │
│   │               architecture.arch (JSON v2.1)                  │     │
│   │     6 Architectural Tiers • Strict Connection Rules          │     │
│   └──────────────────────────────────────────────────────────────┘     │
│                                 │                                      │
│                                 ▼                                      │
│   ┌──────────────────────────────────────────────────────────────┐     │
│   │                 Workspace Source Code Files                  │     │
│   │       src/auth/service.ts  •  src/components/Login.tsx       │     │
│   └──────────────────────────────────────────────────────────────┘     │
└────────────────────────────────────────────────────────────────────────┘
```

- 🎯 **14 Domain & Framework Presets**: Instant scaffolding for Next.js, React SPA, Nuxt/Vue, NestJS, Spring Boot, FastAPI, Android Jetpack Compose, iOS SwiftUI, Flutter, Rust/Tokio, Go Clean Architecture, and Hexagonal Clean Architecture.
- 🔗 **1-Click Code Jump (Beside Split)**: Attach source file paths (`filePath`) to any card. Click to instantly open the source file in a side-by-side split editor — or auto-create it if it doesn't exist yet!
- 🛡️ **6 Universal Architectural Tiers & Validation**: Enforces clean Low-Level Design boundaries (`container`, `presentation`, `logic`, `contract`, `execution`, `infrastructure`) and blocks architectural anti-patterns like UI components querying databases directly.
- 🔍 **Focus Mode & Dependency Tracing**: Click or hover any card to spotlight its upstream and downstream connection flow while dimming canvas clutter.
- 🤖 **Native Agent Skill**: Includes automated setup for Google Antigravity, Claude Code, Cursor, and Windsurf, complete with CLI validation and Dagre layout scripts.
- 📐 **Dagre Hierarchical Auto-Layout**: One-click automatic organization (`Auto Layout`) with intelligent collision detection on drag.
- 🎨 **Visual Tech Badges**: Native vector logos and brand colors for PostgreSQL, Redis, MongoDB, Kafka, RabbitMQ, S3, MinIO, MySQL, SQLite, Room, SwiftData, ClickHouse, GraphQL, REST, WebSockets, and Tokio.
- 🗂️ **Default Collapsed Clean View**: Cards render collapsed by default to keep high-level architectures tidy, with one-click chevron expansion for deep property inspection.

---

## 🚀 Features Deep Dive

### 1. 🧭 Cascading Framework & Domain Presets
Switch architectural contexts anytime from the toolbar selector featuring categorized groups and quick search:

| Category | Presets | Archetypes Included |
| :--- | :--- | :--- |
| **Web & Frontend** | **Next.js** (App Router)<br>**React SPA** (Vite / CRA)<br>**Nuxt 3 / Vue** | `Page/Layout`, `Component (RSC/Client)`, `Store/Hook`, `Server Action`, `Schema (Zod)`, `View/Route`, `Pinia Store`, `Composable`, `Nitro Route` |
| **Backend & APIs** | **NestJS**<br>**Spring Boot**<br>**FastAPI (Python)**<br>**Modular Backend** | `Nest Module`, `RestController`, `Service/Provider`, `Guard/Interceptor`, `JPA Repository`, `Entity`, `APIRouter`, `Pydantic Model`, `Controller`, `DTO` |
| **Mobile Apps** | **Android (Compose)**<br>**iOS (SwiftUI)**<br>**Flutter (BLoC/Riverpod)** | `Screen Composable`, `StateFlow ViewModel`, `UseCase`, `Repository`, `Room DAO`, `SwiftUI View`, `Observable ViewModel`, `Coordinator`, `SwiftData Model`, `Widget` |
| **Systems & Runtime** | **Rust (Tokio Systems)**<br>**Go (Clean Architecture)** | `Crate/Mod`, `Struct`, `Trait`, `Enum`, `Tokio/FFI Driver`, `Go Package`, `HTTP Handler`, `Usecase`, `Repository`, `SQL Driver` |
| **Patterns & General** | **Clean / Hexagonal Arch**<br>**Universal Standard** | `Domain Entity`, `UseCase/Interactor`, `Controller/Adapter`, `Port/Gateway`, `Presenter/UI`, `Module`, `Component`, `Service`, `Type`, `Function`, `External` |

> [!NOTE]
> Need custom entities like `Actor`, `Signal`, `Pipeline`, or `EventBus`? Click **+ Custom Card...** in the toolbar to create arbitrary cards bound to any architectural tier.

---

### 2. 🗂️ 1-Click Code Navigation (Card-to-File Beside Split)
Every card can be linked directly to its implementation file via the `filePath` property:

- **Quick Jump**: Click the file chip or header icon to open the target file in a side-by-side split editor (`ViewColumn.Beside`).
- **Scaffold on Demand**: If the referenced file doesn't exist yet, Arch Design prompts you to auto-create it with standard header scaffolding.
- **Editable Path**: Click the pencil icon to update or clear the target file path at any time.

---

### 3. 🎯 Focus Mode & Dependency Tracing
Tackle complex architectures with hundreds of connections without feeling overwhelmed:

- **Hover or Select**: Instantly highlights the complete dependency tree for the active card.
- **Directional Glow**: 
  - 🟢 **Incoming Dependencies**: Highlighted in vibrant green with incoming counts.
  - 🔵 **Outgoing Injections**: Highlighted in bright blue with animated directional dash lines.
- **Context Dimming**: Unrelated cards and connections fade to low opacity, letting you trace specific execution paths without distraction.
- **Bottom Status Panel**: Displays live incoming/outgoing injection counts or canvas card and connection summaries.

---

### 4. 🛡️ Architectural Tiers & Validation Rules

Arch Design abstracts architectures into **6 Universal Tiers** to enforce clean separation of concerns:

```
┌────────────────────────────────────────────────────────┐
│  CONTAINER      (Module, Crate, Package)               │
│      ▲                                                 │
│      │                                                 │
│  PRESENTATION   (Screen, View, Component, Page)       │
│      │ ▲                                               │
│ uses │ │ observes                                      │
│      ▼ │                                               │
│  LOGIC          (Service, ViewModel, Store, UseCase)   │
│      ▲                                                 │
│      │ injects                                         │
│  INFRASTRUCTURE (Database, Queue, Driver, Tokio, API)  │
│                                                        │
│  CONTRACT       (Type, Struct, Trait, Schema, DTO)     │
│  EXECUTION      (Function, Action, Endpoint, Method)   │
└────────────────────────────────────────────────────────┘
```

#### Connection Matrix

| Source Tier | Target Tier | Inferred Relationship | Status | Real-World Architectural Rationale |
| :--- | :--- | :--- | :---: | :--- |
| **`presentation`** | **`presentation`** | `renders` | ✅ **Allowed** | UI component composition, screen navigation, modal embedding |
| **`logic`** | **`presentation`** | `observes` | ✅ **Allowed** | Reactive state emitted by Store / ViewModel to Screen |
| **`presentation`** | **`logic`** | `uses` | ✅ **Allowed** | UI dispatches user intents to ViewModel / UseCase |
| **`logic`** | **`logic`** | `injects` / `uses` | ✅ **Allowed** | Layered domain delegation (ViewModel $\rightarrow$ UseCase $\rightarrow$ Repository) |
| **`execution`** | **`logic`** | `implements` | ✅ **Allowed** | Server action or routine implements business logic |
| **`execution`** | **`presentation`** | `helper` | ✅ **Allowed** | UI formatting helper or event callback |
| **`execution`** | **`contract`** | `implements` | ✅ **Allowed** | Routine implemented on Struct/Trait (`impl Trait for Struct`) |
| **`contract`** | **`contract`** | `implements` | ✅ **Allowed** | Struct implements Trait, Interface inheritance |
| **`contract`** | **`logic` / `presentation`** | `defines` | ✅ **Allowed** | DTO contract or UI Props schema definition |
| **`infrastructure`** | **`logic`** | `injects` | ✅ **Allowed** | DB, Cache, or Network injected into Repository or Service |
| **`infrastructure`** | **`container`** | `injects` | ✅ **Allowed** | OS driver, Hardware, or Cloud boundary injected into package |
| **Any Tier** | **`container`** | `belongsTo` / `declares` | ✅ **Allowed** | Structural grouping into feature module, package, or crate |
| **`infrastructure`** | **`presentation`** | — | ❌ **Blocked** | UI components must never query raw databases directly |
| **`presentation`** | **`infrastructure`** | — | ❌ **Blocked** | Direct coupling from UI to infrastructure is an antipattern |
| **`infrastructure`** | **`infrastructure`** | — | ❌ **Blocked** | External infrastructure nodes do not directly inject into each other |
| **`container`** | **Child Tier** | — | ❌ **Blocked** | Containers do not point downwards into children |

---

### 5. 🏷️ Visual Tech Badges
External infrastructure cards automatically render authentic vector logos and brand colors:

- **Databases**: PostgreSQL, MySQL, MongoDB, SQLite, ClickHouse
- **Caches & Storage**: Redis, AWS S3, MinIO
- **Queues & Streaming**: Apache Kafka, RabbitMQ, WebSockets
- **Protocols & APIs**: GraphQL, REST API
- **Mobile Storage**: Room, SwiftData, CoreData, Realm
- **Systems & Runtimes**: Tokio (Async Runtime), Hardware/Drivers, FFI

---

## 🤖 AI Agent Integration & Skills

Arch Design includes a built-in **Agent Skill** specification so coding assistants can autonomously read, edit, lay out, and validate architecture files.

### 1. Install the Skill
Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) and run:
```
Arch: Install Agent Skill
```
Choose your scope:
- **Workspace Scope (`.agents/skills/arch-design/` & `AGENTS.md`)**: Configures the project for the entire team and workspace agents.
- **Global User Profile (`~/.gemini/config/skills/arch-design/`)**: Available globally across all projects on your machine.

### 2. Multi-Agent Compatibility Matrix

| Coding Assistant | Configured Files | Capability |
| :--- | :--- | :--- |
| **Google Antigravity** | Scans `.agents/skills/arch-design/` | Native skill execution & auto-tooling |
| **Claude Code** | Root `AGENTS.md` and `CLAUDE.md` | Reads schema, architecture rules, CLI tools |
| **Cursor (Composer)** | `.cursor/rules/arch-design.mdc` & `AGENTS.md` | Project rule context injection |
| **Windsurf (Cascade)** | Root `AGENTS.md` & rule files | Automatic workflow guidance |
| **OpenCode / Aider** | Root `AGENTS.md` | Standard prompt instructions |

### 3. Bundled Agent CLI Tools
AI agents and CI pipelines can run deterministic scripts without guessing math or syntax:

```bash
# 1. Validate schema integrity & tier rules
node .agents/skills/arch-design/scripts/validate.js architecture.arch

# 2. Automatically compute visual Dagre layout coordinates
node .agents/skills/arch-design/scripts/layout.js architecture.arch
```

### 4. Example AI Agent Prompts

````markdown
<!-- Design from scratch -->
"Create an architecture diagram for an e-commerce checkout flow in architecture.arch using the nextjs preset. Include a CheckoutScreen, CartStore, StripeService, and Postgres DB. Run the layout script when finished."

<!-- Audit existing architecture -->
"Inspect architecture.arch, check it against our project source files in src/, and update the filePath fields on all service and repository cards."

<!-- Implement code from canvas -->
"Read architecture.arch, find all cards in the AuthService domain, and generate the TypeScript implementations for each linked filePath."
````

---

## 📄 File Format Specification (v2.1)

Arch Design diagrams (`.arch` or `.lld`) are stored as clean JSON:

```json
{
  "version": 2,
  "domain": "backend",
  "framework": "nestjs",
  "name": "auth-system",
  "nodes": [
    {
      "id": "m1",
      "type": "module",
      "tier": "container",
      "label": "AuthModule",
      "pos": { "x": 100, "y": 100 },
      "filePath": "src/auth/auth.module.ts",
      "description": "User authentication domain boundary"
    },
    {
      "id": "s1",
      "type": "service",
      "tier": "logic",
      "label": "AuthService",
      "pos": { "x": 460, "y": 100 },
      "filePath": "src/auth/auth.service.ts",
      "description": "Validates credentials and issues signed JWT tokens",
      "properties": [
        { "id": "p1", "title": "Dependencies", "description": "JwtService, UserRepository" }
      ]
    },
    {
      "id": "f1",
      "type": "function",
      "tier": "execution",
      "label": "loginWithOAuth",
      "pos": { "x": 820, "y": 100 },
      "description": "Exchanges provider code for session token",
      "parameters": [
        { "id": "param1", "name": "code", "type": "string", "required": true, "description": "OAuth authorization code" }
      ],
      "returns": [
        { "id": "ret1", "name": "token", "type": "AuthResponse", "required": true, "description": "JWT bearer payload" }
      ]
    },
    {
      "id": "e1",
      "type": "external",
      "tier": "infrastructure",
      "label": "PostgreSQL",
      "pos": { "x": 460, "y": 380 },
      "tech": "postgres",
      "description": "Primary user database"
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

## 🛠️ Getting Started

### 1. Create a Diagram
1. Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`).
2. Run **Arch: New Architecture File**.
3. Choose a destination file (e.g. `architecture.arch`).

*Or simply create any file ending with `.arch` or `.lld` in your workspace and click to open it.*

### 2. Canvas Controls & Shortcuts
- **Add Cards**: Select a framework preset from the dropdown and click any card button (e.g. `+ Service`, `+ Screen`).
- **Connect**: Click and drag from the handle at the bottom/top of any card to another card.
- **Focus Tree**: Hover or click a card to isolate its upstream and downstream flow.
- **Auto Layout**: Click **Auto Layout** in the toolbar to auto-organize all cards hierarchically.
- **Jump to Code**: Click any card's file chip to open the implementation file beside your canvas.
- **Expand / Collapse**: Toggle the chevron on any card to switch between compact and detailed views.
- **Pan & Zoom**: Scroll wheel or drag the canvas surface. Minimap and zoom controls are available at the bottom left.

---

## 💻 Development & Building

Built with TypeScript, React 18, React Flow (`@xyflow/react`), Dagre, and Bun.

```bash
# 1. Install dependencies
bun install

# 2. Build extension and webview bundle
bun run compile

# 3. Watch for changes during development
bun run watch

# 4. Run automated test suite
bun run test

# 5. Package VSIX extension
bun run package
```

---

## 🤝 Community & Support

- 🌐 **Live Web Demo**: [https://anujanthwal-dotcom.github.io/Arch-Design/](https://anujanthwal-dotcom.github.io/Arch-Design/)
- 📖 **Documentation & Agent Skill Reference**: [Web Docs](https://anujanthwal-dotcom.github.io/Arch-Design/#docs)
- 🐛 **Issue Tracker**: [GitHub Issues](https://github.com/Anujanthwal-dotcom/Arch-Design/issues)
- ☕ **Support the Project**: [Buy Me a Coffee](https://buymeacoffee.com/anuj_anthwal)

---

<div align="center">
  <sub>Released under the <a href="./LICENSE">MIT License</a>. Designed & maintained with care by <a href="https://github.com/Anujanthwal-dotcom">Anuj Anthwal</a>.</sub>
</div>