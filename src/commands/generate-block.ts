import * as vscode from 'vscode';
import { openWizard } from 'utils/vscode';
import { resolveLoadedModules, resolveMagentoRoot } from 'utils/magento';
import { WizardInput } from 'types';
import { capitalize, first, snakeCase } from 'lodash-es';
import { workspace } from 'vscode';
import { parseXml } from 'utils/xml';
import { generateClass } from 'generators/generateClass';
import { generateBlockLayoutHandleXml } from 'generators/generateBlockLayoutHandleXml';
import { generateBlockTemplate } from 'generators/generateBlockTemplate';

interface BlockWizardBaseData {
  module: string;
  blockName: string;
  referenceHandle: boolean;
}

interface BlockWizardBlockData extends BlockWizardBaseData {
  referenceHandle: false;
}

interface BlockWizardLayoutHandleData extends BlockWizardBaseData {
  referenceHandle: true;
  layoutHandle: string;
  scope: string;
  referenceType: string;
  referenceName: string;
}

export async function generateBlockFiles(
  appCodeUri: vscode.Uri,
  data: BlockWizardBlockData | BlockWizardLayoutHandleData
) {
  const [vendor, module] = data.module.split('_');

  const moduleDirectory = vscode.Uri.joinPath(appCodeUri, `${vendor}/${module}`);

  const blockName = `${capitalize(data.blockName.replace('Block', ''))}Block`;

  const blockClass = await generateClass({
    namespace: `${vendor}\\${module}\\Block`,
    dependencies: [`Magento\\Framework\\View\\Element\\Template`],
    className: blockName,
    classExtends: 'Template',
    classImplements: null,
    data: '',
    license: null,
  });

  await vscode.workspace.fs.writeFile(
    vscode.Uri.joinPath(moduleDirectory, `Block/${blockName}.php`),
    Buffer.from(blockClass, 'utf-8')
  );

  // Generate layout handle

  if (data.referenceHandle) {
    const blockTemplateName = snakeCase(data.blockName);
    const blockClassNamespace = `${vendor}\\${module}\\Block\\${blockName}`;

    // Generate view/scope/layout/layout_handle_name.xml
    const layoutHandleUri = vscode.Uri.joinPath(
      moduleDirectory,
      `view/${data.scope}/layout/${data.layoutHandle}.xml`
    );

    let existing: any = {};

    try {
      existing = await workspace.fs
        .readFile(layoutHandleUri)
        .then((buffer) => parseXml(buffer.toString()));
    } catch (e) {
      // File does not exist
    }

    const eventsXml = generateBlockLayoutHandleXml(
      {
        referenceName: data.referenceName,
        referenceType: `reference${capitalize(data.referenceType)}`,
        blockClass: blockClassNamespace,
        blockName: blockTemplateName,
        blockTemplate: `${vendor}_${module}::${blockTemplateName}.phtml`,
      },
      existing
    );

    await vscode.workspace.fs.writeFile(layoutHandleUri, Buffer.from(eventsXml, 'utf-8'));

    // Generate block template
    const template = await generateBlockTemplate({
      namespace: blockClassNamespace,
      data: `    Hello from ${blockName}`,
    });

    await vscode.workspace.fs.writeFile(
      vscode.Uri.joinPath(
        moduleDirectory,
        `view/${data.scope}/templates/${blockTemplateName}.phtml`
      ),
      Buffer.from(template, 'utf-8')
    );
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

  const data = await openWizard<BlockWizardBlockData | BlockWizardLayoutHandleData>(context, {
    title: 'Generate a new block',
    description: 'Create a new block class and register it in the layout.',
    fields: [
      {
        id: 'module',
        label: 'Module*',
        type: WizardInput.Select,
        options: modules.map((module) => ({ label: module, value: module })),
        initialValue: first(modules),
      },
      {
        id: 'blockName',
        label: 'Block name*',
        placeholder: 'eg. Info',
        type: WizardInput.Text,
        description: ['Note: consider using a view model instead of a block if possible'],
      },
      {
        id: 'referenceHandle',
        label: 'Reference a layout handle',
        type: WizardInput.Checkbox,
      },
      {
        dependsOn: 'referenceHandle',
        id: 'layoutHandle',
        label: 'Layout handle*',
        placeholder: 'eg. checkout_index_index',
        type: WizardInput.Text,
      },
      {
        dependsOn: 'referenceHandle',
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
        dependsOn: 'referenceHandle',
        id: 'referenceType',
        label: 'Reference type',
        type: WizardInput.Select,
        options: [
          {
            label: 'Container',
            value: 'container',
          },
          {
            label: 'Block',
            value: 'block',
          },
        ],
      },
      {
        dependsOn: 'referenceHandle',
        id: 'referenceName',
        label: 'Reference name*',
        placeholder: 'eg. content',
        type: WizardInput.Text,
      },
    ],
    validation: {
      module: 'required',
      blockName: 'required',
      layoutHandle: [{ required_if: ['referenceHandle', true] }],
      referenceName: [{ required_if: ['referenceHandle', true] }],
    },
  });

  await generateBlockFiles(appCodeUri, data);

  vscode.window.showInformationMessage(`Generated a Block: ${data.blockName}`);
  vscode.commands.executeCommand('workbench.files.action.refreshFilesExplorer');
}
