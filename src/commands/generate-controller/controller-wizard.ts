import { openWizard } from 'base/wizard';
import { first } from 'lodash-es';
import { WizardInput } from 'types/wizard';

export interface IControllerWizardData {
  module: string;
  frontName: string;
  actionPath: string;
  actionName: string;
  scope: string;
  method: string;
  inheritAction: boolean;
  generateTemplate: boolean;
}

export const controllerWizard = async (modules: string[], initialModule?: string) => {
  const data = await openWizard<IControllerWizardData>({
    title: 'Generate a new controller',
    fields: [
      {
        id: 'module',
        label: 'Module*',
        type: WizardInput.Select,
        options: modules.map((module) => ({ label: module, value: module })),
        initialValue: initialModule ?? first(modules),
      },
      {
        id: 'frontName',
        label: 'Front name',
        placeholder: 'module',
        type: WizardInput.Text,
        description: [
          'Defines the url structure for the controller. Eg. /{frontName}/{controllerName}/{actionName}',
          'Will use module name if left empty',
        ],
      },
      {
        id: 'actionPath',
        label: 'Action path*',
        placeholder: 'index',
        initialValue: 'index',
        type: WizardInput.Text,
      },
      {
        id: 'actionName',
        label: 'Action name*',
        placeholder: 'Index',
        initialValue: 'Index',
        type: WizardInput.Text,
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
            label: 'Backend',
            value: 'adminhtml',
          },
        ],
      },
      {
        id: 'method',
        label: 'HTTP Method',
        type: WizardInput.Select,
        initialValue: 'GET',
        options: [
          {
            label: 'GET',
            value: 'GET',
          },
          {
            label: 'POST',
            value: 'POST',
          },
          {
            label: 'DELETE',
            value: 'DELETE',
          },
          {
            label: 'PUT',
            value: 'PUT',
          },
        ],
      },
      {
        id: 'inheritAction',
        label: 'Inherit Action class',
        type: WizardInput.Checkbox,
        description: ['Deprecated since 100.0.2'],
      },
      {
        id: 'generateTemplate',
        label: 'Generate a block and a template',
        type: WizardInput.Checkbox,
      },
    ],
    validation: {
      module: 'required',
      actionPath: 'required',
      actionName: 'required',
    },
  });

  return data;
};
