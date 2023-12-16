import { Progress } from 'vscode';
import { ModuleIndexer, ModuleIndexerData } from './indexers/module-indexer';
import { ObserverIndexer, ObserverIndexerData } from './indexers/observer-indexer';

export interface Indexer<D = Record<string, any>> {
  name: string;
  index(data: Partial<MagentoIndex>): Promise<IndexerData<D>>;
}

export interface IndexerData<D = Record<string, any>> {
  data: D;
}

export interface MagentoIndex {
  modules: ModuleIndexerData;
  observers: ObserverIndexerData;
}

export async function indexWorkspace(
  progress: Progress<{
    message?: string;
    increment?: number;
  }>
): Promise<MagentoIndex> {
  const indexers = [ModuleIndexer, ObserverIndexer];

  progress.report({ message: 'Indexing', increment: 0 });
  const data = {};

  for (const indexer of indexers) {
    const instance: Indexer = new indexer();

    progress.report({ message: `Indexing ${instance.name}` });
    data[instance.name] = await instance.index(data);
  }

  progress.report({ increment: 100 });

  return data as MagentoIndex;
}
