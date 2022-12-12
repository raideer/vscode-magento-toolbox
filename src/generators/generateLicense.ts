import { renderTemplate } from 'generator';
import { resolve } from 'path';
import { License } from 'types';

export interface ILicenseVariables {
  year: number;
  copyright: string;
}

/**
 * Generates a license file
 */
export async function generateLicense(
  type: License,
  variables: ILicenseVariables
): Promise<string> {
  const location = resolve(__dirname, `../templates/license/${type}.ejs`);
  const template = await renderTemplate(location, variables);
  return template;
}
