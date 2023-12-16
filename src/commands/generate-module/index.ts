import * as vscode from 'vscode';
import { getModuleUri } from 'utils/magento';
import { generateModuleXml } from 'generators/generateModuleXml';
import { moduleWizard } from './module-wizard';
import { openFile, refreshFileExplorer, writeFile } from 'utils/vscode';
import { generateModuleRegistration } from 'generators/template/registration';
import { generateLicense } from 'generators/template/license';
import { generateComposerJson } from 'generators/json/composer';
import { getWorkspaceIndex } from 'utils/extension';

export default async function () {
  const workspaceIndex = getWorkspaceIndex();
  const appCodeUri = workspaceIndex.modules.data.appCode;
  const loadedModules = workspaceIndex.modules.getModuleList();

  const data = await moduleWizard(loadedModules);

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

    await writeFile(vscode.Uri.joinPath(moduleDirectory, 'LICENSE.txt'), license);
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

    await writeFile(vscode.Uri.joinPath(moduleDirectory, 'composer.json'), json);
  }

  vscode.window.showInformationMessage(`Generated module: ${moduleName}`);
  refreshFileExplorer();
  await openFile(moduleXmlPath);
}
