import * as vscode from 'vscode';
import { openWizard } from 'utils/vscode';
import { resolveLoadedModules, resolveMagentoRoot } from 'utils/magento';
import { WizardInput } from 'types';
import { first, snakeCase } from 'lodash-es';
import { workspace } from 'vscode';
import { parseXml } from 'utils/xml';
import { generateClass } from 'generators/generateClass';
import { generateEventsXml } from 'generators/generateEventsXml';
import { generateFunction } from 'generators/generateFunction';
import indentString from 'indent-string';

export default async function (context: vscode.ExtensionContext) {
  const magentoRoot = await resolveMagentoRoot(context);

  if (!magentoRoot) {
    vscode.window.showWarningMessage(`Could not find Magento root directory.`);
    return;
  }

  const appCodeUri = vscode.Uri.joinPath(magentoRoot, 'app/code');

  const modules = await resolveLoadedModules(appCodeUri);

  const data: any = await openWizard(context, {
    title: 'Generate a new observer',
    fields: [
      {
        id: 'module',
        label: 'Module*',
        type: WizardInput.Select,
        options: modules.map((module) => ({ label: module, value: module })),
        initialValue: first(modules),
      },
      {
        id: 'eventName',
        label: 'Event*',
        placeholder: 'event_name',
        type: WizardInput.Text,
        description: 'The event name to observe',
      },
      {
        id: 'observerName',
        label: 'Observer name*',
        placeholder: 'eg. ProductSaveObserver',
        type: WizardInput.Text,
      },
      {
        id: 'scope',
        label: 'Scope',
        type: WizardInput.Select,
        options: [
          {
            label: 'All',
            value: 'all',
          },
          {
            label: 'Frontend',
            value: 'frontend',
          },
          {
            label: 'Backend',
            value: 'adminhtml',
          },
          {
            label: 'Webapi',
            value: 'webapi_rest',
          },
          {
            label: 'GraphQL',
            value: 'graphql',
          },
        ],
      },
    ],
    validation: {
      module: 'required',
      eventName: 'required',
      observerName: 'required',
    },
  });

  const [vendor, module] = data.module.split('_');

  const moduleDirectory = vscode.Uri.joinPath(appCodeUri, `${vendor}/${module}`);

  const variables = {
    eventName: data.eventName,
    observerName: snakeCase(data.observerName),
    observerInstance: `/${vendor}/${module}/Observer/${data.observerName}`,
  };

  const configLocation = data.scope === 'all' ? 'etc/events.xml' : `etc/${data.scope}/events.xml`;

  let existing: any = {};

  try {
    existing = await workspace.fs
      .readFile(vscode.Uri.joinPath(moduleDirectory, configLocation))
      .then((buffer) => parseXml(buffer.toString()));
  } catch (e) {
    // File does not exist
  }

  const eventsXml = generateEventsXml(variables, existing);

  await vscode.workspace.fs.writeFile(
    vscode.Uri.joinPath(moduleDirectory, configLocation),
    Buffer.from(eventsXml, 'utf-8')
  );

  const observerFunction = await generateFunction({
    name: 'execute',
    visibility: 'public',
    description: 'Execute observer',
    params: [
      {
        name: 'observer',
        type: 'Observer',
      },
    ],
    docParams: [
      {
        name: 'observer',
        type: '\\Magento\\Framework\\Event\\Observer',
      },
    ],
    data: '    // Your code',
    returnType: 'void',
  });

  const observerClass = await generateClass({
    namespace: `${vendor}\\${module}\\Observer`,
    dependencies: [`Magento\\Framework\\Event\\Observer`],
    className: data.observerName,
    classExtends: null,
    classImplements: `\\Magento\\Framework\\Event\\ObserverInterface`,
    data: indentString(observerFunction, 4),
    license: null,
  });

  await vscode.workspace.fs.writeFile(
    vscode.Uri.joinPath(moduleDirectory, `Observer/${data.observerName}.php`),
    Buffer.from(observerClass, 'utf-8')
  );

  vscode.commands.executeCommand('workbench.files.action.refreshFilesExplorer');
}
