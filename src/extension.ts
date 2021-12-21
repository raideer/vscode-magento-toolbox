import * as vscode from 'vscode';
import { generateClass } from "./generator";
import { openDirectoryDialog, openTextDialog } from './vscode';

export function activate(context: vscode.ExtensionContext) {
	const generateModuleCommand = vscode.commands.registerCommand('magento-toolbox.generateModule', async () => {
		const vendorName = await openTextDialog('Enter vendor name:', 'Vendor name (eg. Magento)');
		if (!vendorName) {
			return;
		}
		const moduleName = await openTextDialog('Enter module name:', 'Module name (eg. Module)');
		if (!moduleName) {
			return;
		}

		const targetDirectory = await openDirectoryDialog('Select module directory (eg. app/code)');

		const tem = await generateClass({
			namespace: `${vendorName}\\${moduleName}\\Model`,
			dependencies: ['Magento\\Sample\\Model\\ResourceModel\\Sample'],
			className: 'Sample',
			classExtends: 'Magento\\Sample\\Model\\AbstractModel',
			classImplements: 'Magento\\Sample\\Model\\SampleInterface',
			data: 'Hello',
			license: null
		});
		console.log(targetDirectory, tem);
	});

	context.subscriptions.push(generateModuleCommand);
}

export function deactivate() {}
