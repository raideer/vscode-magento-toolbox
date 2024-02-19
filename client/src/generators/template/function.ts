import { renderTemplate } from 'utils/generator';
import { resolve } from 'path';

export interface IFunctionParam {
  name: string;
  type?: string;
  value?: string;
  nullable?: boolean;
}

export interface IFunctionVariables {
  description: string | null;
  name: string;
  docParams: IFunctionParam[];
  returnType: string | null;
  visibility: string;
  params: IFunctionParam[];
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
