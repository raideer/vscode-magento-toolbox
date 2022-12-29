import * as vscode from 'vscode';

import generatePlugin from 'commands/generate-plugin';
import generatePreference from 'commands/generate-preference';
import generateModule from './commands/generate-module';
import generateObserver from './commands/generate-observer';
import generateBlock from './commands/generate-block';
import generateController from './commands/generate-controller';

export function activate(context: vscode.ExtensionContext) {
  const commands = [
    ['magento-toolbox.generateModule', generateModule],
    ['magento-toolbox.generateObserver', generateObserver],
    ['magento-toolbox.generateBlock', generateBlock],
    ['magento-toolbox.generateController', generateController],
    ['magento-toolbox.generatePlugin', generatePlugin],
    ['magento-toolbox.generatePreference', generatePreference],
  ].map(([commandName, command]) => {
    return vscode.commands.registerCommand(commandName as string, () => {
      return (command as any)(context);
    });
  });

  context.subscriptions.push(...commands);
}

export function deactivate() {}
