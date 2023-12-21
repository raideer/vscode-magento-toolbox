import { MagentoModule } from './module-indexer';
import { loadXml } from 'utils/xml';
import { get, trimStart } from 'lodash-es';
import { removeExtraSlashes } from 'utils/path';
import { WorkspaceFolder } from 'vscode';
import { Indexer, WorkspaceIndex } from '.';

export interface Observer {
  event: string;
  class: string;
  module: string;
}

export class ObserverIndexerData {
  constructor(public observers: Observer[]) {}

  public getObserverByClass(name: string) {
    for (const observer of this.observers) {
      if (trimStart(removeExtraSlashes(observer.class), '\\') === name) {
        return observer;
      }
    }
  }

  public getObserversByEvent(name: string) {
    return this.observers.filter((observer) => observer.event === name);
  }
}

export class ObserverIndexer extends Indexer {
  protected data = new ObserverIndexerData([]);

  public async index(workspaceFolder: WorkspaceFolder, data: Partial<WorkspaceIndex>) {
    const { modules: moduleIndex } = data;

    if (moduleIndex) {
      const promises = Array.from(moduleIndex.modules.values()).map(async (module) =>
        this.indexModuleObservers(module)
      );

      await Promise.all(promises);
    }
  }

  public getData() {
    return this.data;
  }

  public getName(): string {
    return 'observers';
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
          this.data.observers.push({
            event: event.$.name,
            class: observerClass,
            module: module.name,
          });
        }
      }
    }
  }
}
