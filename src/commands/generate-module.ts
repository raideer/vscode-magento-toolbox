import * as fs from 'fs';
import * as vscode from 'vscode';
import { Builder } from 'xml2js';
import { openDirectoryDialog, openWebview } from 'utils/vscode';
import { resolveAppCode, resolveLoadedModules } from 'utils/magento';
import { generateComposerJson, generateLicense, generateModuleRegistration } from 'generator';

export default async function (context: vscode.ExtensionContext) {
  let targetLocation = resolveAppCode();

  if (!targetLocation) {
    const directory = await openDirectoryDialog('Select module directory (app/code)');
    targetLocation = directory.path;
  }

  if (!targetLocation) {
    return;
  }

  const loadedModules = await resolveLoadedModules(targetLocation);

  const data: any = await openWebview(context, 'NewModule', 'Generate Module', {
    loadedModules,
  });

  const moduleName = `${data.vendor}_${data.module}`;

  const moduleDirectory = `${targetLocation}/${data.vendor}/${data.module}`;

  // Set up directories
  fs.mkdirSync(`${moduleDirectory}/etc`, { recursive: true });

  // Generate registration.php
  const registration = await generateModuleRegistration({
    moduleName,
    license: null,
  });
  fs.writeFileSync(`${moduleDirectory}/registration.php`, Buffer.from(registration, 'utf-8'));

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
  fs.writeFileSync(`${moduleDirectory}/etc/module.xml`, Buffer.from(moduleXml, 'utf-8'));

  // Generate LICENSE.txt
  if (data.license && data.license !== 'none') {
    const license = await generateLicense(data.license, {
      year: new Date().getFullYear(),
      copyright: data.copyright || data.vendor,
    });

    fs.writeFileSync(`${moduleDirectory}/LICENSE.txt`, Buffer.from(license, 'utf-8'));
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

    fs.writeFileSync(`${moduleDirectory}/composer.json`, Buffer.from(json, 'utf-8'));
  }

  vscode.window.showInformationMessage(`Generated module: ${moduleName}`);
}
