# Arch Design Extension Templates

This directory contains the Agent Skill templates and architecture guidelines bundled with the **Arch Design** VS Code extension.

These assets are installed into user workspaces or global configurations when running the command:
> **Arch: Install Agent Skill** (`lldCanvas.initAgentSkill`)

## Contents
- [`AGENTS.md`](./AGENTS.md): Architecture & agent guidelines template written to the root of target repositories.
- [`skills/arch-design/`](./skills/arch-design/): Complete Arch Design Agent Skill:
  - [`SKILL.md`](./skills/arch-design/SKILL.md): Agent instructions for reading, drafting, and validating `.arch` / `.lld` files.
  - [`references/`](./skills/arch-design/references/): JSON v2 specification (`schema.md`) and LLD connection rules (`rules.md`).
  - [`scripts/`](./skills/arch-design/scripts/): CLI validation (`validate.js`) and auto-layout (`layout.js`) tools.
  - [`examples/`](./skills/arch-design/examples/): Reference `.arch` diagram (`sample.arch`).
