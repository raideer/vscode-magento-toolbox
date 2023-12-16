import { updateContext } from 'base/context';
import { decorateObserverClass } from 'base/decorators/observer-class';
import { decorateObserverKeys } from 'base/decorators/observer-keys';
import { TextEditor } from 'vscode';

export default async (editor: TextEditor | undefined) => {
  await updateContext('editor', editor);

  if (!editor) {
    return;
  }

  decorateObserverKeys(editor);
  decorateObserverClass(editor);
};
