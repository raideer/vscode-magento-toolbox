import clsx from 'clsx';
import { useField } from 'formik';
import { IWizardSelectOption } from 'types/wizard';

interface Props {
  name: string;
  description?: string[];
  options: IWizardSelectOption[];
  multiple?: boolean;
}

export const Select: React.FC<Props> = ({ description, children, options, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <div className="flex flex-col">
      <span className="mb-2">{children}</span>
      <select
        className={clsx('p-1 bg-vscode-input-background border', {
          'border-vscode-input-background': !meta.touched || !meta.error,
          'border-vscode-inputValidation-errorBorder': meta.touched && meta.error,
        })}
        {...field}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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
