import { renderFile } from "ejs";
import { resolve } from 'path';
import { IClassVariables, IModuleRegistrationVariables } from "./types";

export async function renderTemplate(filename: string, variables: any): Promise<string> {
    return renderFile(filename, variables);
}


export async function generateModuleRegistration(variables: IModuleRegistrationVariables): Promise<string> {
    const location = resolve(__dirname, '../templates/registration.ejs');
	const template = await renderTemplate(location, variables);
    return template;
}


export async function generateClass(variables: IClassVariables): Promise<string> {
    const location = resolve(__dirname, '../templates/class.ejs');
	const template = await renderTemplate(location, variables);
    return template;
}
