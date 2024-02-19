import * as vscode from 'vscode';
import { resolveUriModule } from 'utils/magento';
import { fileExists, openFile, refreshFileExplorer, writeFile } from 'utils/vscode';
import { getWorkspaceIndex } from 'utils/extension';
import { generateTemplate } from 'generators/template/generic';
import { openDiWizard } from './wizard';

export default async function () {
  let defaultModule: string | undefined;

  if (vscode.window.activeTextEditor?.document.uri) {
    defaultModule = await resolveUriModule(vscode.window.activeTextEditor.document.uri);
  }

  const workspaceIndex = getWorkspaceIndex();

  const appCodeUri = workspaceIndex.modules.appCode!;
  const modules = workspaceIndex.modules.getModuleList('app/code');

  const wizardInputData = await openDiWizard(modules, defaultModule);

  const [vendor, module] = wizardInputData.module.split('_');
  const moduleDirectory = vscode.Uri.joinPath(appCodeUri, `${vendor}/${module}`);

  const diXml = await generateTemplate('di-xml');
  const diXmlUri = vscode.Uri.joinPath(moduleDirectory, 'etc/di.xml');

  const exists = await fileExists(diXmlUri);

  if (exists) {
    vscode.window.showErrorMessage(`File already exists: ${diXmlUri.fsPath}`);
    return;
  }

  await writeFile(diXmlUri, diXml);
  refreshFileExplorer();
  await openFile(diXmlUri);
}
