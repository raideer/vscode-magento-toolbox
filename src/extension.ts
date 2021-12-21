import * as vscode from 'vscode';
import * as fs from 'fs';
import { generateClass, generateModuleRegistration } from "./generator";
import { resolveAppCode } from './utils';
import { openDirectoryDialog, openTextDialog } from './vscode';

export function activate(context: vscode.ExtensionContext) {
	const generateModuleCommand = vscode.commands.registerCommand('magento-toolbox.generateModule', async () => {
		const moduleName = await openTextDialog('Enter module name', 'Vendor name (eg. Vendor_Module)', 'Vendor_Module');
		if (!moduleName) {
			return;
		}

		let targetLocation = await resolveAppCode();

		if (!targetLocation) {
			targetLocation = await openDirectoryDialog('Select module directory (eg. app/code)');
		}

		if (!targetLocation) {
			return;
		}
		
		const [vendor, module] = moduleName.split('_');
		const fileLoc = `${targetLocation.fsPath}/${vendor}/${module}`;

		const registration = await generateModuleRegistration({
			moduleName,
			license: null
		});
		
		fs.mkdirSync(fileLoc, { recursive: true });
		fs.writeFileSync(`${fileLoc}/registration.php`, Buffer.from(registration, 'utf-8'));
	});

	context.subscriptions.push(generateModuleCommand);
}

export function deactivate() {}
