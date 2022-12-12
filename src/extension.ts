import * as vscode from 'vscode';

import binMagento from './commands/bin-magento';
import generateModule from './commands/generate-module';
import generateObserver from './commands/generate-observer';
import generateBlock from './commands/generate-block';
import generateController from './commands/generate-controller';

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

  const generateBlockCommand = vscode.commands.registerCommand(
    'magento-toolbox.generateBlock',
    () => {
      return generateBlock(context);
    }
  );

  const generateControllerCommand = vscode.commands.registerCommand(
    'magento-toolbox.generateController',
    () => {
      return generateController(context);
    }
  );

  context.subscriptions.push(
    ...[
      generateModuleCommand,
      generateObserverCommand,
      binMagentoCommand,
      generateBlockCommand,
      generateControllerCommand,
    ]
  );
}

export function deactivate() {}
