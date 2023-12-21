import { Progress, WorkspaceFolder } from 'vscode';
import { ModuleIndexer } from './indexers/module-indexer';
import { ObserverIndexer } from './indexers/observer-indexer';
import { NamespaceIndexer } from './indexers/namespace/indexer';
import { Indexer, WorkspaceIndex } from './indexers';

export async function indexWorkspace(
  workspaceFolder: WorkspaceFolder,
  progress: Progress<{
    message?: string;
    increment?: number;
  }>
): Promise<WorkspaceIndex> {
  const indexers = [NamespaceIndexer, ModuleIndexer, ObserverIndexer];

  progress.report({ message: 'Indexing', increment: 0 });
  const data = {};

  for (const indexer of indexers) {
    const instance: Indexer = new indexer();

    progress.report({ message: `Running ${instance.getName()} indexer` });

    await instance.index(workspaceFolder, data);
    data[instance.getName()] = instance.getData();
  }

  progress.report({ increment: 100 });

  return data as WorkspaceIndex;
}
