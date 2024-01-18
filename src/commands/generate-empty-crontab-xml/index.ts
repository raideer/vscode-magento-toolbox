import * as vscode from 'vscode';
import { resolveUriModule } from 'utils/magento';
import { fileExists, openFile, refreshFileExplorer, writeFile } from 'utils/vscode';
import { getWorkspaceIndex } from 'utils/extension';
import { openCrontabXmlWizard } from './wizard';
import { generateTemplate } from 'generators/template/generic';

export default async function () {
  let defaultModule: string | undefined;

  if (vscode.window.activeTextEditor?.document.uri) {
    defaultModule = await resolveUriModule(vscode.window.activeTextEditor.document.uri);
  }

  const workspaceIndex = getWorkspaceIndex();

  const appCodeUri = workspaceIndex.modules.appCode!;
  const modules = workspaceIndex.modules.getModuleList('app/code');

  const wizardInputData = await openCrontabXmlWizard(modules, defaultModule);

  const [vendor, module] = wizardInputData.module.split('_');
  const moduleDirectory = vscode.Uri.joinPath(appCodeUri, `${vendor}/${module}`);

  const crontabXml = await generateTemplate('crontab-xml');
  const crontabXmlUri = vscode.Uri.joinPath(moduleDirectory, `etc/crontab.xml`);

  const exists = await fileExists(crontabXmlUri);

  if (exists) {
    vscode.window.showErrorMessage(`File already exists: ${crontabXmlUri.fsPath}`);
    return;
  }

  await writeFile(crontabXmlUri, crontabXml);
  refreshFileExplorer();
  await openFile(crontabXmlUri);
}
