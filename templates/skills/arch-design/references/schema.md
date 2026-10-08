# Arch Design (.arch) JSON Schema Specification (v2.1)

Arch Design files (`.arch` or `.lld`) are stored in structured JSON (version 2). This document serves as the formal specification for AI coding agents and developers authoring or reading architecture canvas files across multiple domains (**Backend**, **Frontend**, **Mobile**, and **Systems Programming**).

---

## 1. Root Document Structure

```json
{
  "version": 2,
  "domain": "universal",
  "name": "system-name",
  "nodes": [ /* array of Node objects */ ],
  "edges": [ /* array of Edge objects */ ]
}
```

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `version` | `number` | **Yes** | Schema version. Must be strictly `2`. |
| `domain` | `string` | No | Architectural profile domain: `"universal"`, `"backend"`, `"frontend"`, `"mobile"`, or `"systems"`. |
| `framework` | `string` | No | Framework or pattern preset ID: `"nextjs"`, `"react"`, `"vue-nuxt"`, `"nestjs"`, `"springboot"`, `"fastapi"`, `"backend"`, `"android"`, `"ios"`, `"flutter"`, `"systems"`, `"go-clean"`, `"clean-arch"`, `"universal"`. |
| `name` | `string` | No | Identifier for the architecture canvas (e.g. `"ecommerce-web"`, `"notes-mobile"`). |
| `nodes` | `Array<Node>` | **Yes** | List of architectural card nodes. |
| `edges` | `Array<Edge>` | **Yes** | List of directional connection edges between nodes. |

---

## 2. Node Schema

Every node in `nodes` shares common fields and belongs to one of 6 universal **Architecture Tiers** (`container`, `presentation`, `logic`, `contract`, `execution`, `infrastructure`). Arch Design supports both the standard card types as well as domain archetypes (`screen`, `viewmodel`, `usecase`, `repository`, `dao`, `trait`, `struct`, `store`, `hook`, `action`, etc.) and arbitrary custom cards.

### Common Node Fields
```typescript
{
  id: string;              // Unique identifier (e.g., "m1", "c1", "s1", "t1", "f1", "e1")
  type: string;            // Standard type or domain archetype (e.g. "module", "service", "screen", "viewmodel", "struct", "trait")
  tier?: "container" | "presentation" | "logic" | "contract" | "execution" | "infrastructure"; // Architectural tier (inferred if omitted)
  label: string;           // Display title of the card
  pos: { x: number; y: number }; // Canvas pixel position
  description?: string;    // Brief summary of responsibility
  subType?: string;        // Domain-specific subtype or role (e.g. "composable", "stateflow", "zustand")
  tech?: string;           // Technology icon badge for infrastructure (e.g. "room", "swiftdata", "tokio")
  properties?: Array<{
    id: string;
    title: string;
    description: string;
  }>;
  isCollapsed?: boolean;   // Optional fold state
}
```

### Architecture Tiers Mapping
| Tier | Description | Common Types / Archetypes |
| :--- | :--- | :--- |
| **`container`** | Structural packaging & boundaries | `module`, `crate`, `package`, `feature` |
| **`presentation`** | UI views, layouts, and screens | `screen`, `view`, `component`, `page`, `composable`, `widget` |
| **`logic`** | State holders, business orchestrators | `service`, `viewmodel`, `store`, `hook`, `usecase`, `coordinator`, `controller`, `interactor`, `bloc` |
| **`contract`** | Schemas, data models, interfaces | `type`, `struct`, `trait`, `model`, `entity`, `dao`, `schema`, `interface`, `enum` |
| **`execution`** | Methods, endpoints, async actions | `function`, `method`, `endpoint`, `action`, `routine` |
| **`infrastructure`** | Databases, runtimes, hardware, external APIs | `external`, `database`, `api`, `driver`, `hardware`, `runtime` |

---

### Node Types

#### 1. Module (`type: "module"`)
Represents a high-level domain boundary, package, crate, or microservice scope.
```json
{
  "id": "m1",
  "type": "module",
  "label": "Authentication",
  "pos": { "x": 40, "y": 60 },
  "description": "User identity and session verification domain",
  "properties": [
    { "id": "p1", "title": "Scope", "description": "Handles login, signup, and JWT issuance" }
  ]
}
```

