import * as vscode from 'vscode';
import { Builder } from 'xml2js';
import { openWizard } from 'utils/vscode';
import { resolveLoadedModules, resolveMagentoRoot } from 'utils/magento';
import { generateModuleRegistration } from 'generators/moduleRegistration';
import { generateLicense } from 'generators/license';
import { generateComposerJson } from 'generators/composerJson';
import { WizardInput } from 'types';
import { generateModuleXml } from 'generators/moduleXml';

export default async function (context: vscode.ExtensionContext) {
  const magentoRoot = await resolveMagentoRoot(context);

  if (!magentoRoot) {
    vscode.window.showWarningMessage(`Could not find Magento root directory.`);
    return;
  }

  const appCodeUri = vscode.Uri.joinPath(magentoRoot, 'app/code');

  const loadedModules = await resolveLoadedModules(magentoRoot);

  const data: any = await openWizard(context, {
    title: 'Generate a new module',
    description: 'Generates the basic structure of a Magento2 module.',
    fields: [
      {
        id: 'vendor',
        label: 'Vendor*',
        placeholder: 'Vendor name',
        type: WizardInput.Text,
      },
      {
        id: 'module',
        label: 'Module*',
        placeholder: 'Module name',
        type: WizardInput.Text,
      },
      {
        id: 'sequence',
        label: 'Dependencies',
        type: WizardInput.Select,
        options: loadedModules.map((module) => ({ label: module, value: module })),
        multiple: true,
      },
      {
        id: 'license',
        label: 'License',
        type: WizardInput.Select,
        options: [
          {
            label: 'No license',
            value: 'none',
          },
          {
            label: 'GPL V3',
            value: 'gplv3',
          },
          {
            label: 'OSL V3',
            value: 'oslv3',
          },
          {
            label: 'MIT',
            value: 'mit',
          },
          {
            label: 'Apache2',
            value: 'apache2',
          },
        ],
      },
      {
        id: 'copyright',
        label: 'Copyright',
        placeholder: 'Copyright',
        type: WizardInput.Text,
      },
      {
        id: 'composer',
        label: 'Generate composer.json?',
        type: WizardInput.Checkbox,
      },
      {
        dependsOn: 'composer',
        id: 'composerName',
        label: 'Package name*',
        placeholder: 'module/name',
        type: WizardInput.Text,
      },
      {
        dependsOn: 'composer',
        id: 'composerDescription',
        label: 'Package description',
        type: WizardInput.Text,
      },
    ],
    validation: {
      vendor: 'required|min:1',
      module: 'required|min:1',
      composerName: [{ required_if: ['composer', true] }],
    },
    validationMessages: {
      'required_if.composerName': 'Package name is required',
    },
  });

  const moduleName = `${data.vendor}_${data.module}`;

  const moduleDirectory = vscode.Uri.joinPath(appCodeUri, `${data.vendor}/${data.module}`);

  // Generate registration.php
  const registration = await generateModuleRegistration({
    moduleName,
    license: null,
  });

  await vscode.workspace.fs.writeFile(
    vscode.Uri.joinPath(moduleDirectory, 'registration.php'),
    Buffer.from(registration, 'utf-8')
  );

  // Generate module.xml
  const moduleXml = generateModuleXml({ ...data, moduleName });

  await vscode.workspace.fs.writeFile(
    vscode.Uri.joinPath(moduleDirectory, 'etc/module.xml'),
    Buffer.from(moduleXml, 'utf-8')
  );

  // Generate LICENSE.txt
  if (data.license && data.license !== 'none') {
    const license = await generateLicense(data.license, {
      year: new Date().getFullYear(),
      copyright: data.copyright || data.vendor,
    });

    await vscode.workspace.fs.writeFile(
      vscode.Uri.joinPath(moduleDirectory, 'LICENSE.txt'),
      Buffer.from(license, 'utf-8')
    );
  }

  // Generate composer.json
  if (data.composer) {
    const json = generateComposerJson({
      vendor: data.vendor,
      module: data.module,
      name: data.composerName,
      description: data.composerDescription,
      license: data.license,
    });

    await vscode.workspace.fs.writeFile(
      vscode.Uri.joinPath(moduleDirectory, 'composer.json'),
      Buffer.from(json, 'utf-8')
    );
  }

  vscode.window.showInformationMessage(`Generated module: ${moduleName}`);
  vscode.commands.executeCommand('workbench.files.action.refreshFilesExplorer');
}
