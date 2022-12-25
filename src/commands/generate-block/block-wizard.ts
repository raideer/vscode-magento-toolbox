import { first } from 'lodash-es';
import { WizardInput } from 'types/wizard';
import { openWizard } from 'utils/vscode';
import { ExtensionContext } from 'vscode';

interface BlockWizardBaseData {
  module: string;
  blockName: string;
  referenceHandle: boolean;
  scope: string;
}

export interface BlockWizardBlockData extends BlockWizardBaseData {
  referenceHandle: false;
}

export interface BlockWizardLayoutHandleData extends BlockWizardBaseData {
  referenceHandle: true;
  layoutHandle: string;
  referenceType: string;
  referenceName: string;
}

export const blockWizard = async (context: ExtensionContext, modules: string[]) => {
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
        id: 'scope',
        label: 'Scope',
        type: WizardInput.Select,
        initialValue: 'frontend',
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

  return data;
};
