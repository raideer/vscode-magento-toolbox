import { updateContext } from 'base/context';
import { decorateObserverClass } from 'decorators/observer-class';
import { decorateObserverKeys } from 'decorators/observer-keys';
import { decoratePluginClass } from 'decorators/plugin-class';
import { decoratePreferenceClass } from 'decorators/preference-class';
import { TextEditor } from 'vscode';

export default async (editor: TextEditor | undefined) => {
  await updateContext('editor', editor);

  if (!editor) {
    return;
  }

  decorateObserverKeys(editor);
  decorateObserverClass(editor);
  decoratePluginClass(editor);
  decoratePreferenceClass(editor);
};
