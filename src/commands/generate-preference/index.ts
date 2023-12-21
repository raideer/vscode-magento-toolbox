import * as vscode from 'vscode';
import { getModuleUri, getScopedPath } from 'utils/magento';
import { resolvePreferenceClass } from './resolve-preference-class';
import { preferenceWizard } from './preference-wizard';
import { generatePreferenceDi } from './parts/preference-di';
import { getWorkspaceIndex } from 'utils/extension';

export default async function () {
  const phpClass = resolvePreferenceClass();

  if (!phpClass) {
    // Error message already shown by resolvePreferenceClass
    return;
  }

  const workspaceIndex = getWorkspaceIndex();
  const appCodeUri = workspaceIndex.modules.appCode!;
  const modules = workspaceIndex.modules.getModuleList('app/code');

  // Open plugin wizard
  const data = await preferenceWizard(modules);

  // Module directory to generate plugin in
  const moduleDirectory = getModuleUri(appCodeUri, data.module);

  const diXml = await generatePreferenceDi(data, phpClass, appCodeUri);
  const diLocation = getScopedPath('etc', data.scope, 'di.xml');
  const diXmlPath = vscode.Uri.joinPath(moduleDirectory, diLocation);

  await vscode.workspace.fs.writeFile(diXmlPath, Buffer.from(diXml, 'utf-8'));
}
