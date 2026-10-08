# Architecture & Agent Guidelines

This project uses **Arch Design** (`.arch`) files to visually map software architectures across Backend, Frontend, Mobile (Android/iOS), and Systems Programming (Rust) domains.

## Working with Architecture Diagrams (.arch files)

When inspecting, modifying, or creating system architectures:
1. Refer to the **Arch Design Agent Skill**: [`.agents/skills/arch-design/SKILL.md`](./.agents/skills/arch-design/SKILL.md).
2. Schema & Type Reference: [`.agents/skills/arch-design/references/schema.md`](./.agents/skills/arch-design/references/schema.md).
3. Validate any `.arch` changes using the CLI validator:
   ```bash
   node .agents/skills/arch-design/scripts/validate.js <file.arch>
   ```
4. Automatically lay out new nodes using Dagre:
   ```bash
   node .agents/skills/arch-design/scripts/layout.js <file.arch>
   ```
