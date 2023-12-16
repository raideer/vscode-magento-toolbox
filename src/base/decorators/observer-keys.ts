import { DecorationOptions, TextEditor, Range, Position, window, MarkdownString } from 'vscode';

const decorationType = window.createTextEditorDecorationType({});

export function decorateObserverKeys(editor: TextEditor) {
  const sourceCode = editor.document.getText();
  const regex = /->dispatch\(['"](\w+)['"]/;
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

      const args = [match[1]];

      const message = new MarkdownString(`**Magento Toolbox:**\n\n`);
      message.appendMarkdown(
        `- [Create Observer](command:magento-toolbox.generateObserver?${encodeURIComponent(
          JSON.stringify(args)
        )})`
      );
      message.isTrusted = true;

      decorationsArray.push({ range, hoverMessage: message });
    }
  }

  editor.setDecorations(decorationType, decorationsArray);
}
