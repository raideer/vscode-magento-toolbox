import { camelCase, first, upperFirst } from 'lodash-es';
import { WizardInput } from 'types/wizard';
import { openWizard } from 'utils/vscode';
import { ExtensionContext } from 'vscode';

export interface PluginWizardData {
  module: string;
  name: string;
  type: string;
  scope: string;
}

export const pluginWizard = async (
  context: ExtensionContext,
  modules: string[],
  className: string
): Promise<PluginWizardData> => {
  const data: PluginWizardData = await openWizard(context, {
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
    ],
    validation: {
      module: 'required',
      name: 'required',
      type: 'required',
      scope: 'required',
    },
  });

  return data;
};
