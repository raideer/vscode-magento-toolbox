import { Engine } from 'php-parser';
import { astToPhpClass } from 'utils/ast';
import { TextEditor, commands } from 'vscode';

const parserEngine = new Engine({});

export default async (editor: TextEditor | undefined) => {
  if (!editor || editor.document.languageId !== 'php') {
    await commands.executeCommand('setContext', 'magento-toolbox.canGeneratePlugin', false);
    return;
  }

  const fullText = editor.document.getText();
  const ast = parserEngine.parseCode(fullText, 'file.php');
  const phpClass = astToPhpClass(ast);

  const canGeneratePlugin =
    !phpClass.isFinal &&
    (!phpClass.implements ||
      !phpClass.implements.includes(
        'Magento\\Framework\\ObjectManager\\NoninterceptableInterface'
      ));

  await commands.executeCommand(
    'setContext',
    'magento-toolbox.canGeneratePlugin',
    canGeneratePlugin
  );
};
