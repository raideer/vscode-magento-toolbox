import * as vscode from 'vscode';
import { resolveUriModule } from 'utils/magento';
import { fileExists, openFile, refreshFileExplorer, writeFile } from 'utils/vscode';
import { getWorkspaceIndex } from 'utils/extension';
import { generateTemplate } from 'generators/template/generic';
import { openSystemXmlWizard } from './wizard';

export default async function () {
  let defaultModule: string | undefined;

  if (vscode.window.activeTextEditor?.document.uri) {
    defaultModule = await resolveUriModule(vscode.window.activeTextEditor.document.uri);
  }

  const workspaceIndex = getWorkspaceIndex();

  const appCodeUri = workspaceIndex.modules.appCode!;
  const modules = workspaceIndex.modules.getModuleList('app/code');

  const wizardInputData = await openSystemXmlWizard(modules, defaultModule);

  const [vendor, module] = wizardInputData.module.split('_');
  const moduleDirectory = vscode.Uri.joinPath(appCodeUri, `${vendor}/${module}`);

  const systemXml = await generateTemplate('system-xml');
  const systemXmlUri = vscode.Uri.joinPath(moduleDirectory, `etc/adminhtml/system.xml`);

  const exists = await fileExists(systemXmlUri);

  if (exists) {
    vscode.window.showErrorMessage(`File already exists: ${systemXmlUri.fsPath}`);
    return;
  }

  await writeFile(systemXmlUri, systemXml);
  refreshFileExplorer();
  await openFile(systemXmlUri);
}
