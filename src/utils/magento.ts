import { workspace, Uri, RelativePattern } from 'vscode';
import get from 'lodash-es/get';
import { uniq } from 'lodash-es';
import { parseXml } from './xml';
import { ext } from 'base/variables';

export const MAGENTO_ROOT_KEY = 'magentoToolbox/magentoRoot';

export async function resolveUriModule(uri: Uri) {
  const baseModulePath = uri.fsPath.match(/(.+app\/code\/[^\/]+\/[^\/]+)/);

  if (!baseModulePath) return null;

  const moduleXmlUri = Uri.file(baseModulePath[1] + '/etc/module.xml');

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
