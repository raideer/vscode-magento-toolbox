import { ext } from 'base/variables';
import { TextEditor, Range, window, MarkdownString, ThemeColor } from 'vscode';

const decorationType = window.createTextEditorDecorationType({
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: new ThemeColor('editor.selectionBackground'),
});

export function decorateObserverClass(editor: TextEditor) {
  const sourceCode = editor.document.getText();
  const namespaceRegex = /namespace\s([^;]+)/;
  const classRegex = /class\s(\w+)/;

  const namespaceMatch = sourceCode.match(namespaceRegex);
  const classMatch = sourceCode.match(classRegex);

  if (namespaceMatch === null || classMatch === null) {
    return;
  }

  const namespace = namespaceMatch[1];
  const className = classMatch[1];

  const classNamespace = `${namespace}\\${className}`;
  const observer = ext.index.observers.getObserverByClass(classNamespace);

  if (!observer) {
    return;
  }

  // 'class ' = 6
  const offset = 6;

  const range = new Range(
    editor.document.positionAt(classMatch.index! + offset),
    editor.document.positionAt(classMatch.index! + offset + classMatch[1].length)
  );

  const message = new MarkdownString(`**Magento Toolbox:**\n\n`);
  message.appendMarkdown(`Observes event: \`${observer.event}\``);
  message.isTrusted = true;

  editor.setDecorations(decorationType, [
    {
      hoverMessage: message,
      range,
    },
  ]);
}
