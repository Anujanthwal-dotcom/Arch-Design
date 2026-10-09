import * as vscode from 'vscode';
import * as path from 'path';
import { LLDDocument } from './types';

export class LLDCanvasEditorProvider implements vscode.CustomTextEditorProvider {
  public static register(context: vscode.ExtensionContext): vscode.Disposable {
    const provider = new LLDCanvasEditorProvider(context);
    const providerRegistration = vscode.window.registerCustomEditorProvider(
      'lldCanvas.editor',
      provider
    );
    return providerRegistration;
  }

  constructor(private readonly context: vscode.ExtensionContext) {}

  public async resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken
  ): Promise<void> {
    webviewPanel.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.file(path.join(this.context.extensionPath, 'out')),
        vscode.Uri.file(path.join(this.context.extensionPath, 'media'))
      ]
    };

    webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview);

    const updateWebview = () => {
      let text = document.getText();
      if (!text || text.trim() === '') {
        const defaultDoc: LLDDocument = {
          version: 2,
          name: path.basename(document.uri.fsPath).replace(/\.(arch|lld)$/, ''),
          nodes: [],
          edges: []
        };
        text = JSON.stringify(defaultDoc, null, 2);
      }
      webviewPanel.webview.postMessage({
        type: 'update',
        text: text
      });
    };

    const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
      if (e.document.uri.toString() === document.uri.toString()) {
        updateWebview();
      }
    });

    webviewPanel.onDidDispose(() => {
      changeDocumentSubscription.dispose();
    });

    webviewPanel.webview.onDidReceiveMessage(async e => {
      switch (e.type) {
        case 'ready':
          updateWebview();
          return;
        case 'update':
          this.updateTextDocument(document, e.text);
          return;
        case 'openFile': {
          const rawPath = typeof e.filePath === 'string' ? e.filePath.trim() : '';
          if (!rawPath) return;

          let targetUri: vscode.Uri;
          if (path.isAbsolute(rawPath)) {
            targetUri = vscode.Uri.file(rawPath);
          } else {
            const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
            if (workspaceFolder) {
              targetUri = vscode.Uri.joinPath(workspaceFolder.uri, rawPath);
            } else {
              const docDir = vscode.Uri.file(path.dirname(document.uri.fsPath));
              targetUri = vscode.Uri.joinPath(docDir, rawPath);
            }
          }

          try {
            await vscode.workspace.fs.stat(targetUri);
            const doc = await vscode.workspace.openTextDocument(targetUri);
            await vscode.window.showTextDocument(doc, {
              preview: false,
              viewColumn: vscode.ViewColumn.Beside
            });
          } catch {
            const relativeDisplay = vscode.workspace.asRelativePath ? vscode.workspace.asRelativePath(targetUri) : path.basename(targetUri.fsPath);
            const choice = await vscode.window.showInformationMessage(
              `File '${relativeDisplay}' does not exist yet. Would you like to create it?`,
              'Create File',
              'Cancel'
            );
            if (choice === 'Create File') {
              try {
                const initialContent = Buffer.from(`// ${path.basename(targetUri.fsPath)}\n`, 'utf8');
                await vscode.workspace.fs.writeFile(targetUri, initialContent);
                const doc = await vscode.workspace.openTextDocument(targetUri);
                await vscode.window.showTextDocument(doc, {
                  preview: false,
                  viewColumn: vscode.ViewColumn.Beside
                });
              } catch (err: any) {
                vscode.window.showErrorMessage(`Failed to create file: ${err?.message || err}`);
              }
            }
          }
          return;
        }
      }
    });

    updateWebview();
  }

  private getHtmlForWebview(webview: vscode.Webview): string {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, 'out', 'editor', 'bundle.js')
    );
    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, 'out', 'editor', 'bundle.css')
    );

    const nonce = getNonce();

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}'; img-src ${webview.cspSource} data:;">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="${styleUri}">
      <title>Arch</title>
    </head>
    <body>
      <div id="root"></div>
      <script nonce="${nonce}" src="${scriptUri}"></script>
    </body>
    </html>`;
  }

  private updateTextDocument(document: vscode.TextDocument, json: string) {
    if (document.getText() === json) {
      return;
    }
    const edit = new vscode.WorkspaceEdit();
    const lastLine = Math.max(0, document.lineCount - 1);
    const lastChar = document.lineCount > 0 ? document.lineAt(lastLine).range.end.character : 0;
    edit.replace(
      document.uri,
      new vscode.Range(0, 0, lastLine, lastChar),
      json
    );
    return vscode.workspace.applyEdit(edit);
  }
}

function getNonce() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}