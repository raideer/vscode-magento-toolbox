import clsx from 'clsx';
import { useField } from 'formik';

interface Props {
  name: string;
  type?: 'text' | 'number';
  description?: string[];
  placeholder?: string;
  readonly?: boolean;
}

export const TextInput: React.FC<Props> = ({ description, children, readonly, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <div className="flex flex-col">
      <span className="mb-2">{children}</span>
      <input
        className={clsx('p-1 bg-vscode-input-background border', {
          'border-vscode-input-background': !meta.touched || !meta.error,
          'border-vscode-inputValidation-errorBorder': meta.touched && meta.error,
          'opacity-50 cursor-not-allowed': readonly,
        })}
        readOnly={readonly}
        disabled={readonly}
        {...field}
        {...props}
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
