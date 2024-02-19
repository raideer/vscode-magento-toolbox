import { cleanNamespace } from 'utils/magento';
import { Uri } from 'vscode';

export interface Preference {
  for: string;
  type: string;
  diUri: Uri;
}

export interface Plugin {
  name: string;
  type: string;
  pluginClass: string;
  diUri: Uri;
}

export class DiIndexerData {
  constructor(public preferences: Preference[] = [], public plugins: Plugin[] = []) {}

  public getPreferencesFor(name: string) {
    return this.preferences.filter((preference) => preference.for === cleanNamespace(name));
  }

  public getPluginsByType(name: string) {
    return this.plugins.filter((plugin) => plugin.type === cleanNamespace(name));
  }
}
