import { TextEditor } from 'vscode';
import { decorateObserverKeys } from './observer-keys';
import { decorateObserverClass } from './observer-class';
import { decoratePluginClass } from './plugin-class';
import { decoratePreferenceClass } from './preference-class';

export const decorateTextEditor = (editor: TextEditor | undefined) => {
  if (!editor) {
    return;
  }

  decorateObserverKeys(editor);
  decorateObserverClass(editor);
  decoratePluginClass(editor);
  decoratePreferenceClass(editor);
};
