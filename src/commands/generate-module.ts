import * as fs from 'fs';
import { generateModuleRegistration } from "../generator";
import { resolveAppCode } from "../utils";
import * as vscode from "vscode";
import { openDirectoryDialog, openWebview } from '../vscode';
import { Builder } from 'xml2js';

export default async function(context: vscode.ExtensionContext) {
    const data: any = await openWebview(context, 'NewModule');
    
    const moduleName = `${data.vendor}_${data.module}`;

    let targetLocation = await resolveAppCode();

    if (!targetLocation) {
      targetLocation = await openDirectoryDialog('Select module directory (app/code)');
    }

    if (!targetLocation) {
      return;
    }

    const moduleDirectory = `${targetLocation.fsPath}/${data.vendor}/${data.module}`;

    const moduleXmlObject: any = {
      config: {
        $: {
          'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
          'xsi:noNamespaceSchemaLocation': 'urn:magento:framework:Module/etc/module.xsd'
        },
        module: {
          $: {
            name: moduleName
          },
        }
      }
    };

    if (data.version) {
      moduleXmlObject.config.module.$['setup_version'] = data.version;
    }

    const xmlBuilder = new Builder({
      xmldec: {
        'version': '1.0'
      }
    });

    const moduleXml = xmlBuilder.buildObject(moduleXmlObject);

    const registration = await generateModuleRegistration({
        moduleName,
        license: null
    });
    
    fs.mkdirSync(`${moduleDirectory}/etc`, { recursive: true });
    fs.writeFileSync(`${moduleDirectory}/registration.php`, Buffer.from(registration, 'utf-8'));
    fs.writeFileSync(`${moduleDirectory}/etc/module.xml`, Buffer.from(moduleXml, 'utf-8'));

    vscode.window.showInformationMessage(`Generated module: ${moduleName}`);
}