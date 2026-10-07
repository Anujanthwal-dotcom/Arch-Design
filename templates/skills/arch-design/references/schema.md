# Arch Design (.arch) JSON Schema Specification (v2)

Arch Design files (`.arch` or `.lld`) are stored in structured JSON (version 2). This document serves as the formal specification for AI coding agents reading or authoring architecture canvas files.

---

## 1. Root Document Structure

```json
{
  "version": 2,
  "name": "system-name",
  "nodes": [ /* array of Node objects */ ],
  "edges": [ /* array of Edge objects */ ]
}
```

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `version` | `number` | **Yes** | Schema version. Must be strictly `2`. |
| `name` | `string` | No | Identifier for the architecture canvas (e.g. `"payment-service"`). |
| `nodes` | `Array<Node>` | **Yes** | List of architectural card nodes. |
| `edges` | `Array<Edge>` | **Yes** | List of directional connection edges between nodes. |

---

## 2. Node Schema

Every node in `nodes` shares common fields and includes type-specific extensions.

### Common Node Fields
```typescript
{
  id: string;              // Unique identifier (e.g., "m1", "s1", "f1", "e1")
  type: "module" | "service" | "function" | "external";
  label: string;           // Display title of the card
  pos: { x: number; y: number }; // Canvas pixel position
  description?: string;    // Brief summary of responsibility
  properties?: Array<{
    id: string;
    title: string;
    description: string;
  }>;
  isCollapsed?: boolean;   // Optional fold state
}
```

---

### Node Types

#### 1. Module (`type: "module"`)
Represents a high-level domain boundary, package, or microservice scope.
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

#### 2. Service (`type: "service"`)
Represents a business logic service, class controller, or handler within a module.
```json
{
  "id": "s1",
  "type": "service",
  "label": "AuthService",
  "pos": { "x": 370, "y": 60 },
  "description": "Core authentication logic and password hashing",
  "typeRef": "services/AuthService",
  "properties": [
    { "id": "p1", "title": "Dependencies", "description": "UserStore, CryptoEngine" }
  ]
}
```
* Note: `typeRef` denotes the source code file path or interface name.

#### 3. Function (`type: "function"`)
Represents an individual method, routine, or endpoint with typed parameters and return values.
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

#### 4. External (`type: "external"`)
Represents third-party infrastructure, databases, caches, message brokers, or external APIs.
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
- `"postgres"` or `"postgresql"` (Relational DB)
- `"mysql"` (Relational DB)
- `"redis"` (In-memory Cache / Key-Value)
- `"mongodb"` (Document Store)
- `"kafka"` (Event Streaming)
- `"rabbitmq"` (Message Queue)
- `"s3"` or `"minio"` (Object Storage)

---

## 3. Edge Schema

Edges represent directional dependency injection relationships between cards, pointing from child / dependency to parent / consumer.

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
| `from` | `string` | Source node `id` (Child / Dependency). |
| `to` | `string` | Target node `id` (Parent / Consumer). |
| `type` | `string` | Relationship type: `"injects"` (service/external dependency injection) or `"implements"` (function implementation). |
