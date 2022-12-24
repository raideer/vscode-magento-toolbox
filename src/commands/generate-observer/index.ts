import * as vscode from 'vscode';
import { resolveLoadedModules, resolveMagentoRoot } from 'utils/magento';
import { observerWizard } from './observer-wizard';
import { generateObserverEvents } from './generate-observer-events';
import { generateObserverClass } from './generate-observer-class';

export default async function (context: vscode.ExtensionContext) {
  const magentoRoot = await resolveMagentoRoot(context);

  if (!magentoRoot) {
    vscode.window.showWarningMessage(`Could not find Magento root directory.`);
    return;
  }

  const appCodeUri = vscode.Uri.joinPath(magentoRoot, 'app/code');
  const modules = await resolveLoadedModules(appCodeUri);

  // Open observer wizard
  const data = await observerWizard(context, modules);

  const [vendor, module] = data.module.split('_');
  const moduleDirectory = vscode.Uri.joinPath(appCodeUri, `${vendor}/${module}`);

  // Generate events.xml
  const eventsXml = await generateObserverEvents(data, appCodeUri);
  const configLocation = data.scope === 'all' ? 'etc/events.xml' : `etc/${data.scope}/events.xml`;
  await vscode.workspace.fs.writeFile(
    vscode.Uri.joinPath(moduleDirectory, configLocation),
    Buffer.from(eventsXml, 'utf-8')
  );

  // Generate Observer class
  const observerClass = await generateObserverClass(data);
  await vscode.workspace.fs.writeFile(
    vscode.Uri.joinPath(moduleDirectory, `Observer/${data.observerName}.php`),
    Buffer.from(observerClass, 'utf-8')
  );

  vscode.window.showInformationMessage(`Generated an Observer: ${data.observerName}`);
  vscode.commands.executeCommand('workbench.files.action.refreshFilesExplorer');
}