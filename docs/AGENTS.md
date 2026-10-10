# Arch Design - Agent Guidelines & Instructions

This repository and documentation site supports autonomous AI coding agents (Antigravity, Cursor, Claude Code, Windsurf, Copilot, Gemini CLI).

## For AI Agents Working with Arch Design Files (`.arch` / `.lld`)

1. **Locate Architecture Files**:
   ```bash
   find . -name "*.arch" -o -name "*.lld"
   ```

2. **Full Documentation & LLM Specification**:
   - Short index: [llms.txt](./llms.txt)
   - Comprehensive reference: [llms-full.txt](./llms-full.txt)
   - XML Sitemap: [sitemap.xml](./sitemap.xml)

3. **Validate Architecture Files**:
   Always validate any changes before committing or replying:
   ```bash
   node .agents/skills/arch-design/scripts/validate.js <file.arch>
   ```

4. **Auto-Assign Visual Coordinates**:
   Use Dagre layout so nodes never overlap on the VS Code canvas:
   ```bash
   node .agents/skills/arch-design/scripts/layout.js <file.arch>
   ```

5. **Always Set `filePath` on Cards**:
   Include `filePath` (relative to the workspace root, e.g. `"src/services/AuthService.ts"`) so developers can click cards in the VS Code canvas to jump straight to the source code.
