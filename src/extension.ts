import * as vscode from 'vscode';

import binMagento from './commands/bin-magento';
import generateModule from './commands/generate-module';
import generateObserver from './commands/generate-observer';

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

  const generateObserverCommand = vscode.commands.registerCommand(
    'magento-toolbox.generateObserver',
    () => {
      return generateObserver(context);
    }
  );

  context.subscriptions.push(
    ...[generateModuleCommand, generateObserverCommand, binMagentoCommand]
  );
}

export function deactivate() {}
