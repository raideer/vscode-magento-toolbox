import clsx from 'clsx';

interface Props {
  type?: 'submit' | 'reset' | 'button';
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<Props> = ({ variant = 'primary', children }) => {
  return (
    <button
      className={clsx('px-4 py-1 border border-transparent', {
        'bg-vscode-button-background text-vscode-button-foreground hover:bg-vscode-button-hoverBackground':
          variant === 'primary',
        'bg-vscode-button-secondaryBackground text-vscode-button-secondaryForeground hover:bg-vscode-button-secondaryHoverBackground':
          variant === 'secondary',
      })}
      type="submit"
    >
      {children}
    </button>
  );
};
