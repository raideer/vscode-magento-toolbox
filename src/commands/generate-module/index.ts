import * as vscode from 'vscode';
import { resolveLoadedModules, resolveMagentoRoot } from 'utils/magento';
import { generateModuleRegistration } from 'generators/generateModuleRegistration';
import { generateModuleXml } from 'generators/generateModuleXml';
import { generateLicense } from 'generators/generateLicense';
import { generateComposerJson } from 'generators/generateComposerJson';
import { moduleWizard } from './module-wizard';

export default async function (context: vscode.ExtensionContext) {
  const magentoRoot = await resolveMagentoRoot(context);

  if (!magentoRoot) {
    vscode.window.showWarningMessage(`Could not find Magento root directory.`);
    return;
  }

  const appCodeUri = vscode.Uri.joinPath(magentoRoot, 'app/code');

  const loadedModules = await resolveLoadedModules(magentoRoot);

  const data = await moduleWizard(context, loadedModules);

  const moduleName = `${data.vendor}_${data.module}`;

  const moduleDirectory = vscode.Uri.joinPath(appCodeUri, `${data.vendor}/${data.module}`);

  // Generate registration.php
  const registration = await generateModuleRegistration({
    moduleName,
    license: null,
  });

  await vscode.workspace.fs.writeFile(
    vscode.Uri.joinPath(moduleDirectory, 'registration.php'),
    Buffer.from(registration, 'utf-8')
  );

  // Generate module.xml
  const moduleXml = generateModuleXml({ ...data, moduleName });

  await vscode.workspace.fs.writeFile(
    vscode.Uri.joinPath(moduleDirectory, 'etc/module.xml'),
    Buffer.from(moduleXml, 'utf-8')
  );

  // Generate LICENSE.txt
  if (data.license && data.license !== 'none') {
    const license = await generateLicense(data.license, {
      year: new Date().getFullYear(),
      copyright: data.copyright || data.vendor,
    });

    await vscode.workspace.fs.writeFile(
      vscode.Uri.joinPath(moduleDirectory, 'LICENSE.txt'),
      Buffer.from(license, 'utf-8')
    );
  }

  // Generate composer.json
  if (data.composer) {
    const json = generateComposerJson({
      vendor: data.vendor,
      module: data.module,
      name: data.composerName,
      description: data.composerDescription,
      license: data.license,
      version: data.version,
    });

    await vscode.workspace.fs.writeFile(
      vscode.Uri.joinPath(moduleDirectory, 'composer.json'),
      Buffer.from(json, 'utf-8')
    );
  }

  vscode.window.showInformationMessage(`Generated module: ${moduleName}`);
  vscode.commands.executeCommand('workbench.files.action.refreshFilesExplorer');
}
