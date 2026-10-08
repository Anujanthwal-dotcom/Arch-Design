# Arch Design Architectural Connection Rules

Arch Design enforces clean separation of concerns and architectural integrity across **Backend**, **Frontend**, **Mobile**, and **Systems Programming (Rust)**. AI coding agents must obey these connection rules when authoring or mutating `.arch` diagrams.

---

## 1. Universal Tier Connection Matrix

Arch Design abstracts architectures into 6 universal tiers (`container`, `presentation`, `logic`, `contract`, `execution`, `infrastructure`). Connection validity is evaluated based on tiers:

| Source Tier | Target Tier | Edge Type | Status | Real-World Domain Rationale |
| :--- | :--- | :--- | :---: | :--- |
| **`presentation`** | **`presentation`** | `renders` | ✅ **Allowed** | UI nesting, layout composition, screen navigation |
| **`logic`** | **`presentation`** | `observes` | ✅ **Allowed** | ViewModel / Store / Hook emits state observed by Screen/Component |
| **`presentation`** | **`logic`** | `uses` | ✅ **Allowed** | UI dispatches user actions/events to ViewModel, Store, or UseCase |
| **`logic`** | **`logic`** | `uses` / `injects` | ✅ **Allowed** | Clean layered delegation: ViewModel $\rightarrow$ UseCase $\rightarrow$ Repository |
| **`execution`** | **`logic`** | `implements` | ✅ **Allowed** | Server action or method implements business logic |
| **`execution`** | **`presentation`** | `helper` | ✅ **Allowed** | UI formatting helper or event callback |
| **`execution`** | **`contract`** | `implements` | ✅ **Allowed** | Method implemented directly on Struct or Trait (Rust `impl Trait for Struct`) |
| **`contract`** | **`contract`** | `implements` | ✅ **Allowed** | Struct implements Trait, Interface inheritance |
| **`contract`** | **`logic` / `presentation` / `execution`** | `defines` | ✅ **Allowed** | DTO, entity schema, or props contract definition |
| **`infrastructure`** | **`logic`** | `injects` | ✅ **Allowed** | Database, API, Storage, or OS runtime injected into Repository/Service |
| **`infrastructure`** | **`container`** | `injects` | ✅ **Allowed** | Driver, OS kernel, or Cloud boundary injected into crate/module |
| **Any Tier** | **`container`** | `belongsTo` / `declares` / `submodule` | ✅ **Allowed** | Structural containment into Feature Module, Crate, or Package |
| **`infrastructure`** | **`presentation`** | - | ❌ **Blocked** | UI components must not bypass ViewModel/State to directly query DBs |
| **`presentation`** | **`infrastructure`** | - | ❌ **Blocked** | Direct coupling from UI to infrastructure is an architectural anti-pattern |
| **`infrastructure`** | **`infrastructure`** | - | ❌ **Blocked** | External resources do not directly inject into each other |
| **`container`** | **Non-Container** | - | ❌ **Blocked** | Containers do not point downwards into children; children belong to containers |
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
