import { updateContext } from 'base/context';
import { TextEditorSelectionChangeEvent } from 'vscode';

export default async (e: TextEditorSelectionChangeEvent) => {
  await updateContext('selection', e.textEditor);
};
