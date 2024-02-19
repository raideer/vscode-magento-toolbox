import { resolve } from 'path';
import { renderTemplate } from 'utils/generator';

export async function generateTemplate(template: string): Promise<string> {
  const location = resolve(__dirname, `../templates/${template}.ejs`);
  const output = await renderTemplate(location, {});
  return output;
}
