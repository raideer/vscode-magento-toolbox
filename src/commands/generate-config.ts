import * as vscode from 'vscode';
import { Builder } from 'xml2js';
import { openWebview } from 'utils/vscode';
import { resolveLoadedModules, resolveMagentoRoot } from 'utils/magento';
import { generateComposerJson, generateLicense, generateModuleRegistration } from 'generator';

export default async function (context: vscode.ExtensionContext) {
  const magentoRoot = await resolveMagentoRoot(context);

  if (!magentoRoot) {
    vscode.window.showWarningMessage(`Could not find Magento root directory.`);
    return;
  }

  const appCodeUri = vscode.Uri.joinPath(magentoRoot, 'app/code');

  const loadedModules = await resolveLoadedModules(appCodeUri);

  const data: any = await openWebview(context, 'SystemConfig', 'Generate System Config', {
    loadedModules,
  });

  console.log(data);
}
