import { OpenDialogOptions, Uri, commands, window, workspace } from 'vscode';
import { ExecOptions, exec } from 'child_process';

const fileExistsCache = new Map<Uri, boolean>();

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

export async function writeFile(uri: Uri, content: string) {
  return workspace.fs.writeFile(uri, Buffer.from(content, 'utf-8'));
}

export async function openFile(uri: Uri) {
  return workspace.openTextDocument(uri).then(window.showTextDocument);
}

export function refreshFileExplorer() {
  return commands.executeCommand('workbench.files.action.refreshFilesExplorer');
}

export function getActiveWorkspaceFolder() {
  if (!workspace.workspaceFolders) {
    throw new Error('Workspace is empty');
  }

  if (workspace.workspaceFolders.length === 1) {
    return workspace.workspaceFolders[0];
  }

  if (!window.activeTextEditor?.document.uri) {
    throw new Error('No active text editor');
  }

  return workspace.getWorkspaceFolder(window.activeTextEditor.document.uri);
}

export async function fileExists(uri: Uri, skipCache = false) {
  if (!skipCache && fileExistsCache.has(uri)) {
    return fileExistsCache.get(uri)!;
  }

  return workspace.fs
    .stat(uri)
    .then(
      () => true,
      () => false
    )
    .then((exists) => {
      fileExistsCache.set(uri, exists);
      return exists;
    });
}

export function readFile(uri: Uri) {
  return workspace.fs.readFile(uri).then((buffer) => buffer.toString());
}

export async function execCommand(command: string, options: ExecOptions = {}) {
  return new Promise((resolve, reject) => {
    exec(command, options, (err, stdout, stderr) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(stdout);
    });
  });
}
