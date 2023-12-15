import { Uri } from 'vscode';
import { loadXml } from 'utils/xml';
import { PluginWizardData } from '../plugin-wizard';
import { snakeCase } from 'lodash-es';
import { getModuleUri, getScopedPath } from 'utils/magento';
import { DiFactory } from 'generators/xml/di';

/**
 * Generates di.xml for a plugin
 */
export const generatePluginDi = async (
  data: PluginWizardData,
  subjectClass: string,
  pluginClass: string,
  appCodeUri: Uri
) => {
  const moduleDirectory = getModuleUri(appCodeUri, data.module);

  const configLocation = getScopedPath('etc', data.scope, 'di.xml');
  const existing = await loadXml(Uri.joinPath(moduleDirectory, configLocation));

  const diGenerator = new DiFactory();
  diGenerator.addPlugin({
    subject: subjectClass,
    plugin: pluginClass,
    name: `${data.module}::${snakeCase(data.name)}`,
    sortOrder: data.sort_order,
  });
  return diGenerator.toString(existing);
};
