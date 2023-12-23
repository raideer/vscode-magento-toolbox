import { loadXml } from 'utils/xml';
import { get } from 'lodash-es';
import { Uri, WorkspaceFolder } from 'vscode';
import { Indexer, WorkspaceIndex } from '..';
import { MagentoModule } from '../module/indexer';
import { cleanNamespace } from 'utils/magento';

export interface IPreference {
  for: string;
  type: string;
  diUri: Uri;
}

export interface IPlugin {
  name: string;
  type: string;
  pluginClass: string;
  diUri: Uri;
}

export class DiIndexerData {
  constructor(public preferences: IPreference[] = [], public plugins: IPlugin[] = []) {}

  public getPreferencesFor(name: string) {
    return this.preferences.filter((preference) => preference.for === cleanNamespace(name));
  }

  public getPluginsByType(name: string) {
    return this.plugins.filter((plugin) => plugin.type === cleanNamespace(name));
  }
}

export class DiIndexer extends Indexer {
  protected data = new DiIndexerData();

  public async index(workspaceFolder: WorkspaceFolder, data: Partial<WorkspaceIndex>) {
    const { modules: moduleIndex } = data;

    if (moduleIndex) {
      const promises = Array.from(moduleIndex.modules.values()).map(async (module) =>
        this.indexModuleDi(module)
      );

      await Promise.all(promises);
    }
  }

  public getData() {
    return this.data;
  }

  public getName(): string {
    return 'di';
  }

  private async indexModuleDi(module: MagentoModule) {
    const diXmlPath = module.path.with({
      path: module.path.path + '/etc/di.xml',
    });

    const diXml = await loadXml(diXmlPath);

    if (!diXml) {
      return;
    }

    this.indexPreferences(diXml, diXmlPath);
    this.indexTypes(diXml, diXmlPath);
  }

  private indexPreferences(diXml: Object, diXmlPath: Uri) {
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

  private indexTypes(diXml: Object, diXmlPath: Uri) {
    const types = get(diXml, 'config.type', []);

    for (const type of types) {
      this.indexTypePlugins(type, diXmlPath);
    }
  }

  private indexTypePlugins(type: Object, diXmlPath: Uri) {
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
