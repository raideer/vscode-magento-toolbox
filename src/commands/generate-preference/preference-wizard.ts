import { first } from 'lodash-es';
import { WizardInput } from 'types/wizard';
import { openWizard } from 'base/wizard';
import { ExtensionContext } from 'vscode';

export interface PreferenceWizardData {
  module: string;
  type: string;
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
        id: 'type',
        label: 'Preference type*',
        type: WizardInput.Text,
        placeholder: 'Vendor\\Module\\Class',
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
      type: 'required',
      scope: 'required',
    },
  });

  return data;
};
