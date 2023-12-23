import { TextEditor, commands } from 'vscode';
import { PhpFile } from './reflection/php-file';

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
  const phpFile = PhpFile.fromTextEditor(editor);
  const phpClass = phpFile.classes[0];

  if (!phpClass) {
    return false;
  }

  const canGeneratePlugin =
    !phpClass.ast.isFinal &&
    (!phpClass.ast.implements ||
      !phpClass.ast.implements.find((item) => item.name === 'NoninterceptableInterface'));

  return canGeneratePlugin;
};
