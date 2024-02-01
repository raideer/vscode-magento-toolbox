import { ext } from 'base/variables';
import { getActiveWorkspaceFolder } from './vscode';

export function getWorkspaceIndex() {
  const workspaceFolder = getActiveWorkspaceFolder();

  if (!workspaceFolder) {
    throw new Error('No active workspace folder');
  }

  const workspaceIndex = ext.workspaceIndex!.get(workspaceFolder);

  if (!workspaceIndex) {
    throw new Error('No workspace index');
  }

  return workspaceIndex;
}
