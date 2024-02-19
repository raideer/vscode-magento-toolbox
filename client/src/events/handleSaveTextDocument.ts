import { decorateTextEditor } from 'decorators';
import { TextDocument, commands, window } from 'vscode';

export default async (document: TextDocument) => {
  if (document.uri.scheme === 'file') {
    // commands.executeCommand('magento-toolbox.indexWorkspace');

    decorateTextEditor(window.activeTextEditor);
  }
};
