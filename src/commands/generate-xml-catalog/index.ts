import { MagentoCLI } from 'base/magento-cli';
import { execCommand, getActiveWorkspaceFolder } from 'utils/vscode';
import { Uri, extensions, window, workspace } from 'vscode';

const REDHAT_XML_EXTENSION = 'redhat.vscode-xml';

export default async function () {
  if (!extensions.getExtension(REDHAT_XML_EXTENSION)) {
    const response = await window.showWarningMessage(
      `This command requires ${REDHAT_XML_EXTENSION} extension to be installed.`,
      'Install',
      'Cancel'
    );

    if (response === 'Install') {
      const out = await execCommand(`code --install-extension ${REDHAT_XML_EXTENSION}`);

      console.log(out);
    }
    return;
  }

  const workspaceUri = getActiveWorkspaceFolder()?.uri;

  if (!workspaceUri) {
    window.showWarningMessage(`This command requires a workspace to be opened.`);
    return;
  }

  const catalogLocation = Uri.joinPath(workspaceUri, '.vscode/magento-catalog.xml');
  const magentoCLi = new MagentoCLI();
  await magentoCLi.run(`dev:urn-catalog:generate ${catalogLocation.fsPath}`);
}
