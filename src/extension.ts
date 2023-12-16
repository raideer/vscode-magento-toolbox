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
import { ext } from 'base/variables';
import handleChangeTextEditorSelection from 'base/events/handleChangeTextEditorSelection';

const loadCommands = () => {
  const commands = [
    ['magento-toolbox.generateModule', generateModule],
    ['magento-toolbox.generateObserver', generateObserver],
    ['magento-toolbox.generateBlock', generateBlock],
    ['magento-toolbox.generateController', generateController],
    ['magento-toolbox.generateViewModel', generateViewModel],
  ].map(([commandName, command]) => {
    return vscode.commands.registerCommand(commandName as string, command as any);
  });

  ext.context.subscriptions.push(...commands);

  const textEditorCommands = [
    ['magento-toolbox.generatePlugin', generatePlugin],
    ['magento-toolbox.generatePreference', generatePreference],
  ].map(([commandName, command]) => {
    return vscode.commands.registerTextEditorCommand(commandName as string, command as any);
  });

  ext.context.subscriptions.push(...textEditorCommands);
};

const loadEvents = () => {
  ext.context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(handleChangeActiveTextEditor)
  );

  ext.context.subscriptions.push(
    vscode.window.onDidChangeTextEditorSelection(handleChangeTextEditorSelection)
  );

  handleChangeActiveTextEditor(vscode.window.activeTextEditor);
};

export async function activate(context: vscode.ExtensionContext) {
  ext.context = context;

  const magentoRoot = await resolveMagentoRoot();

  if (!magentoRoot) {
    // Not magento project
    console.log('[Magento Toolbox] Not a Magento project.');
    return;
  }

  loadCommands();
  loadEvents();

  console.log('[Magento Toolbox] Loaded');
}

export function deactivate() {}
