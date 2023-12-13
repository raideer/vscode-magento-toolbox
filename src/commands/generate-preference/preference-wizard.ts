import { first } from 'lodash-es';
import { WizardInput } from 'types/wizard';
import { openWizard } from 'base/wizard';
import { ExtensionContext } from 'vscode';

export interface PreferenceWizardData {
  module: string;
  name: string;
  scope: string;
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
      {
        id: 'scope',
        label: 'Scope',
        type: WizardInput.Select,
        options: [
          {
            label: 'All',
            value: 'all',
          },
          {
            label: 'Frontend',
            value: 'frontend',
          },
          {
            label: 'Backend',
            value: 'adminhtml',
          },
          {
            label: 'Webapi',
            value: 'webapi_rest',
          },
          {
            label: 'GraphQL',
            value: 'graphql',
          },
        ],
        initialValue: 'all',
      },
    ],
    validation: {
      module: 'required',
      name: 'required',
      scope: 'required',
    },
  });

  return data;
};
