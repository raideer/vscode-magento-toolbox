import { workspace, Uri, ExtensionContext, RelativePattern } from 'vscode';
import get from 'lodash-es/get';
import { uniq } from 'lodash-es';
import { parseXml } from './xml';

export const MAGENTO_ROOT_KEY = 'magentoToolbox/magentoRoot';

export async function resolveMagentoRoot(context: ExtensionContext | null = null) {
  if (!workspace.workspaceFolders) return null;

  if (context) {
    const root = context.workspaceState.get(MAGENTO_ROOT_KEY);
    if (root) return Uri.parse(root as string);
  }

  const folders = workspace.workspaceFolders;

  for (const folder of folders) {
    const { uri } = folder;

    const testPaths = [
      Uri.joinPath(uri, 'app/etc'),
      Uri.joinPath(uri, 'bin'),
      Uri.joinPath(uri, 'var'),
    ];

    try {
      const status = await Promise.all(testPaths.map((test) => workspace.fs.stat(test)));

      if (status.every((exists) => exists)) {
        if (context) {
          context.workspaceState.update(MAGENTO_ROOT_KEY, uri.toString());
        }

        return uri;
      }
    } catch (e) {
      // Do nothing
    }
  }

  return null;
}

export async function resolveLoadedModules(uri: Uri) {
  const loadedModules: string[] = [];

  const pattern = new RelativePattern(uri, '**/etc/module.xml');
  const files = await workspace.findFiles(pattern);

  const fileData = await Promise.all(files.map((file) => workspace.fs.readFile(file)));
  const xmls = await Promise.all(fileData.map((xml) => parseXml(xml.toString())));

  for (const xml of xmls) {
    const module = get(xml, 'config.module[0].$.name');

    if (module) {
      loadedModules.push(module);
    }
  }

  return uniq(loadedModules);
}

export async function resolveUriModule(uri: Uri) {
  const baseModulePath = uri.fsPath.match(/(.+app\/code\/[^\/]+\/[^\/]+)/)

  if (!baseModulePath) return null;

  const moduleXmlUri = Uri.file(baseModulePath[1] + '/etc/module.xml')

  const moduleXml = await workspace.fs.readFile(moduleXmlUri)
  const xml = await parseXml(moduleXml.toString())
  const module = get(xml, 'config.module[0].$.name');

  return module
}

export function getScopedPath(basePath: string, scope: string, filename: string) {
  return scope === 'all' ? `${basePath}/${filename}`: `${basePath}/${scope}/${filename}`;
}

export function getModuleUri(appCodeUri: Uri, module: string){
  const [v, m] = module.split('_');
  return Uri.joinPath(appCodeUri, `${v}/${m}`);
}