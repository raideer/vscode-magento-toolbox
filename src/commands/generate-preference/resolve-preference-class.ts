import { IPhpClass } from 'types/reflection';
import { astToPhpClass, parsePhpClass } from 'utils/ast';
import * as vscode from 'vscode';

export const resolvePreferenceClass = (): IPhpClass | null => {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showErrorMessage('No active editor');
    return null;
  }

  const selection = editor?.selection;
  if (!editor || !selection) {
    vscode.window.showErrorMessage('No selection');
    return null;
  }

  const fullText = editor.document.getText();

  const ast = parsePhpClass(fullText, editor.document.fileName);
  const phpClass = astToPhpClass(ast);

  if (phpClass.isFinal) {
    vscode.window.showErrorMessage('Cannot create a preference for final class');
    return null;
  }

  if (
    phpClass.implements &&
    phpClass.implements.includes('Magento\\Framework\\ObjectManager\\NoninterceptableInterface')
  ) {
    vscode.window.showErrorMessage(
      'Cannot create a preference for a class that implements NoninterceptableInterface'
    );
    return null;
  }

  return phpClass;
};
