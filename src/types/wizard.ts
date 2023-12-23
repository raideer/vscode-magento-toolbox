import { ErrorMessages, Rules } from 'validatorjs';

export interface Wizard {
  title: string;
  description?: string;
  fields: WizardField[];
  validationSchema?: any;
  validation?: Rules;
  validationMessages?: ErrorMessages;
}

export type WizardField =
  | WizardTextField
  | WizardNumberField
  | WizardSelectField
  | WizardReadonlyField
  | WizardCheckboxField;

export interface WizardTextField extends WizardGenericField {
  type: WizardInput.Text;
  placeholder?: string;
}

export interface WizardNumberField extends WizardGenericField {
  type: WizardInput.Number;
  placeholder?: string;
}

export interface WizardReadonlyField extends WizardGenericField {
  type: WizardInput.Readonly;
  placeholder?: string;
}

export interface WizardSelectField extends WizardGenericField {
  type: WizardInput.Select;
  options: WizardSelectOption[];
  multiple?: boolean;
  search?: boolean;
}

export interface WizardCheckboxField extends WizardGenericField {
  type: WizardInput.Checkbox;
}

export interface WizardGenericField {
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

export interface WizardSelectOption {
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
