import { getWorkspaceIndex } from 'utils/extension';
import { TextEditor, Range, window, MarkdownString, ThemeColor, Uri } from 'vscode';

const decorationType = window.createTextEditorDecorationType({
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: new ThemeColor('editor.selectionBackground'),
});

export async function decoratePreferenceClass(editor: TextEditor) {
  const namespaceMatch = getClassAndNamespace(editor);

  if (!namespaceMatch) {
    return;
  }

  const { namespace, classIndex, classType, className } = namespaceMatch;

  const fullNamespace = `${namespace}\\${className}`;

  const workspaceIndex = getWorkspaceIndex();
  const preferences = workspaceIndex.di.getPreferencesFor(fullNamespace);

  if (!preferences.length) {
    return;
  }

  const offset = classType.length + 1;

  const range = new Range(
    editor.document.positionAt(classIndex + offset),
    editor.document.positionAt(classIndex + offset + className.length)
  );

  const message = new MarkdownString(`**Magento Toolbox:**\n\n`);

  if (classType === 'interface') {
    message.appendMarkdown(`Interface implementations:\n`);
  } else {
    message.appendMarkdown(`Class preferences:\n`);
  }

  message.isTrusted = true;

  for (const preference of preferences) {
    const classNamespace = await workspaceIndex.namespaces.getClassNamespace(preference.type);

    let link = preference.type;

    if (classNamespace) {
      link = `[${preference.type}](${classNamespace.fileUri})`;
    }

    message.appendMarkdown(`- ${link} [(di.xml)](${preference.diUri})\n`);
  }

  editor.setDecorations(decorationType, [
    {
      hoverMessage: message,
      range,
    },
  ]);
}

function getClassAndNamespace(editor: TextEditor) {
  const sourceCode = editor.document.getText();
  const namespaceRegex = /namespace\s([^;]+)/;
  const classRegex = /(class|interface)\s(\w+)/;

  const namespaceMatch = sourceCode.match(namespaceRegex);
  const classMatch = sourceCode.match(classRegex);

  if (namespaceMatch === null || classMatch === null) {
    return;
  }

  return {
    namespace: namespaceMatch[1],
    className: classMatch[2],
    classType: classMatch[1],
    classIndex: classMatch.index!,
  };
}
