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
  /**
   * The name of the indexer
   */
  public abstract getName(): string;

  /**
   * Main indexer function
   */
  public abstract index(
    workspaceFolder: WorkspaceFolder,
    progress: Progress<{
      message?: string;
      increment?: number;
    }>
  ): Promise<void>;

  /**
   * Returns the data for the indexer
   */
  public abstract getData(): D;
}
