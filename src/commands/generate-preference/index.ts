import * as vscode from 'vscode';
import {
  getModuleUri,
  getScopedPath,
  resolveLoadedModules,
  resolveMagentoRoot,
} from 'utils/magento';
import { resolvePreferenceClass } from './resolve-preference-class';
import { preferenceWizard } from './preference-wizard';
import { generatePreferenceDi } from './parts/preference-di';

export default async function (context: vscode.ExtensionContext) {
  const magentoRoot = await resolveMagentoRoot(context);

  if (!magentoRoot) {
    vscode.window.showWarningMessage(`Could not find Magento root directory.`);
    return;
  }

  const phpClass = resolvePreferenceClass();

  if (!phpClass) {
    // Error message already shown by resolvePreferenceClass
    return;
  }

  const appCodeUri = vscode.Uri.joinPath(magentoRoot, 'app/code');

  const modules = await resolveLoadedModules(appCodeUri);

  // Open plugin wizard
  const data = await preferenceWizard(context, modules);

  // Module directory to generate plugin in
  const moduleDirectory = getModuleUri(appCodeUri, data.module);

  const diXml = await generatePreferenceDi(data, phpClass, appCodeUri);
  const diLocation = getScopedPath('etc', data.scope, 'di.xml');
  const diXmlPath = vscode.Uri.joinPath(moduleDirectory, diLocation);

  await vscode.workspace.fs.writeFile(diXmlPath, Buffer.from(diXml, 'utf-8'));
}
