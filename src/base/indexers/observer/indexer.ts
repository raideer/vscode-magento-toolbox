import { loadXml } from 'utils/xml';
import { get, trimStart } from 'lodash-es';
import { removeExtraSlashes } from 'utils/path';
import { RelativePattern, Uri, WorkspaceFolder, workspace } from 'vscode';
import { Indexer } from '..';

export interface Observer {
  event: string;
  class: string;
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

  public async index(workspaceFolder: WorkspaceFolder) {
    const pattern = new RelativePattern(workspaceFolder.uri, 'etc/**/events.xml');

    const eventsXmlFiles = await workspace.findFiles(pattern);

    await Promise.all(eventsXmlFiles.map(async (file) => this.processConfig(file)));
  }

  public getData() {
    return this.data;
  }

  public getName(): string {
    return 'observers';
  }

  private async processConfig(uri: Uri) {
    const eventsXml = await loadXml(uri);

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
          });
        }
      }
    }
  }
}
