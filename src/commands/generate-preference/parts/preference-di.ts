import { Uri } from 'vscode';
import { loadXml } from 'utils/xml';
import { PreferenceWizardData } from '../preference-wizard';
import { getModuleUri, getScopedPath } from 'utils/magento';
import { DiFactory } from 'generators/xml/di';
import { PhpClass } from 'base/reflection/php-class';

/**
 * Generates di.xml for a preference
 */
export const generatePreferenceDi = async (
  data: PreferenceWizardData,
  methodClass: PhpClass,
  appCodeUri: Uri
) => {
  const moduleDirectory = getModuleUri(appCodeUri, data.module);

  const configLocation = getScopedPath('etc', data.scope, 'di.xml');
  const existing = await loadXml(Uri.joinPath(moduleDirectory, configLocation));

  const diGenerator = new DiFactory();

  const forClass = `${methodClass.parent.namespace}\\${methodClass.name}`;

  diGenerator.addPreference(forClass, data.type);

  return diGenerator.toString(existing);
};
