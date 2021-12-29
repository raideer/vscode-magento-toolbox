import { renderFile } from 'ejs';
import { resolve } from 'path';
import {
  IClassVariables,
  IComposerVariables,
  ILicenseVariables,
  IModuleRegistrationVariables,
  License,
} from 'types';

export async function renderTemplate(filename: string, variables: any): Promise<string> {
  return renderFile(filename, variables);
}

export async function generateModuleRegistration(
  variables: IModuleRegistrationVariables
): Promise<string> {
  const location = resolve(__dirname, '../templates/registration.ejs');
  const template = await renderTemplate(location, variables);
  return template;
}

export async function generateClass(variables: IClassVariables): Promise<string> {
  const location = resolve(__dirname, '../templates/class.ejs');
  const template = await renderTemplate(location, variables);
  return template;
}

export async function generateLicense(
  type: License,
  variables: ILicenseVariables
): Promise<string> {
  const location = resolve(__dirname, `../templates/license/${type}.ejs`);
  const template = await renderTemplate(location, variables);
  return template;
}

export function generateComposerJson({
  name,
  description,
  license,
  vendor,
  module,
}: IComposerVariables) {
  return JSON.stringify(
    {
      name,
      description,
      type: 'magento2-module',
      license,
      'minimum-stability': 'dev',
      require: {},
      autoload: {
        files: ['registration.php'],
        psr4: {
          [`${vendor}\\${module}\\`]: '',
        },
      },
    },
    null,
    4
  );
}
