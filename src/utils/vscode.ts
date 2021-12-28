import { OpenDialogOptions, Uri, window, workspace } from 'vscode';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function openWebview(
  context: vscode.ExtensionContext,
  componentName: string,
  title: string,
  data: any = {}
) {
  return new Promise((resolve, reject) => {
    const scriptPath = Uri.file(path.join(context.extensionPath, 'dist', 'webview.js'));
    let template = fs.readFileSync(`${context.extensionPath}/templates/webview/index.html`, 'utf8');
    template = template.replace(
      '{{APP_SCRIPT}}',
      scriptPath.with({ scheme: 'vscode-resource' }).toString()
    );

    const panel = window.createWebviewPanel('magentoToolboxDialog', title, vscode.ViewColumn.One, {
      enableScripts: true,
    });

    panel.webview.html = template;

    let loaded = false;
    let it: any;

    panel.webview.onDidReceiveMessage((message) => {
      switch (message.command) {
        case 'loaded':
          loaded = true;
          clearInterval(it);
          panel.webview.postMessage({ command: `render${componentName}`, payload: data });
          break;
        case 'form':
          panel.dispose();
          resolve(message.payload);
          break;
        default:
          console.warn('Unknown command');
          break;
      }
    });

    it = setTimeout(() => {
      if (!loaded) {
        panel.dispose();
        reject(new Error('Failed to load webview'));
      }
    }, 5000);
  });
}

export async function openTextDialog(prompt: string, placeHolder?: string, value?: string) {
  const result = await window.showInputBox({
    prompt,
    placeHolder,
    value,
  });

  return result;
}

export async function openDirectoryDialog(title?: string) {
  const options: OpenDialogOptions = {
    canSelectFiles: false,
    canSelectFolders: true,
    canSelectMany: false,
    defaultUri: workspace.workspaceFolders && workspace.workspaceFolders[0].uri,
    title,
  };

  const result: Uri[] | undefined = await window.showOpenDialog(Object.assign(options));

  if (result && result.length) {
    return Promise.resolve(result[0]);
  }
  return Promise.reject();
}
