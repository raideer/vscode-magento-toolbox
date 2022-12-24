import * as vscode from 'vscode';

import generatePlugin from 'commands/generate-plugin';
import generateModule from './commands/generate-module';
import generateObserver from './commands/generate-observer';
import generateBlock from './commands/generate-block';
import generateController from './commands/generate-controller';

export function activate(context: vscode.ExtensionContext) {
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

  const generatePluginCommand = vscode.commands.registerCommand(
    'magento-toolbox.generatePlugin',
    () => {
      return generatePlugin(context);
    }
  );

  context.subscriptions.push(
    ...[
      generateModuleCommand,
      generateObserverCommand,
      generateBlockCommand,
      generateControllerCommand,
      generatePluginCommand,
    ]
  );
}

export function deactivate() {}
