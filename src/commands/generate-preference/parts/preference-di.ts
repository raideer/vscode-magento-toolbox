import { Uri } from 'vscode';
import { loadXml } from 'utils/xml';
import { PreferenceWizardData } from '../preference-wizard';
import { DiFactory } from 'generators/di-xml';
import { getModuleUri, getScopedPath } from 'utils/magento';

/**
 * Generates di.xml for a preference
 */
export const generatePreferenceDi = async (data: PreferenceWizardData, appCodeUri: Uri) => {
  const moduleDirectory = getModuleUri(appCodeUri, data.module);

  const configLocation = getScopedPath('etc', data.scope, 'di.xml');
  const existing = await loadXml(Uri.joinPath(moduleDirectory, configLocation));

  const diGenerator = new DiFactory();
  diGenerator.addPreference('for', 'type');

  return diGenerator.toString(existing);
};
