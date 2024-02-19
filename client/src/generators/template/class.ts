import { renderTemplate } from 'utils/generator';
import { resolve } from 'path';

export interface IClassUse {
  alias: string | null;
  class: string;
}

export interface IClassVariables {
  namespace: string;
  use: IClassUse[];
  className: string;
  classExtends: string | null;
  classImplements: string | null;
  data: string;
  license: string | null;
}

/**
 * Generates a PHP class
 */
export async function generateClass(variables: IClassVariables): Promise<string> {
  const location = resolve(__dirname, '../templates/class.ejs');
  const template = await renderTemplate(location, variables);
  return template;
}
