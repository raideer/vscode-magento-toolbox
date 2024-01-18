import { WizardGenerator } from 'base/wizard';
import { first } from 'lodash-es';
import { WizardField, WizardInput } from 'types/wizard';

export interface CrontabXmlWizardData {
  module: string;
}

export const openCrontabXmlWizard = async (modules: string[], initialModule?: string) => {
  const wizard = new WizardGenerator();
  wizard.setTitle('Generate crontab.xml');

  const fields: WizardField[] = [
    {
      id: 'module',
      label: 'Module*',
      type: WizardInput.Select,
      options: modules.map((module) => ({ label: module, value: module })),
      initialValue: initialModule ?? first(modules),
    },
  ];

  wizard.setFields(fields);
  wizard.setValidation({
    module: 'required',
  });

  return wizard.open<CrontabXmlWizardData>();
};
