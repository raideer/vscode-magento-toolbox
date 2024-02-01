import { loadXml } from 'utils/xml';
import { get } from 'lodash-es';
import { RelativePattern, Uri, WorkspaceFolder, workspace } from 'vscode';
import { DiIndexerData } from './data';
import { Indexer } from '../indexer';

export class DiIndexer extends Indexer {
  protected data = new DiIndexerData();

  public async index(workspaceFolder: WorkspaceFolder) {
    const pattern = new RelativePattern(workspaceFolder.uri, '**/etc/di.xml');
    const diXmlFiles = await workspace.findFiles(pattern);

    await Promise.all(diXmlFiles.map(async (file) => this.processXml(file)));
  }

  public getData() {
    return this.data;
  }

  public getName(): string {
    return 'di';
  }

  private async processXml(uri: Uri) {
    const diXml = await loadXml(uri);

    if (!diXml) {
      return;
    }

    this.indexPreferences(diXml, uri);
    this.indexTypes(diXml, uri);
  }

  private indexPreferences(diXml: Record<string, any>, diXmlPath: Uri) {
    const preferences = get(diXml, 'config.preference', []);

    for (const preference of preferences) {
      const preferenceData = {
        for: get(preference, '$.for'),
        type: get(preference, '$.type'),
        diUri: diXmlPath,
      };

      this.data.preferences.push(preferenceData);
    }
  }

  private indexTypes(diXml: Record<string, any>, diXmlPath: Uri) {
    const types = get(diXml, 'config.type', []);

    for (const type of types) {
      this.indexTypePlugins(type, diXmlPath);
    }
  }

  private indexTypePlugins(type: Record<string, any>, diXmlPath: Uri) {
    const plugins = get(type, 'plugin', []);

    for (const plugin of plugins) {
      const pluginData = {
        name: get(plugin, '$.name'),
        type: get(type, '$.name'),
        pluginClass: get(plugin, '$.type'),
        diUri: diXmlPath,
      };

      this.data.plugins.push(pluginData);
    }
  }
}
