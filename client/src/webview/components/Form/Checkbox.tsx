import clsx from 'clsx';
import { useField } from 'formik';

interface Props {
  name: string;
  description?: string[];
}

export const Checkbox: React.FC<Props> = ({ description, children, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <div className="flex flex-col">
      <label htmlFor={field.name} className="flex items-center cursor-pointer">
        <input
          id={field.name}
          className={clsx('p-1 bg-vscode-input-background border', {
            'border-vscode-input-background': !meta.touched || !meta.error,
            'border-vscode-inputValidation-errorBorder': meta.touched && meta.error,
          })}
          type="checkbox"
          {...field}
          {...props}
        />
        <span className="ml-2">{children}</span>
      </label>
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
