import { ext } from 'base/variables';
import { fileExists } from 'utils/vscode';
import { MarkdownString, Uri, languages, workspace } from 'vscode';

export default () => {
  languages.registerHoverProvider('xml', {
    async provideHover(document, position, token) {
      const workspaceFolder = workspace.getWorkspaceFolder(document.uri);
      const workspaceIndex = ext.workspaceIndex?.get(workspaceFolder!);

      if (!workspaceIndex) {
        return;
      }

      const namespaceIndex = workspaceIndex.namespaces;

      const range = document.getWordRangeAtPosition(position, /([\w\\]+)/);
      const word = document.getText(range);

      const namespace = await namespaceIndex.getClassNamespace(word);

      if (!namespace) {
        return;
      }

      const exists = await fileExists(namespace.fileUri);

      if (!exists) {
        return;
      }

      const link = `Open [${word}](${namespace.fileUri})`;

      const markdown = new MarkdownString(`**Magento Toolbox:**\n\n`);
      markdown.appendMarkdown(`${link}\n\n`);

      return {
        contents: [markdown],
        range,
      };
    },
  });
};
