import * as vscode from 'vscode';
import { resolveUriModule } from 'utils/magento';
import { capitalize, snakeCase } from 'lodash-es';
import { openFile, refreshFileExplorer, writeFile } from 'utils/vscode';
import { getWorkspaceIndex } from 'utils/extension';
import { BlockWizardBlockData, BlockWizardLayoutHandleData, openBlockWizard } from './block-wizard';
import { generateBlockClassPart } from './parts/block-class';
import { generateBlockLayoutHandlePart } from './parts/block-layout-handle';
import { generateBlockLayoutTemplatePart } from './parts/block-layout-template';

/**
 * Generates a block
 *
 * File list:
 * - app/code/Vendor/Module/Block/BlockName.php
 * - (optional) app/code/Vendor/Module/view/frontend/layout/layout_handle_name.xml
 * - (optional) app/code/Vendor/Module/view/frontend/templates/block_name.phtml
 *
 */
export default async function () {
  let defaultModule: string | undefined;

  if (vscode.window.activeTextEditor?.document.uri) {
    defaultModule = await resolveUriModule(vscode.window.activeTextEditor.document.uri);
  }

  const workspaceIndex = getWorkspaceIndex();

  const appCodeUri = workspaceIndex.modules.appCode!;
  const modules = workspaceIndex.modules.getModuleList('app/code');

  const wizardInputData = await openBlockWizard(modules, defaultModule);

  const [vendor, module] = wizardInputData.module.split('_');
  const moduleDirectory = vscode.Uri.joinPath(appCodeUri, `${vendor}/${module}`);

  const { blockClassName, blockPath } = getBlockClassName(wizardInputData);

  const blockClassUri = await generateBlockClass(
    wizardInputData,
    blockClassName,
    blockPath,
    moduleDirectory
  );

  await generateBlockLayoutHandle(wizardInputData, blockClassName, moduleDirectory);

  vscode.window.showInformationMessage(`Generated a Block: ${wizardInputData.blockName}`);
  refreshFileExplorer();
  openFile(blockClassUri);
}

async function generateBlockClass(
  wizardInputData: BlockWizardBlockData | BlockWizardLayoutHandleData,
  blockClassName: string,
  blockPath: string,
  moduleDirectory: vscode.Uri
) {
  const blockClass = await generateBlockClassPart(wizardInputData, blockClassName);
  let blockScope = wizardInputData.scope === 'frontend' ? `Block` : 'Block/Adminhtml';

  if (blockPath) {
    blockScope = `${blockScope}/${blockPath}`;
  }

  const blockClassUri = vscode.Uri.joinPath(moduleDirectory, `${blockScope}/${blockClassName}.php`);

  await writeFile(blockClassUri, blockClass);

  return blockClassUri;
}

async function generateBlockLayoutHandle(
  wizardInputData: BlockWizardBlockData | BlockWizardLayoutHandleData,
  blockClassName: string,
  moduleDirectory: vscode.Uri
) {
  if (wizardInputData.referenceHandle) {
    // Generate view/scope/layout/layout_handle_name.xml
    const layoutHandleUri = vscode.Uri.joinPath(
      moduleDirectory,
      `view/${wizardInputData.scope}/layout/${wizardInputData.layoutHandle}.xml`
    );

    const blockTemplateName = snakeCase(wizardInputData.blockName);
    const eventsXml = await generateBlockLayoutHandlePart(
      wizardInputData,
      moduleDirectory,
      blockClassName
    );

    await writeFile(layoutHandleUri, eventsXml);

    // Generate block template
    const template = await generateBlockLayoutTemplatePart(wizardInputData.module, blockClassName);

    await writeFile(
      vscode.Uri.joinPath(
        moduleDirectory,
        `view/${wizardInputData.scope}/templates/${blockTemplateName}.phtml`
      ),
      template
    );
  }
}

function getBlockClassName(wizardInputData: BlockWizardBlockData | BlockWizardLayoutHandleData) {
  const blockParts = wizardInputData.blockName.split('/');

  let blockName = blockParts.pop() as string;
  blockName = blockName.replace('Block', '');
  blockName = `${capitalize(blockName)}Block`;

  return {
    blockClassName: blockName,
    blockPath: blockParts.join('/'),
  };
}
