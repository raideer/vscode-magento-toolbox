import * as vscode from 'vscode';
import { openTextDialog } from 'utils/vscode';
import { resolveMagentoRoot } from 'utils/magento';
import { exec } from 'child_process';

export default async function (context: vscode.ExtensionContext) {
  const magentoRoot = await resolveMagentoRoot(context);

  if (!magentoRoot) {
    vscode.window.showWarningMessage(`Could not find Magento root directory.`);
    return;
  }

  const binaryLocation = vscode.Uri.joinPath(magentoRoot, 'bin/magento');

  try {
    const binary = await vscode.workspace.fs.stat(binaryLocation);

    if (binary.type !== vscode.FileType.File) {
      vscode.window.showWarningMessage('bin/magento is not a file.');
      return;
    }
  } catch (err) {
    vscode.window.showWarningMessage(`Could not find Magento binary at ${binaryLocation.fsPath}.`);
    return;
  }

  const command = await openTextDialog('Enter command (eg. cache:flush)');

  exec(
    `php ${binaryLocation.fsPath} ${command}`,
    { cwd: magentoRoot.fsPath },
    (err, stdout, stderr) => {
      if (err) {
        vscode.window.showErrorMessage(`Error running command: ${err}`);
        return;
      }

      vscode.window.showInformationMessage(stdout);
    }
  );
}
