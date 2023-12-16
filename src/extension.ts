import * as vscode from 'vscode';

import generatePlugin from 'commands/generate-plugin';
import generatePreference from 'commands/generate-preference';
import generateModule from './commands/generate-module';
import generateObserver from './commands/generate-observer';
import generateBlock from './commands/generate-block';
import generateController from './commands/generate-controller';
import handleChangeActiveTextEditor from 'base/events/handleChangeActiveTextEditor';
import { resolveMagentoRoot } from 'utils/magento';
import generateViewModel from 'commands/generate-viewmodel';

const loadCommands = (context: vscode.ExtensionContext) => {
  const commands = [
    ['magento-toolbox.generateModule', generateModule],
    ['magento-toolbox.generateObserver', generateObserver],
    ['magento-toolbox.generateBlock', generateBlock],
    ['magento-toolbox.generateController', generateController],
    ['magento-toolbox.generateViewModel', generateViewModel],
  ].map(([commandName, command]) => {
    return vscode.commands.registerCommand(commandName as string, () => {
      return (command as any)(context);
    });
  });

  context.subscriptions.push(...commands);

  const textEditorCommands = [
    ['magento-toolbox.generatePlugin', generatePlugin],
    ['magento-toolbox.generatePreference', generatePreference],
  ].map(([commandName, command]) => {
    return vscode.commands.registerTextEditorCommand(commandName as string, () => {
      return (command as any)(context);
    });
  });

  context.subscriptions.push(...textEditorCommands);
};

const loadEvents = (context: vscode.ExtensionContext) => {
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(handleChangeActiveTextEditor)
  );

  handleChangeActiveTextEditor(vscode.window.activeTextEditor);
};

export async function activate(context: vscode.ExtensionContext) {
  const magentoRoot = await resolveMagentoRoot(context);

  if (!magentoRoot) {
    // Not magento project
    console.log('[Magento Toolbox] Not a Magento project.');
    return;
  }

  loadCommands(context);
  loadEvents(context);

  console.log('[Magento Toolbox] Loaded');
}

export function deactivate() {}
