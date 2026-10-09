# Arch Design Architecture & Agent Guidelines for Claude Code

This repository uses **Arch Design** (`.arch` / `.lld`) visual architecture files to visually map system architectures across Backend, Frontend, Mobile, and Systems Programming.

## Working with Architecture Files (.arch / .lld)

Whenever reading, creating, modifying, or refactoring architecture diagrams:

1. **Detailed Skill & Schema Reference**:
   - Agent Skill: [`.agents/skills/arch-design/SKILL.md`](./.agents/skills/arch-design/SKILL.md)
   - Schema Specification: [`.agents/skills/arch-design/references/schema.md`](./.agents/skills/arch-design/references/schema.md)
   - Architectural Rules: [`.agents/skills/arch-design/references/rules.md`](./.agents/skills/arch-design/references/rules.md)

2. **Automated Validation**:
   Always validate any changes to `.arch` files before concluding:
   ```bash
   node .agents/skills/arch-design/scripts/validate.js <path-to-file.arch>
   ```

3. **Auto-Layout Node Coordinates**:
   Automatically position nodes using Dagre hierarchical placement without guessing coordinates:
   ```bash
   node .agents/skills/arch-design/scripts/layout.js <path-to-file.arch>
   ```

4. **Always Link Code**:
   Specify `filePath` on cards (e.g. `"src/services/AuthService.ts"`) so users can click cards to open files in split view.


## Architectural Separation of Concerns
- **Tiers**: `container` (modules), `presentation` (UI components/screens), `logic` (services/viewmodels/stores), `contract` (types/structs/traits), `execution` (functions/actions), `infrastructure` (databases/APIs).
- **Enforced Rules**:
  - Direct connection between `presentation` and `infrastructure` is strictly prohibited (route through `logic`).
  - Infrastructure cannot directly inject into other infrastructure.
  - No self-loops or duplicate edges.
