import { loadXml } from 'utils/xml';
import { get } from 'lodash-es';
import { RelativePattern, Uri, WorkspaceFolder, workspace } from 'vscode';
import { ObserverIndexerData } from './data';
import { Indexer } from '../indexer';

export class ObserverIndexer extends Indexer {
  protected data = new ObserverIndexerData([]);

  public async index(workspaceFolder: WorkspaceFolder) {
    const pattern = new RelativePattern(workspaceFolder.uri, '**/events.xml');
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
