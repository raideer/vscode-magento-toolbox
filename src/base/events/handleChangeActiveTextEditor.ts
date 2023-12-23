import { updateContext } from 'base/context';
import { decorateObserverClass } from 'base/decorators/observer-class';
import { decorateObserverKeys } from 'base/decorators/observer-keys';
import { decoratePluginClass } from 'base/decorators/plugin-class';
import { decoratePreferenceClass } from 'base/decorators/preference-class';
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
