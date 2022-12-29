import * as vscode from 'vscode';
import { resolveLoadedModules, resolveMagentoRoot } from 'utils/magento';
import { resolvePreferenceClass } from './resolve-preference-class';
import { preferenceWizard } from './preference-wizard';

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
  const [vendor, module] = data.module.split('_');

  // Module directory to generate plugin in
  const moduleDirectory = vscode.Uri.joinPath(appCodeUri, `${vendor}/${module}`);
  // TODO
}
