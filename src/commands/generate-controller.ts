import * as vscode from 'vscode';
import { openWizard } from 'utils/vscode';
import { resolveLoadedModules, resolveMagentoRoot } from 'utils/magento';
import { WizardInput } from 'types';
import { capitalize, first, snakeCase } from 'lodash-es';
import { workspace } from 'vscode';
import { parseXml } from 'utils/xml';
import { generateClass } from 'generators/generateClass';
import { generateEventsXml } from 'generators/generateEventsXml';
import { generateFunction } from 'generators/generateFunction';
import indentString from 'indent-string';
import { generateBlockLayoutHandleXml } from 'generators/generateBlockLayoutHandleXml';
import { generateBlockTemplate } from 'generators/generateBlockTemplate';

interface ControllerWizardData {
  module: string;
  frontName: string;
  actionPath: string;
  actionName: string;
  scope: string;
  method: string;
  inheritAction: boolean;
}

export default async function (context: vscode.ExtensionContext) {
  const magentoRoot = await resolveMagentoRoot(context);

  if (!magentoRoot) {
    vscode.window.showWarningMessage(`Could not find Magento root directory.`);
    return;
  }

  const appCodeUri = vscode.Uri.joinPath(magentoRoot, 'app/code');

  const modules = await resolveLoadedModules(appCodeUri);

  const data = await openWizard<ControllerWizardData>(context, {
    title: 'Generate a new controller',
    fields: [
      {
        id: 'module',
        label: 'Module*',
        type: WizardInput.Select,
        options: modules.map((module) => ({ label: module, value: module })),
        initialValue: first(modules),
      },
      {
        id: 'frontName',
        label: 'Front name',
        placeholder: 'module',
        type: WizardInput.Text,
        description: [
          'Defines the url structure for the controller. Eg. /{frontName}/{controllerName}/{actionName}',
          'Will use module name if left empty',
        ],
      },
      {
        id: 'actionPath',
        label: 'Action path*',
        placeholder: 'index',
        initialValue: 'index',
        type: WizardInput.Text,
      },
      {
        id: 'actionName',
        label: 'Action name*',
        placeholder: 'Index',
        initialValue: 'Index',
        type: WizardInput.Text,
      },
      {
        id: 'scope',
        label: 'Scope',
        type: WizardInput.Select,
        options: [
          {
            label: 'Frontend',
            value: 'frontend',
          },
          {
            label: 'Backend',
            value: 'adminhtml',
          },
        ],
      },
      {
        id: 'method',
        label: 'HTTP Method',
        type: WizardInput.Select,
        options: [
          {
            label: 'GET',
            value: 'GET',
          },
          {
            label: 'POST',
            value: 'POST',
          },
          {
            label: 'DELETE',
            value: 'DELETE',
          },
          {
            label: 'PUT',
            value: 'PUT',
          },
        ],
      },
      {
        id: 'inheritAction',
        label: 'Inherit Action class',
        type: WizardInput.Checkbox,
        description: ['Deprecated since 100.0.2'],
      },
    ],
    validation: {
      module: 'required',
      actionPath: 'required',
      actionName: 'required',
    },
  });

  const [vendor, module] = data.module.split('_');

  const moduleDirectory = vscode.Uri.joinPath(appCodeUri, `${vendor}/${module}`);

  vscode.commands.executeCommand('workbench.files.action.refreshFilesExplorer');
}
