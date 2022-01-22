import * as vscode from 'vscode';
import { Builder } from 'xml2js';
import { openWebview } from 'utils/vscode';
import { resolveLoadedModules, resolveMagentoRoot } from 'utils/magento';
import { generateComposerJson, generateLicense, generateModuleRegistration } from 'generator';

export default async function (context: vscode.ExtensionContext) {
  const magentoRoot = await resolveMagentoRoot(context);

  if (!magentoRoot) {
    vscode.window.showWarningMessage(`Could not find Magento root directory.`);
    return;
  }

  const appCodeUri = vscode.Uri.joinPath(magentoRoot, 'app/code');

  const loadedModules = await resolveLoadedModules(magentoRoot);

  const data: any = await openWebview(context, 'NewModule', 'Generate Module', {
    loadedModules,
  });

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
  const xmlBuilder = new Builder({
    xmldec: {
      version: '1.0',
    },
    renderOpts: {
      pretty: true,
      indent: '    ',
      newline: '\n',
    },
  });

  const moduleXmlObject: any = {
    config: {
      $: {
        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        'xsi:noNamespaceSchemaLocation': 'urn:magento:framework:Module/etc/module.xsd',
      },
      module: {
        $: {
          name: moduleName,
        },
      },
    },
  };

  if (data.version) {
    moduleXmlObject.config.module.$.setup_version = data.version;
  }

  if (data.sequence) {
    moduleXmlObject.config.module.sequence = {
      module: data.sequence.map((item: string) => ({
        $: {
          name: item,
        },
      })),
    };
  }
  const moduleXml = xmlBuilder.buildObject(moduleXmlObject);
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
      description: data.description,
      license: data.license,
    });

    await vscode.workspace.fs.writeFile(
      vscode.Uri.joinPath(moduleDirectory, 'composer.json'),
      Buffer.from(json, 'utf-8')
    );
  }

  vscode.window.showInformationMessage(`Generated module: ${moduleName}`);
  vscode.commands.executeCommand('workbench.files.action.refreshFilesExplorer');
}
