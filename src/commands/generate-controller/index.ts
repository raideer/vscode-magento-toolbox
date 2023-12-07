import * as vscode from 'vscode';
import { resolveLoadedModules, resolveMagentoRoot, resolveUriModule } from 'utils/magento';
import { capitalize, snakeCase } from 'lodash-es';
import { generateBlockClass } from 'commands/generate-block/generate-block-class';
import {
  generateBlockLayoutHandle,
  generateBlockLayoutTemplate,
} from 'commands/generate-block/generate-block-layout-handle';
import { controllerWizard } from './controller-wizard';
import { generateControllerClass } from './generate-controller-class';
import { generateFrontendRoutes } from './generate-frontend-routes';

export default async function (context: vscode.ExtensionContext) {
  const magentoRoot = await resolveMagentoRoot(context);

  if (!magentoRoot) {
    vscode.window.showWarningMessage(`Could not find Magento root directory.`);
    return;
  }

  const appCodeUri = vscode.Uri.joinPath(magentoRoot, 'app/code');

  // Load all magento modules in app/code
  const modules = await resolveLoadedModules(appCodeUri);

  let defaultModule: string | undefined;

  if (vscode.window.activeTextEditor?.document.uri) {
    defaultModule = await resolveUriModule(vscode.window.activeTextEditor.document.uri)
  }

  // Open wizard
  const data = await controllerWizard(context, modules, defaultModule);

  const [vendor, module] = data.module.split('_');

  // Module directory to generate controller in
  const moduleDirectory = vscode.Uri.joinPath(appCodeUri, `${vendor}/${module}`);

  // Generate controller class PHP
  const controllerClass = await generateControllerClass(data);

  // Write controller class to file
  const controllerDirectory = data.scope === 'frontend' ? 'Controller' : 'Controller/Adminhtml';
  const actionPath = capitalize(data.actionPath);
  const actionName = capitalize(data.actionName);
  const controllerPath = vscode.Uri.joinPath(moduleDirectory, `${controllerDirectory}/${actionPath}/${actionName}.php`);
  await vscode.workspace.fs.writeFile(
    controllerPath,
    Buffer.from(controllerClass, 'utf-8')
  );

  // Generate routes.xml
  const routesXml = await generateFrontendRoutes(data, appCodeUri);
  await vscode.workspace.fs.writeFile(
    vscode.Uri.joinPath(moduleDirectory, `etc/${data.scope}/routes.xml`),
    Buffer.from(routesXml, 'utf-8')
  );

  if (data.generateTemplate) {
    // Generate block class
    const blockClass = await generateBlockClass(
      {
        module: data.module,
        blockName: actionName,
        referenceHandle: false,
        scope: data.scope,
      },
      actionName
    );
    const blockPath = data.scope === 'frontend' ? `Block` : 'Block/Adminhtml';
    await vscode.workspace.fs.writeFile(
      vscode.Uri.joinPath(moduleDirectory, `${blockPath}/${actionPath}/${actionName}.php`),
      Buffer.from(blockClass, 'utf-8')
    );

    let frontName = (data.frontName || module).toLowerCase();
    frontName = snakeCase(frontName);

    const layoutHandleParts = [frontName, data.actionPath, data.actionName];

    const layoutHandleName = snakeCase(layoutHandleParts.filter(Boolean).join('_'));

    // Generate view/scope/layout/layout_handle_name.xml
    const layoutHandleUri = vscode.Uri.joinPath(
      moduleDirectory,
      `view/${data.scope}/layout/${layoutHandleName}.xml`
    );

    const blockTemplateName = snakeCase(data.actionName);
    const eventsXml = await generateBlockLayoutHandle(
      {
        module: data.module,
        blockName: data.actionName,
        referenceHandle: true,
        scope: data.scope,
        layoutHandle: layoutHandleName,
        referenceType: 'container',
        referenceName: 'content',
      },
      appCodeUri,
      data.actionName
    );

    await vscode.workspace.fs.writeFile(layoutHandleUri, Buffer.from(eventsXml, 'utf-8'));

    // Generate block template
    const template = await generateBlockLayoutTemplate(data.module, data.actionName);

    await vscode.workspace.fs.writeFile(
      vscode.Uri.joinPath(
        moduleDirectory,
        `view/${data.scope}/templates/${blockTemplateName}.phtml`
      ),
      Buffer.from(template, 'utf-8')
    );

    await vscode.workspace.openTextDocument(controllerPath).then(doc => {
      vscode.window.showTextDocument(doc);
    });
  }

  vscode.commands.executeCommand('workbench.files.action.refreshFilesExplorer');
}
