import { camelCase, first, upperFirst } from 'lodash-es';
import { WizardInput } from 'types/wizard';
import { openWizard } from 'base/wizard';

export interface PluginWizardData {
  module: string;
  name: string;
  type: string;
  scope: string;
  sort_order?: number;
}

export const pluginWizard = async (
  modules: string[],
  className: string,
  methodName: string
): Promise<PluginWizardData> => {
  const data: PluginWizardData = await openWizard({
    title: 'Generate a new plugin',
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
        label: 'Plugin name*',
        type: WizardInput.Text,
        initialValue: `${upperFirst(camelCase(className))}Plugin`,
      },
      {
        id: 'method',
        label: 'Method name*',
        type: WizardInput.Readonly,
        initialValue: methodName,
      },
      {
        id: 'type',
        label: 'Plugin type',
        type: WizardInput.Select,
        options: [
          {
            label: 'Before',
            value: 'before',
          },
          {
            label: 'After',
            value: 'after',
          },
          {
            label: 'Around',
            value: 'around',
          },
        ],
        initialValue: 'before',
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
      {
        id: 'sort_order',
        label: 'Sort order',
        type: WizardInput.Number,
      },
    ],
    validation: {
      module: 'required',
      name: 'required',
      type: 'required',
      scope: 'required',
      sort_order: 'numeric',
    },
  });

  return data;
};
