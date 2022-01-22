import * as vscode from 'vscode';

import binMagento from './commands/bin-magento';
import generateModule from './commands/generate-module';
import generateSystemConfig from './commands/generate-config';

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

  const generateSystemConfigCommand = vscode.commands.registerCommand(
    'magento-toolbox.generateSystemConfig',
    () => {
      return generateSystemConfig(context);
    }
  );

  context.subscriptions.push(
    ...[generateModuleCommand, binMagentoCommand, generateSystemConfigCommand]
  );
}

export function deactivate() {}
