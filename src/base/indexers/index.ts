import { Progress, WorkspaceFolder } from 'vscode';
import { NamespaceIndexerData } from './namespace/data';
import { ModuleIndexerData } from './module/indexer';
import { ObserverIndexerData } from './observer/indexer';
import { DiIndexerData } from './di/indexer';

export type WorkspaceIndex = {
  modules: ModuleIndexerData;
  observers: ObserverIndexerData;
  namespaces: NamespaceIndexerData;
  di: DiIndexerData;
};

export abstract class Indexer<D = any> {
  public abstract getName(): string;
  public abstract index(
    workspaceFolder: WorkspaceFolder,
    data: Partial<WorkspaceIndex>,
    progress: Progress<{
      message?: string;
      increment?: number;
    }>
  ): Promise<void>;
  public abstract getData(): D;
}