#### 2. Component (`type: "component"`)
Represents a UI View, Screen, Widget, or Page in Frontend and Mobile applications.
```json
{
  "id": "c1",
  "type": "component",
  "label": "ProductListScreen",
  "pos": { "x": 40, "y": 60 },
  "subType": "screen",
  "description": "Renders catalog items and handles search filtering",
  "properties": [
    { "id": "p1", "title": "Props", "description": "{ categoryId: string, initialSort?: string }" }
  ]
}
```
* Common `subType` values: `"screen"`, `"view"`, `"page"`, `"component"`, `"widget"`, `"modal"`.

#### 3. Service (`type: "service"`)
Represents a business logic service, class controller, ViewModel, Store, or Repository.
```json
{
  "id": "s1",
  "type": "service",
  "label": "AuthService",
  "pos": { "x": 370, "y": 60 },
  "subType": "service",
  "description": "Core authentication logic and password hashing",
  "typeRef": "services/AuthService",
  "properties": [
    { "id": "p1", "title": "Dependencies", "description": "UserStore, CryptoEngine" }
  ]
}
```
* Note: `typeRef` denotes the source code file path or interface name.
* Common `subType` values: `"service"`, `"viewmodel"`, `"store"`, `"repository"`, `"usecase"`, `"controller"`.

#### 4. Type (`type: "type"`)
Represents a Struct, Trait, Data Model, DTO, Entity, Enum, or Schema interface (key in Rust, Swift, Kotlin, TypeScript).
```json
{
  "id": "t1",
  "type": "type",
  "label": "PacketStream",
  "pos": { "x": 370, "y": 60 },
  "subType": "struct",
  "description": "Zero-copy streaming buffer for framed network packets",
  "properties": [
    { "id": "p1", "title": "Fields", "description": "buffer: BytesMut, socket: TcpStream" }
  ]
}
```
* Common `subType` values: `"struct"`, `"trait"`, `"model"`, `"interface"`, `"enum"`, `"entity"`.

#### 5. Function (`type: "function"`)
Represents an individual method, routine, helper, or endpoint with typed parameters and return values.
```json
{
  "id": "f1",
  "type": "function",
  "label": "verifyToken",
  "pos": { "x": 700, "y": 30 },
  "description": "Validates incoming Bearer JWT claims",
  "parameters": [
    {
      "id": "param1",
      "name": "token",
      "type": "string",
      "required": true,
      "description": "Bearer JWT token from request header"
    }
  ],
  "returns": [
    {
      "id": "ret1",
      "name": "payload",
      "type": "TokenPayload",
      "required": true,
      "description": "Decoded user claims and expiry"
    }
  ]
}
```

#### 6. External (`type: "external"`)
Represents third-party infrastructure, databases, local stores, hardware, async runtimes, or external network APIs.
```json
{
  "id": "e1",
  "type": "external",
  "label": "PostgreSQL",
  "pos": { "x": 700, "y": 230 },
  "tech": "postgres",
  "description": "Primary relational store for user credentials"
}
```

##### Supported `tech` Badge Values:
- **Backend Databases & Queues**: `"postgres"`, `"postgresql"`, `"mysql"`, `"redis"`, `"mongodb"`, `"kafka"`, `"rabbitmq"`, `"s3"`, `"minio"`
- **Mobile & Local Storage**: `"sqlite"`, `"room"`, `"coredata"`, `"swiftdata"`, `"realm"`, `"keychain"`
- **Frontend & Web APIs**: `"rest"`, `"api"`, `"graphql"`, `"websocket"`, `"localstorage"`, `"indexeddb"`
- **Systems & Rust Runtimes**: `"tokio"`, `"libc"`, `"ffi"`, `"wasm"`, `"vulkan"`, `"hardware"`

---

## 3. Edge Schema

Edges represent directional relationships between cards.

```json
{
  "id": "edge-1",
  "from": "s1",
  "to": "m1",
  "type": "injects"
}
```

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique edge ID (e.g. `"edge-s1-m1"`). |
| `from` | `string` | Source node `id`. |
| `to` | `string` | Target node `id`. |
| `type` | `string` | Relationship type: `"injects"`, `"implements"`, `"renders"`, `"observes"`, `"uses"`, `"defines"`, `"submodule"`, `"belongsTo"`, `"declares"`, `"helper"`. |
