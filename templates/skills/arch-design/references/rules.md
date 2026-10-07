# Arch Design Architectural Connection Rules

Arch Design enforces clean separation of concerns and hierarchical Low-Level Design (LLD) integrity. AI coding agents must obey these connection rules when authoring or mutating `.arch` diagrams.

---

## 1. Connection Matrix

| Source Node | Target Node | Edge Type | Status | Rationale |
| :--- | :--- | :--- | :--- | :--- |
| **Service** | **Module** | `injects` | ✅ **Allowed** | Service is injected into parent module boundary |
| **Function** | **Service** | `implements` | ✅ **Allowed** | Function implements / provides method to parent service |
| **External** | **Service** | `injects` | ✅ **Allowed** | External database, cache, or queue is injected into service |
| **External** | **Module** | `injects` | ✅ **Allowed** | External infrastructure dependency is injected into module |
| **Service** | **Service** | `injects` | ✅ **Allowed** | Dependency service is injected into consumer service |
| **Module** | **Service** | - | ❌ **Blocked** | Modules encapsulate services; edges point from child to parent |
| **Service** | **Function** | - | ❌ **Blocked** | Edges point from child (implementer) to parent (service) |
| **Service** | **External** | - | ❌ **Blocked** | Edges point from external dependency to consuming service |
| **Module** | **External** | - | ❌ **Blocked** | Edges point from external dependency to consuming module |
| **Function** | **Module** | - | ❌ **Blocked** | Functions belong to services and cannot directly inject into modules |
| **Function** | **External** | - | ❌ **Blocked** | Low-level functions should not bypass service abstractions |
| **External** | **External** | - | ❌ **Blocked** | External resources do not directly inject into each other |
| **Any** | **Same Node** | - | ❌ **Blocked** | Self-loops are strictly prohibited |
| **Duplicate** | **Duplicate** | - | ❌ **Blocked** | Only one edge allowed per source-target pair |

---

## 2. Low-Level Design Principles for Agents

1. **Child-to-Parent Injection Direction**:
   - `Function` $\rightarrow$ `Service` $\rightarrow$ `Module`.
   - `External` $\rightarrow$ `Service` / `Module`.
   - Arrowheads point to the parent/consumer receiving the injected dependency.
2. **Explicit Type Contracts**:
   - Function cards must specify `parameters` (with names and concrete data types like `string`, `number`, `UserDTO`) and `returns` (e.g. `Promise<AuthResult>`).
3. **No Phantom Nodes**:
   - Every edge's `from` and `to` IDs must exist in the document's `nodes` array.
4. **Clean IDs**:
   - Prefix node IDs by type for clarity: `m1`, `m2` (Module), `s1`, `s2` (Service), `f1`, `f2` (Function), `e1`, `e2` (External).
