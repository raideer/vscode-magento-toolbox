import { updateContext } from 'base/context';
import { decorateTextEditor } from 'decorators';
import { TextEditor } from 'vscode';

export default async (editor: TextEditor | undefined) => {
  await updateContext('editor', editor);

  decorateTextEditor(editor);
};
