import { DiIndexerData } from './di/data';
import { ModuleIndexerData } from './module/data';
import { NamespaceIndexerData } from './namespace/data';
import { ObserverIndexerData } from './observer/data';

export type WorkspaceIndex = {
  modules: ModuleIndexerData;
  observers: ObserverIndexerData;
  namespaces: NamespaceIndexerData;
  di: DiIndexerData;
};
