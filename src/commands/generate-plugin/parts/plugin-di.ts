

import { Uri } from 'vscode';
import { loadXml } from 'utils/xml';
import { PluginWizardData } from '../plugin-wizard';
import { DiFactory } from 'generators/di-xml';
import { snakeCase } from 'lodash-es';
import { getModuleUri, getScopedPath } from 'utils/magento';

/**
 * Generates di.xml for a plugin
 */
export const generatePluginDi = async (data: PluginWizardData, subjectClass: string, pluginClass: string, appCodeUri: Uri) => {
  const moduleDirectory = getModuleUri(appCodeUri, data.module)

  const configLocation = getScopedPath('etc', data.scope, 'di.xml')
  const existing = await loadXml(Uri.joinPath(moduleDirectory, configLocation));

  const diGenerator = new DiFactory();
  diGenerator.addPlugin(subjectClass, pluginClass, `${data.module}::${snakeCase(data.name)}`);
  return diGenerator.toString(existing)
};
