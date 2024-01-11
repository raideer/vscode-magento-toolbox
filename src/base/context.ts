import { TextEditor, commands } from 'vscode';
import { PhpFile } from './reflection/php-file';

interface EditorContext {
  canGeneratePlugin: boolean;
  canGeneratePreference: boolean;
  canGenerateObserver: boolean;
}
const defaultEditorContext: EditorContext = Object.freeze({
  canGeneratePlugin: false,
  canGeneratePreference: false,
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
    currentContext.canGeneratePreference = getCanGeneratePreference(editor);
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

  if (phpClass) {
    const canGeneratePlugin =
      !phpClass.ast.isFinal &&
      (!phpClass.ast.implements ||
        !phpClass.ast.implements.find((item) => item.name === 'NoninterceptableInterface'));

    return canGeneratePlugin;
  }

  return false;
};

const getCanGeneratePreference = (editor: TextEditor) => {
  const phpFile = PhpFile.fromTextEditor(editor);
  const phpClass = phpFile.classes[0];

  if (phpClass) {
    const canGeneratePlugin =
      !phpClass.ast.isFinal &&
      (!phpClass.ast.implements ||
        !phpClass.ast.implements.find((item) => item.name === 'NoninterceptableInterface'));

    return canGeneratePlugin;
  }

  const phpInterface = phpFile.interfaces[0];

  if (phpInterface) {
    const canGeneratePlugin =
      !phpInterface.ast.extends ||
      !phpInterface.ast.extends.find((item) => item.name === 'NoninterceptableInterface');

    return canGeneratePlugin;
  }

  return false;
};
