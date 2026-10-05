# Arch Design Architectural Connection Rules

Arch Design enforces clean separation of concerns and hierarchical Low-Level Design (LLD) integrity. AI coding agents must obey these connection rules when authoring or mutating `.arch` diagrams.

---

## 1. Connection Matrix

| Source Node | Target Node | Edge Type | Status | Rationale |
| :--- | :--- | :--- | :--- | :--- |
| **Module** | **Service** | `contains` | ✅ **Allowed** | Module encapsulates service boundary |
| **Service** | **Function** | `contains` | ✅ **Allowed** | Service exposes and implements function |
| **Service** | **External** | `uses` | ✅ **Allowed** | Service accesses database, cache, or queue |
| **Module** | **External** | `uses` | ✅ **Allowed** | Module declares boundary dependency on external system |
| **Service** | **Service** | `uses` | ✅ **Allowed** | Service communicates with another internal service |
| **Function** | **Module** | - | ❌ **Blocked** | Functions cannot drive or encapsulate parent domains |
| **Function** | **Service** | - | ❌ **Blocked** | Functions cannot contain parent services |
| **Function** | **External** | - | ❌ **Blocked** | Low-level functions should not bypass service abstractions |
| **External** | **Service** | - | ❌ **Blocked** | Passive databases or queues do not invoke services directly |
| **Any** | **Same Node** | - | ❌ **Blocked** | Self-loops are strictly prohibited |
| **Duplicate** | **Duplicate** | - | ❌ **Blocked** | Only one edge allowed per source-target pair |

---

## 2. Low-Level Design Principles for Agents

1. **Top-Down & Left-to-Right Hierarchy**:
   - `Module` $\rightarrow$ `Service` $\rightarrow$ `Function` / `External`.
2. **Explicit Type Contracts**:
   - Function cards must specify `parameters` (with names and concrete data types like `string`, `number`, `UserDTO`) and `returns` (e.g. `Promise<AuthResult>`).
3. **No Phantom Nodes**:
   - Every edge's `from` and `to` IDs must exist in the document's `nodes` array.
4. **Clean IDs**:
   - Prefix node IDs by type for clarity: `m1`, `m2` (Module), `s1`, `s2` (Service), `f1`, `f2` (Function), `e1`, `e2` (External).
