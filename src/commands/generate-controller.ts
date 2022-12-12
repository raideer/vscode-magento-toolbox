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
import { generateClassParameter } from 'generators/generateClassParameter';

interface ControllerWizardData {
  module: string;
  frontName: string;
  actionPath: string;
  actionName: string;
  scope: string;
  method: string;
  inheritAction: boolean;
  generateTemplate: boolean;
}

function getMethodClass(method: string) {
  switch (method) {
    case 'POST':
      return 'HttpPostActionInterface';
    case 'DELETE':
      return 'HttpDeleteActionInterface';
    case 'PUT':
      return 'HttpPutActionInterface';
    default:
      return 'HttpGetActionInterface';
  }
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
      {
        id: 'generateTemplate',
        label: 'Generate a block and a template',
        type: WizardInput.Checkbox,
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

  const actionPath = capitalize(data.actionPath);
  const actionName = capitalize(data.actionName);
  const methodClass = getMethodClass(data.method);
  const dependencies = [
    `Magento\\Framework\\App\\Action\\${methodClass}`,
    `Magento\\Framework\\App\\ResponseInterface`,
    `Magento\\Framework\\Controller\\ResultInterface`,
  ];

  if (data.inheritAction) {
    dependencies.push(`\\Magento\\Framework\\App\\Action\\Action`);
    dependencies.push(`\\Magento\\Framework\\App\\Action\\Context`);
  }

  let classInner = '';
  let executeFunctionInner = `// TODO: Implement action`;

  if (data.generateTemplate) {
    const constructorParams = [];
    const constructorData = [];

    const pageResultFactoryParameter = await generateClassParameter({
      description: null,
      type: 'PageFactory',
      visibility: 'private',
      name: 'resultPageFactory',
    });

    classInner += pageResultFactoryParameter;
    classInner += '\n\n';

    if (data.inheritAction) {
      constructorParams.push({
        name: 'context',
        type: 'Context',
      });
      constructorData.push('parent::__construct($context);');
    }

    constructorParams.push({
      name: 'resultPageFactory',
      type: 'PageFactory',
    });
    constructorData.push('$this->resultPageFactory = $resultPageFactory;');

    const constructorFunction = await generateFunction({
      name: '__construct',
      visibility: 'public',
      description: 'Constructor',
      params: constructorParams,
      docParams: constructorParams,
      data: indentString(constructorData.join('\n'), 4),
      returnType: 'ResultInterface|ResponseInterface',
    });

    classInner += constructorFunction;
    classInner += '\n\n';
  }

  if (data.generateTemplate) {
    executeFunctionInner = `return $this->resultPageFactory->create();`;
  }

  const executeFunction = await generateFunction({
    name: 'execute',
    visibility: 'public',
    description: 'Execute action based on request and return result',
    params: [],
    docParams: [],
    data: indentString(executeFunctionInner, 4),
    returnType: 'ResultInterface|ResponseInterface',
  });

  classInner += executeFunction;

  const controllerClass = await generateClass({
    namespace: `${vendor}\\${module}\\Controller\\${actionPath}`,
    dependencies,
    className: actionName,
    classExtends: data.inheritAction ? `Action` : null,
    classImplements: methodClass,
    data: indentString(classInner, 4),
    license: null,
  });

  await vscode.workspace.fs.writeFile(
    vscode.Uri.joinPath(moduleDirectory, `Controller/${actionPath}/${actionName}.php`),
    Buffer.from(controllerClass, 'utf-8')
  );

  if (data.generateTemplate) {
    // await generateBlockFiles(appCodeUri, {
    //   module,
    // })
  }

  vscode.commands.executeCommand('workbench.files.action.refreshFilesExplorer');
}
