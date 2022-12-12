import { renderTemplate } from 'generator';
import { resolve } from 'path';

interface IParam {
  name: string;
  type: string;
}

export interface IFunctionVariables {
  description: string | null;
  name: string;
  docParams: IParam[];
  returnType: string;
  visibility: 'public' | 'private' | 'protected';
  params: IParam[];
  data: string;
}

/**
 * Generates a PHP function
 */
export async function generateFunction(variables: IFunctionVariables): Promise<string> {
  const location = resolve(__dirname, '../templates/function.ejs');
  const template = await renderTemplate(location, variables);
  return template;
}
