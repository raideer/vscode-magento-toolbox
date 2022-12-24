import * as vscode from 'vscode';
import { Engine } from 'php-parser';
import { astToPhpClass } from 'utils/ast';
import { openWizard } from 'utils/vscode';
import { resolveLoadedModules, resolveMagentoRoot } from 'utils/magento';
import { WizardInput } from 'types/wizard';
import { capitalize, first, upperFirst } from 'lodash-es';

export default async function (context: vscode.ExtensionContext) {
  const magentoRoot = await resolveMagentoRoot(context);

  if (!magentoRoot) {
    vscode.window.showWarningMessage(`Could not find Magento root directory.`);
    return;
  }

  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showErrorMessage('No active editor');
    return;
  }
  const selection = editor?.selection;
  if (!editor || !selection) {
    vscode.window.showErrorMessage('No selection');
    return;
  }

  const wordRange = editor.document.getWordRangeAtPosition(selection.active);
  const word = editor.document.getText(wordRange);
  const fullText = editor.document.getText();

  const parser = new Engine({});
  const ast = parser.parseCode(fullText, 'file.php');

  const phpClass = astToPhpClass(ast);

  if (phpClass.isFinal) {
    vscode.window.showErrorMessage('Cannot generate plugin for final class');
    return;
  }

  if (
    phpClass.implements &&
    phpClass.implements.includes('Magento\\Framework\\ObjectManager\\NoninterceptableInterface')
  ) {
    vscode.window.showErrorMessage(
      'Cannot generate plugin for a class that implements NoninterceptableInterface'
    );
    return;
  }

  const method = (phpClass.methods || []).find((m) => m.name === word);

  if (!method) {
    vscode.window.showErrorMessage(`Method ${word} not found in class ${phpClass.name}`);
    return;
  }

  if (method.visibility !== 'public') {
    vscode.window.showErrorMessage('Cannot generate plugin for a private method');
    return;
  }

  if (method.name === '__construct' || method.name === '__destruct') {
    vscode.window.showErrorMessage('Cannot generate plugin for a constructor or destructor');
    return;
  }

  const appCodeUri = vscode.Uri.joinPath(magentoRoot, 'app/code');

  const modules = await resolveLoadedModules(appCodeUri);

  const data: any = await openWizard(context, {
    title: 'Generate a new plugin',
    fields: [
      {
        id: 'module',
        label: 'Module*',
        type: WizardInput.Select,
        options: modules.map((module) => ({ label: module, value: module })),
        initialValue: first(modules),
      },
      {
        id: 'name',
        label: 'Plugin name*',
        type: WizardInput.Text,
        initialValue: `${capitalize(phpClass.name)}Plugin`,
      },
      {
        id: 'type',
        label: 'Plugin type',
        type: WizardInput.Select,
        options: [
          {
            label: 'Before',
            value: 'before',
          },
          {
            label: 'After',
            value: 'after',
          },
          {
            label: 'Around',
            value: 'around',
          },
        ],
        initialValue: 'before',
      },
    ],
    validation: {
      module: 'required',
      name: 'required',
      type: 'required',
    },
  });

  const pluginMethodName = `${data.type}${upperFirst(method.name)}`;
}
