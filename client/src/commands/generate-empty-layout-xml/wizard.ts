import { WizardGenerator } from 'base/wizard';
import { first } from 'lodash-es';
import { WizardField, WizardInput } from 'types/wizard';

export interface LayoutXmlWizardData {
  module: string;
  area: string;
  layoutName: string;
}

export const openLayoutXmlWizard = async (modules: string[], initialModule?: string) => {
  const wizard = new WizardGenerator();
  wizard.setTitle('Generate layout.xml');

  const fields: WizardField[] = [
    {
      id: 'module',
      label: 'Module*',
      type: WizardInput.Select,
      options: modules.map((module) => ({ label: module, value: module })),
      initialValue: initialModule ?? first(modules),
    },
    {
      id: 'area',
      label: 'Area',
      type: WizardInput.Select,
      initialValue: 'adminhtml',
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
      id: 'layoutName',
      label: 'Layout name*',
      placeholder: 'eg. checkout_index_index',
      type: WizardInput.Text,
    },
  ];

  wizard.setFields(fields);
  wizard.setValidation({
    module: 'required',
    area: 'required',
    layoutName: 'required',
  });

  return wizard.open<LayoutXmlWizardData>();
};
