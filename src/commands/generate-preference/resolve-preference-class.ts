import { PhpClass } from 'base/reflection/php-class';
import { PhpFile } from 'base/reflection/php-file';
import { first } from 'lodash-es';
import * as vscode from 'vscode';

export const resolvePreferenceClass = (): PhpClass | null => {
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

  const phpClass = first(PhpFile.fromTextEditor(editor).classes);

  if (!phpClass) {
    vscode.window.showErrorMessage('No class found');
    return null;
  }

  if (phpClass.ast.isFinal) {
    vscode.window.showErrorMessage('Cannot create a preference for final class');
    return null;
  }

  if (
    phpClass.ast.implements &&
    phpClass.ast.implements.find((item) => item.name === 'NoninterceptableInterface')
  ) {
    vscode.window.showErrorMessage(
      'Cannot create a preference for a class that implements NoninterceptableInterface'
    );
    return null;
  }

  return phpClass;
};
