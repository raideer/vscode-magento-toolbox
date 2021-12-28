import { FileType, workspace } from 'vscode';
import * as fs from 'fs';
import { stream } from 'fast-glob';
import get from 'lodash-es/get';
import { parseXml } from './xml';

export function resolveAppCode() {
  for (const i in workspace.workspaceFolders) {
    const {
      uri: { path },
    } = workspace.workspaceFolders[Number(i)];

    const directory = `${path}/app/code`;

    if (fs.existsSync(directory)) {
      return directory;
    }
  }

  return null;
}

export async function resolveLoadedModules(appCode: string) {
  const loadedModules: string[] = [];

  if (appCode) {
    const modules = stream(`${appCode}/**/module.xml`);
    for await (const entry of modules) {
      const xml = fs.readFileSync(entry, 'utf8');
      const magentoModule = await parseXml(xml);
      const name = get(magentoModule, 'config.module[0].$.name');
      loadedModules.push(name);
    }
  }

  return loadedModules;
}
