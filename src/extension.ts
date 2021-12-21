import * as vscode from 'vscode';

import generateModule from './commands/generate-module';

export function activate(context: vscode.ExtensionContext) {
	const generateModuleCommand = vscode.commands.registerCommand('magento-toolbox.generateModule', generateModule);
	context.subscriptions.push(generateModuleCommand);
}

export function deactivate() {}
