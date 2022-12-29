import { capitalize, first } from 'lodash-es';
import { WizardInput } from 'types/wizard';
import { openWizard } from 'utils/vscode';
import { ExtensionContext } from 'vscode';

export interface PreferenceWizardData {
  module: string;
  name: string;
}

export const preferenceWizard = async (
  context: ExtensionContext,
  modules: string[]
): Promise<PreferenceWizardData> => {
  const data: PreferenceWizardData = await openWizard(context, {
    title: 'Create a new preference',
    fields: [
      {
        id: 'module',
        label: 'Module*',
        type: WizardInput.Select,
        options: modules.map((module) => ({ label: module, value: module })),
        initialValue: first(modules),
      },
      {
        id: 'name',
        label: 'Preference name*',
        type: WizardInput.Text,
      },
    ],
    validation: {
      module: 'required',
      name: 'required',
    },
  });

  return data;
};
