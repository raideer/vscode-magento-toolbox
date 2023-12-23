import * as vscode from 'vscode';
import { resolveUriModule } from 'utils/magento';
import { fileExists, openFile, refreshFileExplorer, writeFile } from 'utils/vscode';
import { getWorkspaceIndex } from 'utils/extension';
import { generateTemplate } from 'generators/template/generic';
import { openLayoutXmlWizard } from './wizard';

export default async function () {
  let defaultModule: string | undefined;

  if (vscode.window.activeTextEditor?.document.uri) {
    defaultModule = await resolveUriModule(vscode.window.activeTextEditor.document.uri);
  }

  const workspaceIndex = getWorkspaceIndex();

  const appCodeUri = workspaceIndex.modules.appCode!;
  const modules = workspaceIndex.modules.getModuleList('app/code');

  const wizardInputData = await openLayoutXmlWizard(modules, defaultModule);

  const [vendor, module] = wizardInputData.module.split('_');
  const moduleDirectory = vscode.Uri.joinPath(appCodeUri, `${vendor}/${module}`);

  const layoutXml = await generateTemplate('layout-xml');
  const layoutXmlUri = vscode.Uri.joinPath(
    moduleDirectory,
    `view/${wizardInputData.area}/layout/${wizardInputData.layoutName}.xml`
  );

  const exists = await fileExists(layoutXmlUri);

  if (exists) {
    vscode.window.showErrorMessage(`File already exists: ${layoutXmlUri.fsPath}`);
    return;
  }

  await writeFile(layoutXmlUri, layoutXml);
  refreshFileExplorer();
  await openFile(layoutXmlUri);
}
