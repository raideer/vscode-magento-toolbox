import { astToPhpClass, parsePhpClass } from 'utils/ast';
import { TextEditor, commands } from 'vscode';

interface EditorContext {
  canGeneratePlugin: boolean;
  canGenerateObserver: boolean;
}
const defaultEditorContext: EditorContext = Object.freeze({
  canGeneratePlugin: false,
  canGenerateObserver: false,
});

const currentContext = { ...defaultEditorContext };

export async function updateContext(type: 'editor' | 'selection', editor?: TextEditor) {
  if (!editor) {
    await setContext({ ...defaultEditorContext });
    return;
  }

  if (type === 'editor') {
    currentContext.canGeneratePlugin = getCanGeneratePlugin(editor);
  }

  await setContext(currentContext);
}

const setContext = async (editorContext: EditorContext) => {
  const promises = Object.entries(editorContext).map(([key, value]) => {
    currentContext[key] = value;
    return commands.executeCommand('setContext', `magento-toolbox.${key}`, value);
  });

  await Promise.all(promises);
};

const getCanGeneratePlugin = (editor: TextEditor) => {
  const fullText = editor.document.getText();
  const ast = parsePhpClass(fullText, editor.document.fileName);
  const phpClass = astToPhpClass(ast);

  const canGeneratePlugin =
    !phpClass.isFinal &&
    (!phpClass.implements ||
      !phpClass.implements.includes(
        'Magento\\Framework\\ObjectManager\\NoninterceptableInterface'
      ));

  return canGeneratePlugin;
};
