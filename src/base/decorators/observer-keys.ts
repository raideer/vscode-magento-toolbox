import { ext } from 'base/variables';
import { getWorkspaceIndex } from 'utils/extension';
import {
  DecorationOptions,
  TextEditor,
  Range,
  Position,
  window,
  MarkdownString,
  ThemeColor,
  Uri,
} from 'vscode';

const decorationType = window.createTextEditorDecorationType({
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: new ThemeColor('editor.selectionBackground'),
});

export function decorateObserverKeys(editor: TextEditor) {
  const sourceCode = editor.document.getText();
  const regex = /->dispatch\([\n\s]*['"](\w+)['"](?!\s*\.)/;
  const offset = 12;

  const decorationsArray: DecorationOptions[] = [];

  const sourceCodeArr = sourceCode.split('\n');

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

      observers.forEach((observer) => {
        const namespace = workspaceIndex.namespaces.getClassNamespace(observer.class);

        let link = observer.class;

        if (namespace) {
          const fileUri = Uri.joinPath(
            namespace.uri,
            `${namespace.subNamespace}\\${namespace.className}.php`
          );
          link = `[${observer.class}](${fileUri})`;
        }

        message.appendMarkdown(`- ${link}\n\n`);
      });

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
