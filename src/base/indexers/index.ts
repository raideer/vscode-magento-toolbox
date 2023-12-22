import { WorkspaceFolder } from 'vscode';
import { NamespaceIndexerData } from './namespace/data';
import { ModuleIndexerData } from './module/indexer';
import { ObserverIndexerData } from './observer/indexer';

export type WorkspaceIndex = {
  modules: ModuleIndexerData;
  observers: ObserverIndexerData;
  namespaces: NamespaceIndexerData;
};

export abstract class Indexer<D = any> {
  public abstract getName(): string;
  public abstract index(
    workspaceFolder: WorkspaceFolder,
    data: Partial<WorkspaceIndex>
  ): Promise<void>;
  public abstract getData(): D;
}
