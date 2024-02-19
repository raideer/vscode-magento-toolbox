import * as vscode from 'vscode';
import { resolveUriModule } from 'utils/magento';
import { capitalize, snakeCase } from 'lodash-es';
import { generateBlockClassPart } from 'commands/generate-block/parts/block-class';
import { openFile, refreshFileExplorer, writeFile } from 'utils/vscode';
import { generateBlockLayoutHandlePart } from 'commands/generate-block/parts/block-layout-handle';
import { generateBlockLayoutTemplatePart } from 'commands/generate-block/parts/block-layout-template';
import { getWorkspaceIndex } from 'utils/extension';
import { generateFrontendRoutes } from './parts/frontend-routes';
import { generateControllerClass } from './parts/controller-class';
import { controllerWizard } from './controller-wizard';

/**
 * Generates a controller
 *
 * File list:
 * - app/code/Vendor/Module/Controller/ActionPath/ActionName.php
 * - app/code/Vendor/Module/etc/frontend/routes.xml
 * - (optional) app/code/Vendor/Module/Block/ActionPath/ActionName.php
 * - (optional) app/code/Vendor/Module/view/frontend/layout/layout_handle_name.xml
 * - (optional) app/code/Vendor/Module/view/frontend/templates/action_name.phtml
 *
 */
export default async function () {
  const workspaceIndex = getWorkspaceIndex();

  const appCodeUri = workspaceIndex.modules.appCode!;

  // Load all magento modules in app/code
  const modules = workspaceIndex.modules.getModuleList('app/code');

  let defaultModule: string | undefined;

  if (vscode.window.activeTextEditor?.document.uri) {
    defaultModule = await resolveUriModule(vscode.window.activeTextEditor.document.uri);
  }

  // Open wizard
  const data = await controllerWizard(modules, defaultModule);

  const [vendor, module] = data.module.split('_');

  // Module directory to generate controller in
  const moduleDirectory = vscode.Uri.joinPath(appCodeUri, `${vendor}/${module}`);

  // Generate controller class PHP
  const controllerClass = await generateControllerClass(data);

  // Write controller class to file
  const controllerDirectory = data.scope === 'frontend' ? 'Controller' : 'Controller/Adminhtml';
  const actionPath = capitalize(data.actionPath);
  const actionName = capitalize(data.actionName);
  const controllerPath = vscode.Uri.joinPath(
    moduleDirectory,
    `${controllerDirectory}/${actionPath}/${actionName}.php`
  );

  await writeFile(controllerPath, controllerClass);

  // Generate routes.xml
  const routesXml = await generateFrontendRoutes(data, appCodeUri);

  await writeFile(vscode.Uri.joinPath(moduleDirectory, `etc/${data.scope}/routes.xml`), routesXml);

  if (data.generateTemplate) {
    // Generate block class
    const blockClass = await generateBlockClassPart(
      {
        module: data.module,
        blockName: actionName,
        referenceHandle: false,
        scope: data.scope,
      },
      actionName
    );
    const blockPath = data.scope === 'frontend' ? `Block` : 'Block/Adminhtml';

    await writeFile(
      vscode.Uri.joinPath(moduleDirectory, `${blockPath}/${actionPath}/${actionName}.php`),
      blockClass
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
    const eventsXml = await generateBlockLayoutHandlePart(
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

    await writeFile(layoutHandleUri, eventsXml);

    // Generate block template
    const template = await generateBlockLayoutTemplatePart(data.module, data.actionName);

    await writeFile(
      vscode.Uri.joinPath(
        moduleDirectory,
        `view/${data.scope}/templates/${blockTemplateName}.phtml`
      ),
      template
    );
  }

  openFile(controllerPath);
  refreshFileExplorer();
}
