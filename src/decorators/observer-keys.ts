import { getWorkspaceIndex } from 'utils/extension';
import {
  DecorationOptions,
  TextEditor,
  Range,
  Position,
  window,
  MarkdownString,
  ThemeColor,
} from 'vscode';

const decorationType = window.createTextEditorDecorationType({
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: new ThemeColor('editor.selectionBackground'),
});

export async function decorateObserverKeys(editor: TextEditor) {
  const sourceCode = editor.document.getText();
  const regex = /->dispatch\([\n\s]*['"](\w+)['"](?!\s*\.)/;
  const offset = 12;

  const decorationsArray: DecorationOptions[] = [];

  const sourceCodeArr = sourceCode.split('\n');

  // eslint-disable-next-line no-plusplus
  for (let line = 0; line < sourceCodeArr.length; line++) {
    const match = sourceCodeArr[line].match(regex);

    if (match !== null && match.index !== undefined) {
      const range = new Range(
        new Position(line, match.index + offset),
        new Position(line, match.index + offset + match[1].length)
      );

      const workspaceIndex = getWorkspaceIndex();
      const observers = workspaceIndex.observers.getObserversByEvent(match[1]);

      const args = [match[1]];

      const message = new MarkdownString(`**Magento Toolbox:**\n\n`);

      if (observers.length > 0) {
        message.appendMarkdown(`Observers listening to this event:\n\n`);
      }

      for (const observer of observers) {
        const namespace = await workspaceIndex.namespaces.getClassNamespace(observer.class);

        let link = observer.class;

        if (namespace) {
          link = `[${observer.class}](${namespace.fileUri})`;
        }

        message.appendMarkdown(`- ${link}\n\n`);
      }

      message.appendMarkdown(
        `[Create Observer](command:magento-toolbox.generateObserver?${encodeURIComponent(
          JSON.stringify(args)
        )})`
      );
      message.isTrusted = true;

      decorationsArray.push({ range, hoverMessage: message });
    }
  }

  editor.setDecorations(decorationType, decorationsArray);
}
