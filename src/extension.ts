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
    })
  );
}

export function deactivate() {}