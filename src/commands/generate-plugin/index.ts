import * as vscode from 'vscode';
import { resolvePluginClass, resolvePluginMethod } from './resolve-plugin-method';
import { pluginWizard } from './plugin-wizard';
import { generatePluginClass } from './parts/plugin-class';
import { generatePluginDi } from './parts/plugin-di';
import { openFile, writeFile } from 'utils/vscode';
import { ext } from 'base/variables';
import { getWorkspaceIndex } from 'utils/extension';

export default async function () {
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

  const workspaceIndex = getWorkspaceIndex();
  const appCodeUri = workspaceIndex.modules.data.appCode;
  const modules = workspaceIndex.modules.getModuleList();

  // Open plugin wizard
  const data = await pluginWizard(modules, phpClass.name!, method.name!);
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
