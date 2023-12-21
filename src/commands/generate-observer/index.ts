import * as vscode from 'vscode';
import { observerWizard } from './observer-wizard';
import { generateObserverEvents } from './parts/observer-events';
import { generateObserverClass } from './parts/observer-class';
import { isString } from 'lodash-es';
import { getWorkspaceIndex } from 'utils/extension';

export default async function (...args: any[]) {
  const workspaceIndex = getWorkspaceIndex();
  const appCodeUri = workspaceIndex.modules.appCode!;
  const modules = workspaceIndex.modules.getModuleList('app/code');

  const eventName = args.length > 0 && isString(args[0]) ? args[0] : undefined;

  // Open observer wizard
  const data = await observerWizard(modules, eventName);

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
  const observerClassPath = vscode.Uri.joinPath(
    moduleDirectory,
    `Observer/${data.observerName}.php`
  );
  await vscode.workspace.fs.writeFile(observerClassPath, Buffer.from(observerClass, 'utf-8'));

  vscode.window.showInformationMessage(`Generated an Observer: ${data.observerName}`);
  vscode.commands.executeCommand('workbench.files.action.refreshFilesExplorer');

  await vscode.workspace.openTextDocument(observerClassPath).then((doc) => {
    vscode.window.showTextDocument(doc);
  });
}
