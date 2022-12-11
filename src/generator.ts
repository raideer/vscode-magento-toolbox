import { Data, renderFile } from 'ejs';

/**
 * Render an EJS template
 */
export async function renderTemplate(filename: string, variables: Data): Promise<string> {
  return renderFile(filename, variables);
}
