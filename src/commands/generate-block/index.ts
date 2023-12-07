import * as vscode from 'vscode';
import { resolveLoadedModules, resolveMagentoRoot, resolveUriModule } from 'utils/magento';
import { capitalize, snakeCase } from 'lodash-es';
import { blockWizard } from './block-wizard';
import { generateBlockClass } from './generate-block-class';
import {
  generateBlockLayoutHandle,
  generateBlockLayoutTemplate,
} from './generate-block-layout-handle';

export default async function (context: vscode.ExtensionContext) {
  const magentoRoot = await resolveMagentoRoot(context);

  if (!magentoRoot) {
    vscode.window.showWarningMessage(`Could not find Magento root directory.`);
    return;
  }

  let defaultModule: string | undefined;

  if (vscode.window.activeTextEditor?.document.uri) {
    defaultModule = await resolveUriModule(vscode.window.activeTextEditor.document.uri)
  }

  const appCodeUri = vscode.Uri.joinPath(magentoRoot, 'app/code');
  const modules = await resolveLoadedModules(appCodeUri);

  // Open block wizard
  const data = await blockWizard(context, modules, defaultModule);

  const [vendor, module] = data.module.split('_');
  const moduleDirectory = vscode.Uri.joinPath(appCodeUri, `${vendor}/${module}`);

  // Generate block class
  const blockParts = data.blockName.split('/');
  let blockName = blockParts.pop() as string;
  blockName = blockName.replace('Block', '')
  blockName = `${capitalize(blockName)}Block`;

  const blockClass = await generateBlockClass(data, blockName);
  let blockScope = data.scope === 'frontend' ? `Block` : 'Block/Adminhtml';

  if (blockParts.length) {
    blockScope = `${blockScope}/${blockParts.join('/')}`;
  }

  const blockPath = vscode.Uri.joinPath(moduleDirectory, `${blockScope}/${blockName}.php`)

  await vscode.workspace.fs.writeFile(
    blockPath,
    Buffer.from(blockClass, 'utf-8')
  );

  // Generate layout handle
  if (data.referenceHandle) {
    // Generate view/scope/layout/layout_handle_name.xml
    const layoutHandleUri = vscode.Uri.joinPath(
      moduleDirectory,
      `view/${data.scope}/layout/${data.layoutHandle}.xml`
    );

    const blockTemplateName = snakeCase(data.blockName);
    const eventsXml = await generateBlockLayoutHandle(data, appCodeUri, blockName);

    await vscode.workspace.fs.writeFile(layoutHandleUri, Buffer.from(eventsXml, 'utf-8'));

    // Generate block template
    const template = await generateBlockLayoutTemplate(data.module, blockName);

    await vscode.workspace.fs.writeFile(
      vscode.Uri.joinPath(
        moduleDirectory,
        `view/${data.scope}/templates/${blockTemplateName}.phtml`
      ),
      Buffer.from(template, 'utf-8')
    );
  }

  vscode.window.showInformationMessage(`Generated a Block: ${data.blockName}`);
  vscode.commands.executeCommand('workbench.files.action.refreshFilesExplorer');

  await vscode.workspace.openTextDocument(blockPath).then(doc => {
    vscode.window.showTextDocument(doc);
  });
}
