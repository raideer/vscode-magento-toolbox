import { renderTemplate } from 'generator';
import { resolve } from 'path';

export interface IBlockTemplateVariables {
  namespace: string;
  data: string;
}

/**
 * Generates a Block template.phtml
 */
export async function generateBlockTemplate(variables: IBlockTemplateVariables): Promise<string> {
  const location = resolve(__dirname, '../templates/blockTemplate.ejs');
  const template = await renderTemplate(location, variables);
  return template;
}
