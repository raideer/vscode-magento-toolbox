import { Progress } from 'vscode';
import { ModuleIndexer, ModuleIndexerData } from './indexers/module-indexer';

export interface Indexer<D = Record<string, any>> {
  index(): Promise<IndexerData<D>>;
}

export interface IndexerData<D = Record<string, any>> {
  data: D;
}

export interface MagentoIndex {
  modules: ModuleIndexerData;
}

export async function indexWorkspace(
  progress: Progress<{
    message?: string;
    increment?: number;
  }>
): Promise<MagentoIndex> {
  const indexers = [ModuleIndexer];

  progress.report({ message: 'Indexing', increment: 0 });
  const data = {};

  for (const indexer of indexers) {
    const instance = new indexer();

    progress.report({ message: `Indexing ${instance.name}` });
    data[instance.name] = await instance.index();
  }

  progress.report({ increment: 100 });

  return data as MagentoIndex;
}
