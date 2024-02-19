import { useFormikContext } from 'formik';
import { useMemo } from 'react';
import { WizardField, WizardInput } from 'types/wizard';
import { Checkbox } from '../Form/Checkbox';
import { Select } from '../Form/Select';
import { TextInput } from '../Form/TextInput';

interface Props {
  field: WizardField;
  className?: string;
}

export const FieldRenderer: React.FC<Props> = ({ field, className }) => {
  const { values } = useFormikContext<any>();

  const fieldInner = useMemo(() => {
    // eslint-disable-next-line default-case
    switch (field.type) {
      case WizardInput.Readonly:
      case WizardInput.Number:
      case WizardInput.Text: {
        return (
          <TextInput
            description={field.description}
            placeholder={field.placeholder}
            type={field.type === WizardInput.Number ? 'number' : 'text'}
            readonly={field.type === WizardInput.Readonly}
            name={field.id}
          >
            {field.label}
          </TextInput>
        );
      }
      case WizardInput.Select: {
        return (
          <Select
            multiple={field.multiple}
            options={field.options}
            description={field.description}
            name={field.id}
            search={field.search}
          >
            {field.label}
          </Select>
        );
      }
      case WizardInput.Checkbox: {
        return (
          <Checkbox description={field.description} name={field.id}>
            {field.label}
          </Checkbox>
        );
      }
    }

    return null;
  }, []);

  if (field.dependsOn && values[field.dependsOn.field] !== field.dependsOn.value) {
    return null;
  }

  if (fieldInner) {
    return <div className={className}>{fieldInner}</div>;
  }

  return null;
};
