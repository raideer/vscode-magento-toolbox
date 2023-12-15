import * as vscode from 'vscode';
import { resolveLoadedModules, resolveMagentoRoot } from 'utils/magento';
import { resolvePluginClass, resolvePluginMethod } from './resolve-plugin-method';
import { pluginWizard } from './plugin-wizard';
import { generatePluginClass } from './parts/plugin-class';
import { generatePluginDi } from './parts/plugin-di';
import { openFile, writeFile } from 'utils/vscode';

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
  const subjectClass = `${phpClass.namespace}\\${phpClass.name}`;

  const { pluginClass, namespace } = await generatePluginClass(data, phpClass, method);

  if (!pluginClass) {
    vscode.window.showWarningMessage(`Failed to generate plugin class.`);
    return;
  }

  const pluginName = `Plugin/${data.name}.php`;

  const diXml = await generatePluginDi(
    data,
    subjectClass,
    `${namespace}\\${data.name}`,
    appCodeUri
  );
  const diLocation = data.scope === 'all' ? 'etc/di.xml' : `etc/${data.scope}/di.xml`;
  const diXmlPath = vscode.Uri.joinPath(moduleDirectory, diLocation);

  await writeFile(diXmlPath, diXml);

  const path = vscode.Uri.joinPath(moduleDirectory, pluginName);

  await writeFile(path, pluginClass);
  await openFile(path);
}
