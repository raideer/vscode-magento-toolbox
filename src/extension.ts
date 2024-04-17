import * as vscode from 'vscode';

import { ext } from 'base/variables';
import generatePlugin from 'commands/generate-plugin';
import generatePreference from 'commands/generate-preference';
import handleChangeActiveTextEditor from 'events/handleChangeActiveTextEditor';
import generateViewModel from 'commands/generate-viewmodel';
import handleChangeTextEditorSelection from 'events/handleChangeTextEditorSelection';
import generateXmlCatalog from 'commands/generate-xml-catalog';
import indexWorkspace from 'commands/index-workspace';
import generateDataPatch from 'commands/generate-data-patch';
import generateEmptyDiXml from 'commands/generate-empty-di-xml';
import generateEmptyConfigXml from 'commands/generate-empty-config-xml';
import generateEmptyLayoutXml from 'commands/generate-empty-layout-xml';
import generateEmptyRoutesXml from 'commands/generate-empty-routes-xml';
import handleSaveTextDocument from 'events/handleSaveTextDocument';
import generateEmptySystemXml from 'commands/generate-empty-system-xml';
import generateEmptyCrontabXml from 'commands/generate-empty-crontab-xml';
import { activateLs, deactivateLs } from 'base/language-server';
import generateController from './commands/generate-controller';
import generateBlock from './commands/generate-block';
import generateObserver from './commands/generate-observer';
import generateModule from './commands/generate-module';

const loadCommands = () => {
  const commands = [
    ['magento-toolbox.indexWorkspace', indexWorkspace],
    ['magento-toolbox.generateModule', generateModule],
    ['magento-toolbox.generateObserver', generateObserver],
    ['magento-toolbox.generateBlock', generateBlock],
    ['magento-toolbox.generateController', generateController],
    ['magento-toolbox.generateViewModel', generateViewModel],
    ['magento-toolbox.generateXmlCatalog', generateXmlCatalog],
    ['magento-toolbox.generateDataPatch', generateDataPatch],
    ['magento-toolbox.generateEmptyDiXml', generateEmptyDiXml],
    ['magento-toolbox.generateEmptyConfigXml', generateEmptyConfigXml],
    ['magento-toolbox.generateEmptyLayoutXml', generateEmptyLayoutXml],
    ['magento-toolbox.generateEmptyRoutesXml', generateEmptyRoutesXml],
    ['magento-toolbox.generateEmptySystemXml', generateEmptySystemXml],
    ['magento-toolbox.generateEmptyCrontabXml', generateEmptyCrontabXml],
  ].map(([commandName, command]) => {
    return vscode.commands.registerCommand(commandName as string, command as any);
  });

  ext.context!.subscriptions.push(...commands);

  const textEditorCommands = [
    ['magento-toolbox.generatePlugin', generatePlugin],
    ['magento-toolbox.generatePreference', generatePreference],
  ].map(([commandName, command]) => {
    return vscode.commands.registerTextEditorCommand(commandName as string, command as any);
  });

  ext.context!.subscriptions.push(...textEditorCommands);
};

const loadEvents = () => {
  ext.context!.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(handleChangeActiveTextEditor)
  );

  ext.context!.subscriptions.push(
    vscode.window.onDidChangeTextEditorSelection(handleChangeTextEditorSelection)
  );

  ext.context!.subscriptions.push(vscode.workspace.onDidSaveTextDocument(handleSaveTextDocument));

  handleChangeActiveTextEditor(vscode.window.activeTextEditor);
};

export async function activate(context: vscode.ExtensionContext) {
  ext.context = context;

  console.log('[Magento Toolbox] Starting...');

  await activateLs();
  loadCommands();

  await vscode.commands.executeCommand('magento-toolbox.indexWorkspace');

  loadEvents();

  console.log('[Magento Toolbox] Loaded');
}

export function deactivate() {
  return deactivateLs();
}
