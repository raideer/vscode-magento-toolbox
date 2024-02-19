import { getIdentifierName } from 'base/reflection/ast';
import { PhpClass } from 'base/reflection/php-class';
import { PhpFile } from 'base/reflection/php-file';
import { PhpMethod } from 'base/reflection/php-method';
import { first } from 'lodash-es';
import * as vscode from 'vscode';

export const resolvePluginClass = (editor: vscode.TextEditor): PhpClass | null => {
  const phpFile = PhpFile.fromTextEditor(editor);
  const phpClass = first(phpFile.classes)!;

  if (!phpClass) {
    vscode.window.showErrorMessage('No class found');
    return null;
  }

  if (phpClass.ast.isFinal) {
    vscode.window.showErrorMessage('Cannot generate plugin for final class');
    return null;
  }

  if (
    phpClass.ast.implements &&
    phpClass.ast.implements.find((item) => item.name === 'NoninterceptableInterface')
  ) {
    vscode.window.showErrorMessage(
      'Cannot generate plugin for a class that implements NoninterceptableInterface'
    );
    return null;
  }

  return phpClass;
};

export const resolvePluginMethod = (phpClass: PhpClass): PhpMethod | null => {
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

  const method = phpClass.methods.find((m) => {
    return m.name === word;
  });

  if (!method) {
    vscode.window.showErrorMessage(`Method ${word} not found in class ${phpClass.name}`);
    return null;
  }

  if (method.ast.visibility !== 'public') {
    vscode.window.showErrorMessage('Cannot generate plugin for a private method');
    return null;
  }

  if (method.name === '__construct' || method.name === '__destruct') {
    vscode.window.showErrorMessage('Cannot generate plugin for a constructor or destructor');
    return null;
  }

  return method;
};
