import * as vscode from 'vscode';
import { getModuleUri, getScopedPath } from 'utils/magento';
import { getWorkspaceIndex } from 'utils/extension';
import { slice } from 'lodash-es';
import { openFile, writeFile } from 'utils/vscode';
import { resolvePreferenceClass } from './resolve-preference-class';
import { preferenceWizard } from './preference-wizard';
import { generatePreferenceDi } from './parts/preference-di';
import { generatePreferenceClass } from './parts/preference-class';

export default async function () {
  const phpClassOrInterface = resolvePreferenceClass();

  if (!phpClassOrInterface) {
    // Error message already shown by resolvePreferenceClass
    return;
  }

  const workspaceIndex = getWorkspaceIndex();
  const appCodeUri = workspaceIndex.modules.appCode!;
  const modules = workspaceIndex.modules.getModuleList('app/code');

  // Open plugin wizard
  const data = await preferenceWizard(modules, phpClassOrInterface.name);

  // Module directory to generate plugin in
  const moduleDirectory = getModuleUri(appCodeUri, data.module);

  let preferenceType = '';

  if (data.createClass) {
    const parentNamespaceParts = phpClassOrInterface.parent.namespace.split('\\');
    const parentNamespacePartsWithoutModule = slice(parentNamespaceParts, 2);
    const preferenceClass = await generatePreferenceClass(data, parentNamespacePartsWithoutModule);
    preferenceType = `${preferenceClass.namespace}\\${data.className}`;

    const filename = `${parentNamespacePartsWithoutModule.join('/')}/${data.className}.php`;
    const path = vscode.Uri.joinPath(moduleDirectory, filename);
    await writeFile(path, preferenceClass.preferenceClass);
    openFile(path);
  } else {
    preferenceType = data.type;
  }

  const diXml = await generatePreferenceDi(data, preferenceType, phpClassOrInterface, appCodeUri);
  const diLocation = getScopedPath('etc', data.scope, 'di.xml');
  const diXmlPath = vscode.Uri.joinPath(moduleDirectory, diLocation);

  await writeFile(diXmlPath, diXml);
  vscode.commands.executeCommand('magento-toolbox.indexWorkspace');
}
