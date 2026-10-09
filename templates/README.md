# Arch Design Extension Templates

This directory contains the Agent Skill templates and architecture guidelines bundled with the **Arch Design** VS Code extension.

These assets are installed into user workspaces or global configurations when running the command:
> **Arch: Install Agent Skill** (`lldCanvas.initAgentSkill`)

## Contents
- [`AGENTS.md`](./AGENTS.md): Architecture & agent guidelines template written to the root of target repositories (Antigravity & OpenCode standard).
- [`rules/`](./rules/): Multi-agent bridge configuration templates:
  - [`CLAUDE.md`](./rules/CLAUDE.md): Claude Code project guidelines.
  - [`cursor-arch-design.mdc`](./rules/cursor-arch-design.mdc): Cursor MDC rule with glob matching (`*.arch`, `*.lld`).
  - [`cursorrules`](./rules/cursorrules): Legacy single-file `.cursorrules` snippet.
- [`skills/arch-design/`](./skills/arch-design/): Complete Arch Design Agent Skill:
  - [`SKILL.md`](./skills/arch-design/SKILL.md): Agent instructions for reading, drafting, and validating `.arch` / `.lld` files.
  - [`references/`](./skills/arch-design/references/): JSON v2 specification (`schema.md`) and LLD connection rules (`rules.md`).
  - [`scripts/`](./skills/arch-design/scripts/): CLI validation (`validate.js`) and auto-layout (`layout.js`) tools.
  - [`examples/`](./skills/arch-design/examples/): Reference `.arch` diagrams across multiple architectural domains.
