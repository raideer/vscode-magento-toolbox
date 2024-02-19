import { workspace, Uri, WorkspaceFolder } from 'vscode';
import get from 'lodash-es/get';
import { lowerFirst, trimStart } from 'lodash-es';
import { parseXml } from './xml';

export const MAGENTO_ROOT_KEY = 'magentoToolbox/magentoRoot';

export async function resolveUriModule(uri: Uri) {
  const baseModulePath = uri.fsPath.match(/(.+app\/code\/[^/]+\/[^/]+)/);

  if (!baseModulePath) return null;

  const moduleXmlUri = Uri.file(`${baseModulePath[1]}/etc/module.xml`);

  const moduleXml = await workspace.fs.readFile(moduleXmlUri);
  const xml = await parseXml(moduleXml.toString());
  const module = get(xml, 'config.module[0].$.name');

  return module;
}

export function getScopedPath(basePath: string, scope: string, filename: string) {
  return scope === 'all' ? `${basePath}/${filename}` : `${basePath}/${scope}/${filename}`;
}

export function getModuleUri(appCodeUri: Uri, module: string) {
  const [v, m] = module.split('_');
  return Uri.joinPath(appCodeUri, `${v}/${m}`);
}

export function cleanNamespace(namespace: string) {
  return trimStart(namespace, '\\');
}

export async function resolveMagentoRoot(workspaceFolder: WorkspaceFolder) {
  const { uri } = workspaceFolder;

  const testPaths = [
    Uri.joinPath(uri, 'app/etc'),
    Uri.joinPath(uri, 'bin'),
    Uri.joinPath(uri, 'var'),
  ];

  const status = await Promise.all(
    testPaths.map(async (test) => {
      try {
        await workspace.fs.stat(test);
      } catch (e) {
        return false;
      }

      return true;
    })
  );

  if (status.every((exists) => exists)) {
    return uri;
  }

  return null;
}

export function isPluginMethod(method: string) {
  return /^around|^before|^after/.test(method);
}

export function pluginMethodToMethodName(method: string) {
  return lowerFirst(method.replace(/^around|^before|^after/, ''));
}
