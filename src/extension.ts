import * as vscode from 'vscode';
import { LLDCanvasEditorProvider } from './lldEditor';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    LLDCanvasEditorProvider.register(context),
    vscode.commands.registerCommand('lldCanvas.newFile', async () => {
      const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
      const defaultUri = workspaceFolder
        ? vscode.Uri.joinPath(workspaceFolder.uri, 'architecture.arch')
        : undefined;

      const fileUri = await vscode.window.showSaveDialog({
        defaultUri,
        filters: {
          'Arch Architecture': ['arch', 'lld']
        },
        saveLabel: 'Create Architecture File'
      });

      if (!fileUri) {
        return;
      }

      const initialContent = JSON.stringify(
        {
          version: 2,
          name: 'architecture',
          nodes: [],
          edges: []
        },
        null,
        2
      );

      const writeData = Buffer.from(initialContent, 'utf8');
      await vscode.workspace.fs.writeFile(fileUri, writeData);

      await vscode.commands.executeCommand('vscode.openWith', fileUri, 'lldCanvas.editor');
    }),
    vscode.commands.registerCommand('lldCanvas.initAgentSkill', async () => {
      const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

      const scopeChoice = await vscode.window.showQuickPick(
        [
          {
            label: '$(repo) Current Workspace (.agents/skills/arch-design/)',
            description: 'Recommended',
            detail: 'Installs in this project so all agents and team members can use it.',
            target: 'workspace'
          },
          {
            label: '$(globe) Global User Profile (~/.gemini/config/skills/arch-design/)',
            description: 'Machine-wide',
            detail: 'Installs globally for Antigravity across all your projects.',
            target: 'global'
          }
        ],
        { placeHolder: 'Select where to install the Arch Design Agent Skill' }
      );

      if (!scopeChoice) {
        return;
      }

      const {
        SKILL_MD_CONTENT,
        SCHEMA_MD_CONTENT,
        RULES_MD_CONTENT,
        VALIDATE_JS_CONTENT,
        LAYOUT_JS_CONTENT,
        AGENTS_MD_CONTENT
      } = await import('./skillTemplates');

      try {
        let baseUri: vscode.Uri;
        if (scopeChoice.target === 'workspace') {
          if (!workspaceFolder) {
            vscode.window.showErrorMessage('No workspace folder open. Open a project folder first.');
            return;
          }
          baseUri = vscode.Uri.joinPath(workspaceFolder.uri, '.agents', 'skills', 'arch-design');

          // Also write AGENTS.md in workspace root if not present
          const agentsMdUri = vscode.Uri.joinPath(workspaceFolder.uri, 'AGENTS.md');
          try {
            await vscode.workspace.fs.stat(agentsMdUri);
          } catch {
            await vscode.workspace.fs.writeFile(agentsMdUri, Buffer.from(AGENTS_MD_CONTENT, 'utf8'));
          }
        } else {
          const os = await import('os');
          baseUri = vscode.Uri.file(require('path').join(os.homedir(), '.gemini', 'config', 'skills', 'arch-design'));
        }

        const filesToWrite = [
          { uri: vscode.Uri.joinPath(baseUri, 'SKILL.md'), content: SKILL_MD_CONTENT },
          { uri: vscode.Uri.joinPath(baseUri, 'references', 'schema.md'), content: SCHEMA_MD_CONTENT },
          { uri: vscode.Uri.joinPath(baseUri, 'references', 'rules.md'), content: RULES_MD_CONTENT },
          { uri: vscode.Uri.joinPath(baseUri, 'scripts', 'validate.js'), content: VALIDATE_JS_CONTENT },
          { uri: vscode.Uri.joinPath(baseUri, 'scripts', 'layout.js'), content: LAYOUT_JS_CONTENT }
        ];

        for (const f of filesToWrite) {
          await vscode.workspace.fs.writeFile(f.uri, Buffer.from(f.content, 'utf8'));
        }

        vscode.window.showInformationMessage(
          `✓ Arch Design Agent Skill installed in ${scopeChoice.target === 'workspace' ? 'workspace' : 'global config'}. AI coding agents can now read, validate, and draw .arch diagrams!`
        );
      } catch (err: any) {
        vscode.window.showErrorMessage(`Failed to install Agent Skill: ${err?.message || err}`);
      }
    })
  );
}

export function deactivate() {}