import { OpenDialogOptions, Uri, commands, window, workspace } from 'vscode';

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
  return workspace.fs.writeFile(
    uri,
    Buffer.from(content, 'utf-8')
  );
}

export async function openFile(uri: Uri) {
  return workspace.openTextDocument(uri).then(window.showTextDocument);
}

export function refreshFileExplorer() {
  return commands.executeCommand('workbench.files.action.refreshFilesExplorer');
}