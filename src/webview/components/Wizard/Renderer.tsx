import { Form, Formik, FormikValues } from 'formik';
import { useCallback } from 'react';
import { WebviewApi } from 'vscode-webview';
import Validator from 'validatorjs';
import { Wizard, WizardInput } from 'types/wizard';
import { FieldRenderer } from './FieldRenderer';
import { Button } from '../Form/Button';

interface Props {
  wizard: Wizard;
  vscode: WebviewApi<unknown>;
}

export const Renderer: React.FC<Props> = ({ wizard, vscode }) => {
  const initialValues: FormikValues = wizard.fields.reduce((acc: FormikValues, field) => {
    if (field.type === WizardInput.Select && field.multiple) {
      acc[field.id] = field.initialValue ?? [];
      return acc;
    }

    acc[field.id] = field.initialValue ?? '';
    return acc;
  }, {});

  const handleSubmit = useCallback((values) => {
    vscode.postMessage({ command: 'submit', payload: values });
  }, []);

  const handleValidation = useCallback((values) => {
    if (wizard.validation) {
      const validation = new Validator(values, wizard.validation, wizard.validationMessages);

      validation.passes();

      return validation.errors.all();
    }

    return {};
  }, []);

  return (
    <main className="p-6 w-full">
      <h1 className="text-2xl mb-4">{wizard.title}</h1>
      {wizard.description && <p className="text-lg mb-4 font-light">{wizard.description}</p>}
      <div className="border-b border-vscode-settings-dropdownListBorder" />
      <Formik initialValues={initialValues} onSubmit={handleSubmit} validate={handleValidation}>
        <Form>
          <div className="rounded bg-vscode-editorWidget-background mt-4 flex flex-col">
            {wizard.fields.map((field) => {
              return (
                <FieldRenderer
                  key={field.id}
                  className="p-4 border-b border-vscode-settings-dropdownListBorder last:border-none"
                  field={field}
                />
              );
            })}
          </div>
          <div className="mt-4 flex gap-4">
            <Button>Submit</Button>
          </div>
        </Form>
      </Formik>
    </main>
  );
};
