import { Plugin } from 'base/indexers/di/indexer';
import { PhpFile } from 'base/reflection/php-file';
import { first } from 'lodash-es';
import { getWorkspaceIndex } from 'utils/extension';
import { isPluginMethod, pluginMethodToMethodName } from 'utils/magento';
import { TextEditor, Range, window, MarkdownString, ThemeColor, Uri } from 'vscode';

const classDecorationType = window.createTextEditorDecorationType({
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: new ThemeColor('editor.selectionBackground'),
});

const methodDecorationType = window.createTextEditorDecorationType({
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: new ThemeColor('editor.selectionBackground'),
});

export async function decoratePluginClass(editor: TextEditor) {
  const namespaceMatch = getClassAndNamespace(editor);

  if (!namespaceMatch) {
    return;
  }

  const { namespace, classIndex, classType, className } = namespaceMatch;

  const fullNamespace = `${namespace}\\${className}`;

  const workspaceIndex = getWorkspaceIndex();
  const plugins = workspaceIndex.di.getPluginsByType(fullNamespace);

  if (!plugins.length) {
    return;
  }

  const offset = classType.length + 1;

  const range = new Range(
    editor.document.positionAt(classIndex + offset),
    editor.document.positionAt(classIndex + offset + className.length)
  );

  const message = new MarkdownString(`**Magento Toolbox:**\n\n`);
  message.appendMarkdown(`Plugins for this class:\n`);
  message.isTrusted = true;

  const promises = plugins.map(async (plugin) => {
    const namespace = await workspaceIndex.namespaces.getClassNamespace(plugin.pluginClass);

    let link = plugin.pluginClass;

    if (namespace) {
      link = `[${plugin.pluginClass}](${namespace.fileUri})`;

      await decoratePluginFunctions(editor, plugin, namespace.fileUri);
    }

    message.appendMarkdown(`- ${link} [(di.xml)](${plugin.diUri})\n`);
  });

  await Promise.all(promises);

  editor.setDecorations(classDecorationType, [
    {
      hoverMessage: message,
      range,
    },
  ]);
}

async function decoratePluginFunctions(editor: TextEditor, plugin: Plugin, pluginUri: Uri) {
  const pluginMethods = await getPluginMethods(pluginUri);
  const sourceCode = editor.document.getText();

  pluginMethods.forEach((method) => {
    const regex = new RegExp(`function\\s+${method}\\s*\\(`);
    const match = sourceCode.match(regex);

    if (!match) {
      return;
    }

    const offset = 9;

    const range = new Range(
      editor.document.positionAt(match.index! + offset),
      editor.document.positionAt(match.index! + offset + method.length)
    );

    const link = `[${plugin.pluginClass}](${pluginUri})`;
    const message = new MarkdownString(`**Magento Toolbox:**\n\n`);
    message.appendMarkdown(`Intercepted by plugins:\n`);
    message.appendMarkdown(`- ${link} [(di.xml)](${plugin.diUri})\n`);

    editor.setDecorations(methodDecorationType, [
      {
        hoverMessage: message,
        range,
      },
    ]);
  });
}

async function getPluginMethods(uri: Uri) {
  const pluginFile = await PhpFile.fromUri(uri);
  const pluginClass = first(pluginFile.classes);

  if (!pluginClass) {
    return [];
  }

  return pluginClass.methods
    .filter((method) => isPluginMethod(method.name))
    .map((method) => {
      return pluginMethodToMethodName(method.name);
    });
}

function getClassAndNamespace(editor: TextEditor) {
  const sourceCode = editor.document.getText();
  const namespaceRegex = /namespace\s([^;]+)/;
  const classRegex = /(class)\s(\w+)/;

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
