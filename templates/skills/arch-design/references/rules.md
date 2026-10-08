# Arch Design Architectural Connection Rules

Arch Design enforces clean separation of concerns and architectural integrity across **Backend**, **Frontend**, **Mobile**, and **Systems Programming (Rust)**. AI coding agents must obey these connection rules when authoring or mutating `.arch` diagrams.

---

## 1. Connection Matrix

| Source Node | Target Node | Edge Type | Status | Domain Rationale |
| :--- | :--- | :--- | :---: | :--- |
| **Service** | **Module** | `injects` | ✅ **Allowed** | Service is injected into domain/feature module boundary |
| **Function** | **Service** | `implements` | ✅ **Allowed** | Function implements / provides method to parent service |
| **External** | **Service** | `injects` | ✅ **Allowed** | External database, cache, or API injected into service |
| **External** | **Module** | `injects` | ✅ **Allowed** | External infrastructure / driver dependency injected into module |
| **Service** | **Service** | `injects` | ✅ **Allowed** | Dependency service/repository injected into consumer service |
| **Module** | **Module** | `submodule` | ✅ **Allowed** | Submodule is part of / nested into parent module |
| **Component** | **Component** | `renders` | ✅ **Allowed** | UI component composition: parent renders child |
| **Service** | **Component** | `observes` | ✅ **Allowed** | ViewModel / Store / Hook provides reactive state to Component |
| **Component** | **Service** | `uses` | ✅ **Allowed** | Component dispatches user intents / calls ViewModel or Service |
| **Component** | **Module** | `belongsTo` | ✅ **Allowed** | Screen / View belongs to feature module |
| **Function** | **Component** | `helper` | ✅ **Allowed** | Pure UI helper function or handler used in component |
| **Type** | **Type** | `implements` | ✅ **Allowed** | Struct implements Trait, or Interface inheritance |
| **Type** | **Service** | `defines` | ✅ **Allowed** | Data model / DTO contract used in service |
| **Type** | **Component** | `defines` | ✅ **Allowed** | Props / UI contract used in component |
| **Type** | **Function** | `defines` | ✅ **Allowed** | Model used as function input parameter or return value |
| **Type** | **Module** | `declares` | ✅ **Allowed** | Type declared in module / crate |
| **Function** | **Type** | `implements` | ✅ **Allowed** | Method implemented directly on struct or trait |
| **External** | **Component** | - | ❌ **Blocked** | UI components must not bypass ViewModel/State to directly query DBs |
| **External** | **External** | - | ❌ **Blocked** | External resources do not directly inject into each other |
| **Any** | **Same Node** | - | ❌ **Blocked** | Self-loops are strictly prohibited |
| **Duplicate** | **Duplicate** | - | ❌ **Blocked** | Only one edge allowed per source-target pair |

---

## 2. Low-Level Design Principles for Agents

1. **Clean Separation of Concerns**:
   - **Frontend & Mobile**: UI (`Component`) dispatches intents to `Service` (ViewModel/Store), and `Service` coordinates with `External` (API, Room DB).
   - **Systems (Rust)**: `Module` (Crate/Mod) declares `Type` (Struct/Trait), `Function` implements methods on `Type`, and `External` (Tokio, OS) supplies runtime I/O.
   - **Backend**: `Function` implements `Service`, `External` (DB/Cache) injects into `Service`, and `Service` belongs to `Module`.
2. **Explicit Type Contracts**:
   - Method signatures on `Function` must specify typed `parameters` and `returns`.
   - Data models and contracts should use `Type` cards with fields or trait contracts.
3. **No Phantom Nodes**:
   - Every edge's `from` and `to` IDs must exist in the document's `nodes` array.
4. **Clean IDs**:
   - Prefix node IDs by type: `m1` (Module), `c1` (Component), `s1` (Service), `t1` (Type), `f1` (Function), `e1` (External).
