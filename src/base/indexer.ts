import { Progress, WorkspaceFolder } from 'vscode';
import { NamespaceIndexer } from './indexers/namespace/indexer';
import { WorkspaceIndex } from './indexers';
import { ModuleIndexer } from './indexers/module/indexer';
import { ObserverIndexer } from './indexers/observer/indexer';
import { DiIndexer } from './indexers/di/indexer';
import { Indexer } from './indexers/indexer';

export async function indexWorkspace(
  workspaceFolder: WorkspaceFolder,
  progress: Progress<{
    message?: string;
    increment?: number;
  }>
): Promise<WorkspaceIndex> {
  const indexers = [NamespaceIndexer, ModuleIndexer, ObserverIndexer, DiIndexer];

  progress.report({ message: 'Indexing', increment: 0 });
  const data = {};

  for (const indexer of indexers) {
    // eslint-disable-next-line new-cap
    const instance: Indexer = new indexer();

    progress.report({ message: `Running ${instance.getName()} indexer` });

    const timerName = workspaceFolder.name + instance.getName();
    await instance.index(workspaceFolder, progress);

    data[instance.getName()] = instance.getData();
  }

  progress.report({ increment: 100 });

  return data as WorkspaceIndex;
}
