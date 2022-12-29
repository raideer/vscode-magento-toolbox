import { License, WizardInput } from 'types/wizard';
import { openWizard } from 'utils/vscode';
import { ExtensionContext } from 'vscode';

interface ModuleWizardBaseData {
  vendor: string;
  module: string;
  sequence: string[];
  license: License;
  version: string;
  copyright: string;
  composer: boolean;
}

interface ModuleWizardData extends ModuleWizardBaseData {
  composer: false;
}

interface ModuleWizardComposerData extends ModuleWizardBaseData {
  composer: true;
  composerName: string;
  composerDescription: string;
}

export const moduleWizard = async (context: ExtensionContext, modules: string[]) => {
  const data: ModuleWizardData | ModuleWizardComposerData = await openWizard(context, {
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
        options: modules.map((module) => ({ label: module, value: module })),
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
        id: 'version',
        label: 'Version',
        initialValue: '1.0.0',
        type: WizardInput.Text,
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

  return data;
};
