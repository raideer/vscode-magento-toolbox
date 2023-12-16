import { WizardGenerator } from 'base/wizard';
import { first } from 'lodash-es';
import { IWizardField, WizardInput } from 'types/wizard';
import { ExtensionContext } from 'vscode';

export interface IViewModelWizardBlockData {
  module: string;
  name: string;
  directory: string;
  scope: string;
}

export const viewModelWizard = async (
  context: ExtensionContext,
  modules: string[],
  initialModule?: string
) => {
  const wizard = new WizardGenerator(context);
  wizard.setTitle('Generate a new View Model');
  wizard.setDescription('Create a new View Model class.');

  const fields: IWizardField[] = [
    {
      id: 'module',
      label: 'Module*',
      type: WizardInput.Select,
      options: modules.map((module) => ({ label: module, value: module })),
      initialValue: initialModule ?? first(modules),
    },
    {
      id: 'name',
      label: 'ViewModel name*',
      placeholder: 'eg. ExampleViewModel',
      type: WizardInput.Text,
    },
    {
      id: 'directory',
      label: 'Directory*',
      initialValue: 'ViewModel',
      type: WizardInput.Text,
    },
  ];

  wizard.setFields(fields);
  wizard.setValidation({
    module: 'required',
    name: 'required',
    directory: 'required',
  });

  return wizard.open();
};
