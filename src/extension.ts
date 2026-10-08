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

      const templateSkillBaseUri = vscode.Uri.joinPath(context.extensionUri, 'templates', 'skills', 'arch-design');
      const templateAgentsUri = vscode.Uri.joinPath(context.extensionUri, 'templates', 'AGENTS.md');

      try {
        const templateAgentsRaw = await vscode.workspace.fs.readFile(templateAgentsUri);
        const AGENTS_MD_CONTENT = Buffer.from(templateAgentsRaw).toString('utf8');

        let baseUri: vscode.Uri;
        if (scopeChoice.target === 'workspace') {
          if (!workspaceFolder) {
            vscode.window.showErrorMessage('No workspace folder open. Open a project folder first.');
            return;
          }
          baseUri = vscode.Uri.joinPath(workspaceFolder.uri, '.agents', 'skills', 'arch-design');

          // Check for existing agent guidelines file (AGENTS.md, agents.md, AGENT.md, agent.md)
          const candidateFiles = ['AGENTS.md', 'agents.md', 'AGENT.md', 'agent.md'];
          let targetUri: vscode.Uri | null = null;
          let existingContent: string | null = null;

          for (const candidate of candidateFiles) {
            const candidateUri = vscode.Uri.joinPath(workspaceFolder.uri, candidate);
            try {
              const raw = await vscode.workspace.fs.readFile(candidateUri);
              targetUri = candidateUri;
              existingContent = Buffer.from(raw).toString('utf8');
              break;
            } catch {
              // File does not exist, check next candidate
            }
          }

          if (targetUri && existingContent !== null) {
            const alreadyConfigured =
              existingContent.includes('.agents/skills/arch-design') ||
              existingContent.includes('Arch Design');

            if (!alreadyConfigured) {
              const separator = existingContent.trim().length > 0 ? '\n\n' : '';
              const updatedContent = `${existingContent.trimEnd()}${separator}${AGENTS_MD_CONTENT}`;
              await vscode.workspace.fs.writeFile(targetUri, Buffer.from(updatedContent, 'utf8'));
            }
          } else {
            const defaultUri = vscode.Uri.joinPath(workspaceFolder.uri, 'AGENTS.md');
            await vscode.workspace.fs.writeFile(defaultUri, Buffer.from(AGENTS_MD_CONTENT, 'utf8'));
          }
        } else {
          const os = await import('os');
          baseUri = vscode.Uri.file(require('path').join(os.homedir(), '.gemini', 'config', 'skills', 'arch-design'));
        }

        const skillFiles = [
          ['SKILL.md'],
          ['references', 'schema.md'],
          ['references', 'rules.md'],
          ['scripts', 'validate.js'],
          ['scripts', 'layout.js'],
          ['examples', 'sample.arch'],
          ['examples', 'sample-frontend.arch'],
          ['examples', 'sample-mobile.arch'],
          ['examples', 'sample-rust.arch'],
          ['examples', 'nowinandroid.arch'],
          ['examples', 'nextjs-commerce.arch'],
          ['examples', 'tokio-hyper.arch'],
          ['examples', 'swiftui-clean.arch']
        ];

        for (const segments of skillFiles) {
          const srcUri = vscode.Uri.joinPath(templateSkillBaseUri, ...segments);
          const destUri = vscode.Uri.joinPath(baseUri, ...segments);
          const content = await vscode.workspace.fs.readFile(srcUri);
          await vscode.workspace.fs.writeFile(destUri, content);
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