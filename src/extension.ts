import * as vscode from 'vscode';

import binMagento from './commands/bin-magento';
import generateModule from './commands/generate-module';

export function activate(context: vscode.ExtensionContext) {
  const binMagentoCommand = vscode.commands.registerCommand('magento-toolbox.binMagento', () => {
    return binMagento(context);
  });

  const generateModuleCommand = vscode.commands.registerCommand(
    'magento-toolbox.generateModule',
    () => {
      return generateModule(context);
    }
  );

  context.subscriptions.push(...[generateModuleCommand, binMagentoCommand]);
}

export function deactivate() {}
