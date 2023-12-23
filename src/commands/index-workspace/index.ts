import { indexWorkspace } from 'base/indexer';
import { ext } from 'base/variables';
import { ProgressLocation, window, workspace } from 'vscode';

export default async function () {
  ext.workspaceIndex = new Map();

  if (workspace.workspaceFolders) {
    try {
      await window.withProgress(
        {
          location: ProgressLocation.Window,
          title: 'Magento Toolbox',
          cancellable: false,
        },
        async (progress) => {
          for (const workspaceFolder of workspace.workspaceFolders!) {
            const index = await indexWorkspace(workspaceFolder, progress);
            ext.workspaceIndex.set(workspaceFolder, index);
          }
        }
      );
    } catch (e) {
      console.error('[Magento Toolbox] Error indexing workspace', e);
      return;
    }
  }
}
