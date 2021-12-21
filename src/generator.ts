import { renderFile } from "ejs";
import { resolve } from 'path';
import { IClassVariables } from "./types";

export async function renderTemplate(filename: string, variables: any) {
    return renderFile(filename, variables);
}

export async function generateClass(variables: IClassVariables) {
    const location = resolve(__dirname, '../templates/class.ejs');
	const template = await renderTemplate(location, variables);
    return template;
}
