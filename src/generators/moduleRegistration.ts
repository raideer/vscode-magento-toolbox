import { renderTemplate } from 'generator';
import { resolve } from 'path';

export interface IModuleRegistrationVariables {
  moduleName: string;
  license: string | null;
}

/**
 * Generates module registration PHP file
 */
export async function generateModuleRegistration(
  variables: IModuleRegistrationVariables
): Promise<string> {
  const location = resolve(__dirname, '../templates/registration.ejs');
  const template = await renderTemplate(location, variables);
  return template;
}
