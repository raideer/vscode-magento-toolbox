import { MagentoCLI } from 'base/magento-cli';
import { get } from 'lodash-es';
import { execCommand, fileExists, getActiveWorkspaceFolder, writeFile } from 'utils/vscode';
import { buildXml, loadXml } from 'utils/xml';
import { ConfigurationTarget, Uri, extensions, window, workspace } from 'vscode';

const REDHAT_XML_EXTENSION = 'redhat.vscode-xml';

export default async function () {
  if (!extensions.getExtension(REDHAT_XML_EXTENSION)) {
    const response = await window.showWarningMessage(
      `This command requires ${REDHAT_XML_EXTENSION} extension to be installed.`,
      'Install',
      'Cancel'
    );

    if (response === 'Install') {
      await execCommand(`code --install-extension ${REDHAT_XML_EXTENSION}`);
    } else {
      return;
    }
  }

  const workspaceUri = getActiveWorkspaceFolder()?.uri;

  if (!workspaceUri) {
    window.showWarningMessage(`This command requires a workspace to be opened.`);
    return;
  }

  const catalogLocation = Uri.joinPath(workspaceUri, '.vscode/magento-catalog.xml');
  const magentoCLi = new MagentoCLI();
  await magentoCLi.run(`dev:urn-catalog:generate ${catalogLocation.fsPath}`);

  const generated = await fileExists(catalogLocation);

  if (!generated) {
    window.showErrorMessage(`Failed to generate XML catalog.`);
    return;
  }

  const catalogXml = await loadXml(catalogLocation);

  if (!catalogXml) {
    window.showErrorMessage(`Failed to load XML catalog.`);
    return;
  }

  const xmlCatalog: any = {
    catalog: {
      $: { xmlns: 'urn:oasis:names:tc:entity:xmlns:xml:catalog' },
      system: [],
    },
  };

  const components = get(catalogXml, 'project.component', []);

  for (const component of components) {
    if (!component.resource) {
      continue;
    }

    for (const resource of component.resource) {
      let { location } = resource.$;
      location = location.replace('$PROJECT_DIR$', workspaceUri.fsPath);
      xmlCatalog.catalog.system.push({
        $: {
          systemId: resource.$.url,
          uri: location,
        },
      });
    }
  }

  const vscodeCatalogXml = buildXml(xmlCatalog);
  await writeFile(catalogLocation, vscodeCatalogXml);

  const xmlConfig = workspace.getConfiguration('xml', workspaceUri);
  const catalogs = xmlConfig.get<string[]>('catalogs', []);

  if (!catalogs.includes(catalogLocation.fsPath)) {
    catalogs.push(catalogLocation.fsPath);
  }

  await xmlConfig.update('catalogs', catalogs, ConfigurationTarget.Workspace);
}
