import * as vscode from 'vscode';
import { getModuleUri, resolveLoadedModules, resolveMagentoRoot } from 'utils/magento';
import { generateModuleRegistration } from 'generators/generateModuleRegistration';
import { generateModuleXml } from 'generators/generateModuleXml';
import { generateLicense } from 'generators/generateLicense';
import { generateComposerJson } from 'generators/generateComposerJson';
import { moduleWizard } from './module-wizard';
import { openFile, refreshFileExplorer, writeFile } from 'utils/vscode';

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

  const moduleDirectory = getModuleUri(appCodeUri, moduleName);

  // Generate registration.php
  const registration = await generateModuleRegistration({
    moduleName,
    license: null,
  });

  await writeFile(vscode.Uri.joinPath(moduleDirectory, 'registration.php'), registration);

  // Generate module.xml
  const moduleXml = generateModuleXml({ ...data, moduleName });
  const moduleXmlPath = vscode.Uri.joinPath(moduleDirectory, 'etc/module.xml');

  await writeFile(moduleXmlPath, moduleXml);

  // Generate LICENSE.txt
  if (data.license && data.license !== 'none') {
    const license = await generateLicense(data.license, {
      year: new Date().getFullYear(),
      copyright: data.copyright || data.vendor,
    });

    await writeFile(
      vscode.Uri.joinPath(moduleDirectory, 'LICENSE.txt'),
      license
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

    await writeFile(
      vscode.Uri.joinPath(moduleDirectory, 'composer.json'),
      json
    );
  }

  vscode.window.showInformationMessage(`Generated module: ${moduleName}`);
  refreshFileExplorer()
  await openFile(moduleXmlPath)
}
