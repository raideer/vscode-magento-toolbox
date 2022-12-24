import * as vscode from 'vscode';
import { resolveLoadedModules, resolveMagentoRoot } from 'utils/magento';
import { capitalize, lowerCase, snakeCase } from 'lodash-es';
import { controllerWizard } from './controller-wizard';
import { generateControllerClass } from './generate-controller-class';

export default async function (context: vscode.ExtensionContext) {
  const magentoRoot = await resolveMagentoRoot(context);

  if (!magentoRoot) {
    vscode.window.showWarningMessage(`Could not find Magento root directory.`);
    return;
  }

  const appCodeUri = vscode.Uri.joinPath(magentoRoot, 'app/code');

  // Load all magento modules in app/code
  const modules = await resolveLoadedModules(appCodeUri);

  // Open wizard
  const data = await controllerWizard(context, modules);

  const [vendor, module] = data.module.split('_');

  // Module directory to generate controller in
  const moduleDirectory = vscode.Uri.joinPath(appCodeUri, `${vendor}/${module}`);

  // Generate controller class PHP
  const controllerClass = await generateControllerClass(data);

  // Write controller class to file
  const controllerDirectory = data.scope === 'frontend' ? 'Controller' : 'Controller/Adminhtml';
  const actionPath = capitalize(data.actionPath);
  const actionName = capitalize(data.actionName);
  await vscode.workspace.fs.writeFile(
    vscode.Uri.joinPath(moduleDirectory, `${controllerDirectory}/${actionPath}/${actionName}.php`),
    Buffer.from(controllerClass, 'utf-8')
  );

  const frontName = lowerCase(snakeCase(data.frontName || module));

  vscode.commands.executeCommand('workbench.files.action.refreshFilesExplorer');
}
