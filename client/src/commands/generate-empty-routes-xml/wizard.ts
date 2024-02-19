import { WizardGenerator } from 'base/wizard';
import { first } from 'lodash-es';
import { WizardField, WizardInput } from 'types/wizard';

export interface RoutesXmlWizardData {
  routeName: string;
  frontName: string;
  module: string;
  area: string;
}

export const openRoutesXmlWizard = async (modules: string[], initialModule?: string) => {
  const wizard = new WizardGenerator();
  wizard.setTitle('Generate routes.xml');

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
      id: 'routeName',
      label: 'Route name*',
      type: WizardInput.Text,
      description: ['route "id" attribute'],
    },
    {
      id: 'frontName',
      label: 'Front name*',
      type: WizardInput.Text,
    },
  ];

  wizard.setFields(fields);
  wizard.setValidation({
    module: 'required',
    area: 'required',
    routeName: 'required',
    frontName: 'required',
  });

  return wizard.open<RoutesXmlWizardData>();
};
