import { first } from 'lodash-es';
import { WizardInput } from 'types/wizard';
import { openWizard } from 'base/wizard';

export interface PreferenceWizardDataClass {
  module: string;
  createClass: true;
  scope: string;
  className: string;
}

interface PreferenceWizardDataType {
  module: string;
  createClass: false;
  scope: string;
  type: string;
}

export type PreferenceWizardData = PreferenceWizardDataClass | PreferenceWizardDataType;

export const preferenceWizard = async (
  modules: string[],
  className?: string
): Promise<PreferenceWizardData> => {
  const data: PreferenceWizardData = await openWizard({
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
        id: 'createClass',
        label: 'Generate preference class?',
        type: WizardInput.Checkbox,
        initialValue: false,
      },
      {
        dependsOn: {
          field: 'createClass',
          value: false,
        },
        id: 'type',
        label: 'Preference type*',
        type: WizardInput.Text,
        placeholder: 'Vendor\\Module\\Class',
      },
      {
        dependsOn: {
          field: 'createClass',
          value: true,
        },
        id: 'className',
        label: 'Class name*',
        type: WizardInput.Text,
        placeholder: 'MyClass',
        initialValue: className,
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
      scope: 'required',
      type: [{ required_if: ['createClass', false] }],
      className: [{ required_if: ['createClass', true] }],
    },
  });

  return data;
};
