import { Engine } from 'php-parser';
import { IPhpClass, IPhpMethod } from 'types/reflection';
import { astToPhpClass } from 'utils/ast';
import * as vscode from 'vscode';

export const resolvePluginClass = (): IPhpClass | null => {
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

  const parser = new Engine({});
  const ast = parser.parseCode(fullText, 'file.php');

  const phpClass = astToPhpClass(ast);

  if (phpClass.isFinal) {
    vscode.window.showErrorMessage('Cannot generate plugin for final class');
    return null;
  }

  if (
    phpClass.implements &&
    phpClass.implements.includes('Magento\\Framework\\ObjectManager\\NoninterceptableInterface')
  ) {
    vscode.window.showErrorMessage(
      'Cannot generate plugin for a class that implements NoninterceptableInterface'
    );
    return null;
  }

  return phpClass;
};

export const resolvePluginMethod = (phpClass: IPhpClass): IPhpMethod | null => {
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

  const wordRange = editor.document.getWordRangeAtPosition(selection.active);
  const word = editor.document.getText(wordRange);

  const method = (phpClass.methods || []).find((m) => m.name === word);

  if (!method) {
    vscode.window.showErrorMessage(`Method ${word} not found in class ${phpClass.name}`);
    return null;
  }

  if (method.visibility !== 'public') {
    vscode.window.showErrorMessage('Cannot generate plugin for a private method');
    return null;
  }

  if (method.name === '__construct' || method.name === '__destruct') {
    vscode.window.showErrorMessage('Cannot generate plugin for a constructor or destructor');
    return null;
  }

  return method;
};
