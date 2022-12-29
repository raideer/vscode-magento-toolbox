import { ErrorMessages, Rules } from 'validatorjs';

export interface IWizard {
  title: string;
  description?: string;
  fields: IWizardField[];
  validationSchema?: any;
  validation?: Rules;
  validationMessages?: ErrorMessages;
}

export type IWizardField = IWizardTextField | IWizardSelectField | IWizardCheckboxField;

export interface IWizardTextField extends IWizardGenericField {
  type: WizardInput.Text;
  placeholder?: string;
}

export interface IWizardSelectField extends IWizardGenericField {
  type: WizardInput.Select;
  options: IWizardSelectOption[];
  multiple?: boolean;
}

export interface IWizardCheckboxField extends IWizardGenericField {
  type: WizardInput.Checkbox;
}

export interface IWizardGenericField {
  id: string;
  label: string;
  description?: string[];
  initialValue?: string;
  dependsOn?: string;
}

export enum WizardInput {
  Text = 'text',
  Select = 'select',
  Checkbox = 'checkbox',
}

export interface IWizardSelectOption {
  label: string;
  value: string;
}

export enum License {
  None = 'none',
  APACHE2 = 'apache2',
  MIT = 'mit',
  GPL_V3 = 'gplv3',
  OSL_V3 = 'oslv3',
}
