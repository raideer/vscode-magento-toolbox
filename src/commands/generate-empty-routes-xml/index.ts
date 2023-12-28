import * as vscode from 'vscode';
import { resolveUriModule } from 'utils/magento';
import { fileExists, openFile, refreshFileExplorer, writeFile } from 'utils/vscode';
import { getWorkspaceIndex } from 'utils/extension';
import { openRoutesXmlWizard } from './wizard';
import { generateRoutesXml } from 'generators/generateRoutesXml';

export default async function () {
  let defaultModule: string | undefined;

  if (vscode.window.activeTextEditor?.document.uri) {
    defaultModule = await resolveUriModule(vscode.window.activeTextEditor.document.uri);
  }

  const workspaceIndex = getWorkspaceIndex();

  const appCodeUri = workspaceIndex.modules.appCode!;
  const modules = workspaceIndex.modules.getModuleList('app/code');

  const wizardInputData = await openRoutesXmlWizard(modules, defaultModule);

  const [vendor, module] = wizardInputData.module.split('_');
  const moduleDirectory = vscode.Uri.joinPath(appCodeUri, `${vendor}/${module}`);

  const routesXml = generateRoutesXml({
    routeName: wizardInputData.routeName,
    frontName: wizardInputData.frontName,
    module: wizardInputData.module,
    routerId: wizardInputData.area === 'adminhtml' ? 'admin' : 'standard',
  });

  const routesXmlUri = vscode.Uri.joinPath(
    moduleDirectory,
    `etc/${wizardInputData.area}/routes.xml`
  );

  const exists = await fileExists(routesXmlUri);

  if (exists) {
    vscode.window.showErrorMessage(`File already exists: ${routesXmlUri.fsPath}`);
    return;
  }

  await writeFile(routesXmlUri, routesXml);
  refreshFileExplorer();
  await openFile(routesXmlUri);
}
