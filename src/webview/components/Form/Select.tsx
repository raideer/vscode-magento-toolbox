import clsx from 'clsx';
import { useField } from 'formik';
import { WizardSelectOption } from 'types/wizard';
import ReactSelect from 'react-select';

interface Props {
  name: string;
  description?: string[];
  options: WizardSelectOption[];
  multiple?: boolean;
  search?: boolean;
}

export const Select: React.FC<Props> = ({ description, children, options, ...props }) => {
  const [field, meta, form] = useField(props);

  return (
    <div className="flex flex-col">
      <span className="mb-2">{children}</span>
      <ReactSelect
        name={field.name}
        value={options ? options.find(option => option.value === field.value) : ''}
        onChange={(option: any) => form.setValue(option.value)}
        onBlur={field.onBlur}
        isMulti={props.multiple}
        unstyled
        classNames={{
          indicatorSeparator: () => 'bg-vscode-input-background',
          indicatorsContainer: () => 'p-0',
          singleValue: () => 'text-vscode-input-foreground',
          input: () => 'p-0 text-vscode-input-foreground',
          multiValue: () => 'bg-vscode-inputOption-activeBackground mr-1 px-1',
          control: () =>
            clsx('p-1 !min-h-[auto] bg-vscode-input-background rounded-none border', {
              'border-vscode-input-background': !meta.touched || !meta.error,
              'border-vscode-inputValidation-errorBorder': meta.touched && meta.error,
            }),
          menu: () =>
            clsx('p-1 bg-vscode-input-background rounded-none border', {
              'border-vscode-input-background': !meta.touched || !meta.error,
              'border-vscode-inputValidation-errorBorder': meta.touched && meta.error,
            }),
          option: ({ isFocused }) => clsx('p-1', { 'bg-vscode-inputOption-activeBackground': isFocused }),
        }}
        isSearchable={props.search}
        options={options}
      />
      {meta.touched && meta.error && (
        <div className="p-2 mt-[-1px] border border-vscode-inputValidation-errorBorder bg-vscode-inputValidation-errorBackground">
          {meta.error}
        </div>
      )}
      {description &&
        description?.length > 0 &&
        description.map((line) => (
          <span key={line} className="block mt-1 opacity-60">
            {line}
          </span>
        ))}
    </div>
  );
};
