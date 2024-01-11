import { PhpClass } from 'base/reflection/php-class';
import { PhpFile } from 'base/reflection/php-file';
import { PhpInterface } from 'base/reflection/php-interface';
import { first } from 'lodash-es';
import * as vscode from 'vscode';

export const resolvePreferenceClass = (): PhpClass | PhpInterface | null => {
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

  const phpFile = PhpFile.fromTextEditor(editor);
  const phpClass = first(phpFile.classes);

  if (phpClass) {
    return validatePhpClass(phpClass);
  }

  const phpInterface = first(phpFile.interfaces);

  if (phpInterface) {
    return validatePhpInterface(phpInterface);
  }

  vscode.window.showErrorMessage('No class or interface found');
  return null;
};

const validatePhpClass = (phpClass: PhpClass) => {
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

const validatePhpInterface = (phpInterface: PhpInterface) => {
  if (
    phpInterface.ast.extends &&
    phpInterface.ast.extends.find((item) => item.name === 'NoninterceptableInterface')
  ) {
    vscode.window.showErrorMessage(
      'Cannot create a preference for a interface that extends NoninterceptableInterface'
    );
    return null;
  }

  return phpInterface;
};
