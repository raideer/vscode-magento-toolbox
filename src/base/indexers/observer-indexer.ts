import { Indexer, IndexerData, WorkspaceIndex } from 'base/indexer';
import { MagentoModule } from './module-indexer';
import { loadXml, parseXml } from 'utils/xml';
import { get } from 'lodash-es';
import { removeExtraSlashes } from 'utils/path';
import { WorkspaceFolder } from 'vscode';

export interface Observer {
  event: string;
  class: string;
  module: string;
}

export interface ObserverIndex {
  observers: Map<string, Observer>;
}

export class ObserverIndexerData implements IndexerData<ObserverIndex> {
  constructor(public data: ObserverIndex) {}

  public getObserverByClass(name: string) {
    for (const observer of this.data.observers.values()) {
      if (removeExtraSlashes(observer.class) === name) {
        return observer;
      }
    }
  }
}

export class ObserverIndexer implements Indexer<ObserverIndex> {
  public name = 'observers';

  protected data: ObserverIndex = {
    observers: new Map(),
  };

  public async index(workspaceFolder: WorkspaceFolder, data: Partial<WorkspaceIndex>) {
    const { modules } = data;

    if (modules) {
      const promises = Array.from(modules.data.modules.values()).map(async (module) =>
        this.indexModuleObservers(module)
      );

      await Promise.all(promises);
    }

    return new ObserverIndexerData(this.data);
  }

  private async indexModuleObservers(module: MagentoModule) {
    const eventsXmlPath = module.path.with({
      path: module.path.path + '/etc/events.xml',
    });

    const eventsXml = await loadXml(eventsXmlPath);

    if (!eventsXml) {
      return;
    }

    const events = get(eventsXml, 'config.event', []);

    for (const event of events) {
      const observers = get(event, 'observer', []);

      for (const observer of observers) {
        const observerName = get(observer, '$.name');
        const observerClass = get(observer, '$.instance');

        if (observerName && observerClass) {
          this.data.observers.set(observerName, {
            event: observerName,
            class: observerClass,
            module: module.name,
          });
        }
      }
    }
  }
}
