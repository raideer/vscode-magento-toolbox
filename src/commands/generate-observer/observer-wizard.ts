import { first } from 'lodash-es';
import { WizardInput } from 'types/wizard';
import { openWizard } from 'base/wizard';
import { ExtensionContext } from 'vscode';

export interface ObserverWizardData {
  module: string;
  eventName: string;
  observerName: string;
  scope: string;
}

export const observerWizard = async (context: ExtensionContext, modules: string[]) => {
  const data: ObserverWizardData = await openWizard(context, {
    title: 'Generate a new observer',
    fields: [
      {
        id: 'module',
        label: 'Module*',
        type: WizardInput.Select,
        options: modules.map((module) => ({ label: module, value: module })),
        initialValue: first(modules),
      },
      {
        id: 'eventName',
        label: 'Event*',
        placeholder: 'event_name',
        type: WizardInput.Text,
        description: ['The event name to observe'],
      },
      {
        id: 'observerName',
        label: 'Observer name*',
        placeholder: 'eg. ProductSaveObserver',
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
      eventName: 'required',
      observerName: 'required',
      scope: 'required',
    },
  });

  return data;
};
