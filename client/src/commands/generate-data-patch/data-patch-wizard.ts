import { WizardGenerator } from 'base/wizard';
import { first } from 'lodash-es';
import { WizardField, WizardInput } from 'types/wizard';

export interface DataPatchWizardData {
  module: string;
  patchName: string;
  revertable: boolean;
}

export const openDataPatchWizard = async (modules: string[], initialModule?: string) => {
  const wizard = new WizardGenerator();
  wizard.setTitle('Generate a new data patch');

  const fields: WizardField[] = [
    {
      id: 'module',
      label: 'Module*',
      type: WizardInput.Select,
      options: modules.map((module) => ({ label: module, value: module })),
      initialValue: initialModule ?? first(modules),
    },
    {
      id: 'patchName',
      label: 'Patch name*',
      placeholder: 'eg. MigrateCustomerOrders',
      type: WizardInput.Text,
    },
    {
      id: 'revertable',
      label: 'Revertable',
      type: WizardInput.Checkbox,
    },
  ];

  wizard.setFields(fields);
  wizard.setValidation({
    module: 'required',
    patchName: 'required',
  });

  return wizard.open<DataPatchWizardData>();
};
