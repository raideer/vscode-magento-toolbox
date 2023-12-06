import * as vscode from 'vscode';
import { resolveLoadedModules, resolveMagentoRoot } from 'utils/magento';
import { resolvePluginClass, resolvePluginMethod } from './resolve-plugin-method';
import { pluginWizard } from './plugin-wizard';
import { generatePluginClass } from './generate-plugin-class';

export default async function (context: vscode.ExtensionContext) {
  const magentoRoot = await resolveMagentoRoot(context);

  if (!magentoRoot) {
    vscode.window.showWarningMessage(`Could not find Magento root directory.`);
    return;
  }

  const phpClass = resolvePluginClass();
  if (!phpClass) {
    // Error message already shown by resolvePluginClass
    return;
  }

  const method = resolvePluginMethod(phpClass);

  if (!method) {
    // Error message already shown by resolvePluginMethod
    return;
  }

  const appCodeUri = vscode.Uri.joinPath(magentoRoot, 'app/code');

  const modules = await resolveLoadedModules(appCodeUri);

  // Open plugin wizard
  const data = await pluginWizard(context, modules, phpClass.name!);
  const [vendor, module] = data.module.split('_');

  // Module directory to generate plugin in
  const moduleDirectory = vscode.Uri.joinPath(appCodeUri, `${vendor}/${module}`);

  const pluginClass = await generatePluginClass(data, phpClass, method);

  if (!pluginClass) {
    vscode.window.showWarningMessage(`Failed to generate plugin class.`);
    return;
  }

  const path = vscode.Uri.joinPath(moduleDirectory, `Plugin/${data.name}.php`);

  await vscode.workspace.fs.writeFile(
    path,
    Buffer.from(pluginClass, 'utf-8')
  );

  await vscode.workspace.openTextDocument(path).then(doc => {
    vscode.window.showTextDocument(doc);
  });
}
