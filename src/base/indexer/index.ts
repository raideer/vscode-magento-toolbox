import { ModuleIndex, ModuleIndexer, ModuleIndexerData } from './module-indexer';

export interface Indexer<D = Record<string, any>> {
  index(): Promise<D>;
}

export interface IndexerData<D = Record<string, any>> {
  data: D;
}

export interface MagentoIndex {
  modules: ModuleIndexerData;
}

export async function indexWorkspace(): Promise<MagentoIndex> {
  const indexers = [ModuleIndexer];

  const data = await Promise.all(
    indexers.map((indexer) => {
      const instance = new indexer();

      return instance.index().then((data) => ({ name: instance.name, data }));
    })
  );

  return data.reduce((acc, item) => {
    acc[item.name] = new ModuleIndexerData(item.data);

    return acc;
  }, {}) as MagentoIndex;
}
