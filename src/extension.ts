import * as vscode from 'vscode';

import generateModule from './commands/generate-module';
import { openWebview } from './vscode';

export function activate(context: vscode.ExtensionContext) {
	const generateModuleCommand = vscode.commands.registerCommand('magento-toolbox.generateModule', () => {
    return generateModule(context);
  });

	context.subscriptions.push(...[
		generateModuleCommand
	]);
}

export function deactivate() {}
