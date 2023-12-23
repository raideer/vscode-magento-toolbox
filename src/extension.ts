import * as vscode from 'vscode';

import { ext } from 'base/variables';
import generatePlugin from 'commands/generate-plugin';
import generatePreference from 'commands/generate-preference';
import generateModule from './commands/generate-module';
import generateObserver from './commands/generate-observer';
import generateBlock from './commands/generate-block';
import generateController from './commands/generate-controller';
import handleChangeActiveTextEditor from 'events/handleChangeActiveTextEditor';
import generateViewModel from 'commands/generate-viewmodel';
import handleChangeTextEditorSelection from 'events/handleChangeTextEditorSelection';
import generateXmlCatalog from 'commands/generate-xml-catalog';
import indexWorkspace from 'commands/index-workspace';
import xmlClassHover from 'hovers/xml-class-hover';

const loadCommands = () => {
  const commands = [
    ['magento-toolbox.indexWorkspace', indexWorkspace],
    ['magento-toolbox.generateModule', generateModule],
    ['magento-toolbox.generateObserver', generateObserver],
    ['magento-toolbox.generateBlock', generateBlock],
    ['magento-toolbox.generateController', generateController],
    ['magento-toolbox.generateViewModel', generateViewModel],
    ['magento-toolbox.generateXmlCatalog', generateXmlCatalog],
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

const loadHoverProviders = () => {
  xmlClassHover();
};

export async function activate(context: vscode.ExtensionContext) {
  ext.context = context;

  console.log('[Magento Toolbox] Starting...');

  loadCommands();

  await vscode.commands.executeCommand('magento-toolbox.indexWorkspace');

  loadEvents();
  loadHoverProviders();

  console.log('[Magento Toolbox] Loaded');
}

export function deactivate() {}
