import { renderTemplate } from 'utils/generator';
import { resolve } from 'path';

export interface IClassParameterVariables {
  description: string | null;
  type: string;
  visibility: 'public' | 'private' | 'protected';
  name: string;
}

/**
 * Generates a PHP class parameterr
 */
export async function generateClassParameter(variables: IClassParameterVariables): Promise<string> {
  const location = resolve(__dirname, '../templates/classParameter.ejs');
  const template = await renderTemplate(location, variables);
  return template;
}
