import { ErrorMessages, Rules } from 'validatorjs';

export interface IWizard {
  title: string;
  description?: string;
  fields: IWizardField[];
  validationSchema?: any;
  validation?: Rules;
  validationMessages?: ErrorMessages;
}

export type IWizardField =
  | IWizardTextField
  | IWizardNumberField
  | IWizardSelectField
  | IWizardReadonlyField
  | IWizardCheckboxField;

export interface IWizardTextField extends IWizardGenericField {
  type: WizardInput.Text;
  placeholder?: string;
}

export interface IWizardNumberField extends IWizardGenericField {
  type: WizardInput.Number;
  placeholder?: string;
}

export interface IWizardReadonlyField extends IWizardGenericField {
  type: WizardInput.Readonly;
  placeholder?: string;
}

export interface IWizardSelectField extends IWizardGenericField {
  type: WizardInput.Select;
  options: IWizardSelectOption[];
  multiple?: boolean;
  search?: boolean;
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
  Number = 'number',
  Select = 'select',
  Checkbox = 'checkbox',
  Readonly = 'readonly',
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
