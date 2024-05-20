import * as vscode from 'vscode';
import { resolveUriModule } from 'utils/magento';
import { fileExists, openFile, refreshFileExplorer, writeFile } from 'utils/vscode';
import { getWorkspaceIndex } from 'utils/extension';
import { generateTemplate } from 'generators/template/generic';
import { openConfigXmlWizard } from './wizard';

export default async function () {
  let defaultModule: string | undefined;

  if (vscode.window.activeTextEditor?.document.uri) {
    defaultModule = await resolveUriModule(vscode.window.activeTextEditor.document.uri);
  }

  const workspaceIndex = getWorkspaceIndex();

  const appCodeUri = workspaceIndex.modules.appCode!;
  const modules = workspaceIndex.modules.getModuleList('app/code');

  const wizardInputData = await openConfigXmlWizard(modules, defaultModule);

  const [vendor, module] = wizardInputData.module.split('_');
  const moduleDirectory = vscode.Uri.joinPath(appCodeUri, `${vendor}/${module}`);

  const configXml = await generateTemplate('config-xml');
  const configXmlUri = vscode.Uri.joinPath(moduleDirectory, 'etc/config.xml');

  const exists = await fileExists(configXmlUri);

  if (exists) {
    vscode.window.showErrorMessage(`File already exists: ${configXmlUri.fsPath}`);
    return;
  }

  await writeFile(configXmlUri, configXml);
  refreshFileExplorer();
  await openFile(configXmlUri);
  vscode.commands.executeCommand('magento-toolbox.indexWorkspace');
}
