import { WizardGenerator } from 'base/wizard';
import { first } from 'lodash-es';
import { WizardField, WizardInput } from 'types/wizard';

interface BlockWizardData {
  module: string;
  blockName: string;
  referenceHandle: boolean;
  scope: string;
}

export interface BlockWizardBlockData extends BlockWizardData {
  referenceHandle: false;
}

export interface BlockWizardLayoutHandleData extends BlockWizardData {
  referenceHandle: true;
  layoutHandle: string;
  referenceType: 'container' | 'block';
  referenceName: string;
}

export const openBlockWizard = async (modules: string[], initialModule?: string) => {
  const wizard = new WizardGenerator();
  wizard.setTitle('Generate a new block');
  wizard.setDescription('Create a new block class and register it in the layout.');

  const fields: WizardField[] = [
    {
      id: 'module',
      label: 'Module*',
      type: WizardInput.Select,
      options: modules.map((module) => ({ label: module, value: module })),
      initialValue: initialModule ?? first(modules),
    },
    {
      id: 'blockName',
      label: 'Block name*',
      placeholder: 'eg. Info or Order/Info',
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
          label: 'Adminhtml',
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
      dependsOn: {
        field: 'referenceHandle',
        value: true,
      },
      id: 'layoutHandle',
      label: 'Layout handle*',
      placeholder: 'eg. checkout_index_index',
      type: WizardInput.Text,
    },
    {
      dependsOn: {
        field: 'referenceHandle',
        value: true,
      },
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
      dependsOn: {
        field: 'referenceHandle',
        value: true,
      },
      id: 'referenceName',
      label: 'Reference name*',
      placeholder: 'eg. content',
      type: WizardInput.Text,
    },
  ];

  wizard.setFields(fields);
  wizard.setValidation({
    module: 'required',
    blockName: 'required',
    layoutHandle: [{ required_if: ['referenceHandle', true] }],
    referenceName: [{ required_if: ['referenceHandle', true] }],
  });

  return wizard.open<BlockWizardBlockData | BlockWizardLayoutHandleData>();
};
