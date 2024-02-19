import { execCommand, fileExists, getActiveWorkspaceFolder } from 'utils/vscode';
import { workspace, window, Uri } from 'vscode';

export class MagentoCLI {
  private cliUri: Uri | undefined;

  async init() {
    const cliLocation = workspace.getConfiguration('magento-toolbox').get<string>('magentoCliPath');

    if (!cliLocation) {
      return;
    }

    const workspaceUri = getActiveWorkspaceFolder()?.uri;

    if (!workspaceUri) {
      return;
    }

    const cliUri = Uri.joinPath(workspaceUri, cliLocation);

    const cliExists = await fileExists(cliUri);

    if (!cliExists) {
      return;
    }

    this.cliUri = cliUri;
  }

  async run(command: string, args: string[] = []) {
    if (!this.cliUri) {
      await this.init();

      if (!this.cliUri) {
        window.showWarningMessage(
          `Magento CLI location is invalid. Please set it in your settings.`
        );
        return;
      }
    }

    const cliUser = workspace.getConfiguration('magento-toolbox').get<string>('magentoCliUser');

    const prefix = cliUser ? `sudo -u ${cliUser} ` : '';
    const cliCommand = `${prefix}php ${this.cliUri.fsPath} ${command} ${args.join(' ')}`;
    const workspaceUri = getActiveWorkspaceFolder()!.uri;

    const output = await execCommand(cliCommand, { cwd: workspaceUri.fsPath });

    return output;
  }
}
