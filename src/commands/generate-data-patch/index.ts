import * as vscode from 'vscode';
import { resolveUriModule } from 'utils/magento';
import { getWorkspaceIndex } from 'utils/extension';
import { openFile, refreshFileExplorer, writeFile } from 'utils/vscode';
import { DataPatchWizardData, openDataPatchWizard } from './data-patch-wizard';
import { generateDataPatchClassPart } from './parts/data-patch-class';

/**
 * Generates a data patch
 *
 * File list:
 * - app/code/Vendor/Module/Setup/Patch/Data/PatchName.php
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
  const wizardInputData = await openDataPatchWizard(modules, defaultModule);

  const [vendor, module] = wizardInputData.module.split('_');
  const moduleDirectory = vscode.Uri.joinPath(appCodeUri, `${vendor}/${module}`);

  const uri = await generateDataPatchClass(wizardInputData, moduleDirectory);

  vscode.window.showInformationMessage(`Generated a Data Patch: ${wizardInputData.patchName}`);
  refreshFileExplorer();
  openFile(uri);
  vscode.commands.executeCommand('magento-toolbox.indexWorkspace');
}

async function generateDataPatchClass(
  wizardInputData: DataPatchWizardData,
  moduleDirectory: vscode.Uri
) {
  const part = await generateDataPatchClassPart(wizardInputData);

  const dataPatchClassUri = vscode.Uri.joinPath(
    moduleDirectory,
    `Setup/Patch/Data/${wizardInputData.patchName}.php`
  );

  await writeFile(dataPatchClassUri, part);

  return dataPatchClassUri;
}
