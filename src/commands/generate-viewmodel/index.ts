import * as vscode from 'vscode';
import { resolveLoadedModules, resolveMagentoRoot, resolveUriModule } from 'utils/magento';
import { openFile, refreshFileExplorer, writeFile } from 'utils/vscode';
import { viewModelWizard } from './viewmodel-wizard';
import { generateViewModelClass } from './parts/view-model-class';

/**
 * Generates a ViewModel class.
 *
 * File list:
 * - app/code/Vendor/Module/ViewModel/ViewModelName.php
 *
 */
export default async function () {
  const magentoRoot = await resolveMagentoRoot();

  if (!magentoRoot) {
    vscode.window.showWarningMessage(`Could not find Magento root directory.`);
    return;
  }

  let defaultModule: string | undefined;

  if (vscode.window.activeTextEditor?.document.uri) {
    defaultModule = await resolveUriModule(vscode.window.activeTextEditor.document.uri);
  }

  const appCodeUri = vscode.Uri.joinPath(magentoRoot, 'app/code');
  const modules = await resolveLoadedModules(appCodeUri);

  // Open ViewModel wizard
  const data = await viewModelWizard(modules, defaultModule);

  const [vendor, module] = data.module.split('_');
  const moduleDirectory = vscode.Uri.joinPath(appCodeUri, `${vendor}/${module}`);

  // Generate ViewModel class
  const viewModelClass = await generateViewModelClass(data);

  const path = vscode.Uri.joinPath(moduleDirectory, `${data.directory}/${data.name}.php`);

  await writeFile(path, viewModelClass);

  vscode.window.showInformationMessage(`Generated a ViewModel: ${data.name}`);
  refreshFileExplorer();
  openFile(path);
}
