import { Indexer, IndexerData } from 'base/indexer';
import { get, uniqBy } from 'lodash-es';
import { parseXml } from 'utils/xml';
import { RelativePattern, Uri, workspace } from 'vscode';

export interface MagentoModule {
  name: string;
  vendor: string;
  module: string;
  path: Uri;
  location: 'vendor' | 'app/code';
  dependencies: string[];
}

export interface ModuleIndex {
  magentoRoot: Uri;
  appCode: Uri;
  modules: MagentoModule[];
}

export class ModuleIndexerData implements IndexerData<ModuleIndex> {
  constructor(public data: ModuleIndex) {}

  public getModule(name: string) {
    return this.data.modules.find((module) => module.name === name);
  }

  public getModuleList() {
    return this.data.modules.map((module) => module.name);
  }
}

export class ModuleIndexer implements Indexer<ModuleIndex> {
  public name = 'modules';

  protected data: Partial<ModuleIndex> = {
    modules: [],
  };

  public async index() {
    const magentoRoot = await this.resolveMagentoRoot();

    if (!magentoRoot) {
      throw new Error('Could not find Magento root directory.');
    }

    this.data.appCode = Uri.joinPath(magentoRoot, 'app/code');
    this.data.magentoRoot = magentoRoot;

    await new Promise((resolve) => setTimeout(resolve, 5000));

    await this.indexModules(magentoRoot);

    return new ModuleIndexerData(this.data as ModuleIndex);
  }

  private async indexModules(root: Uri) {
    const pattern = new RelativePattern(root, '**/etc/module.xml');
    const files = await workspace.findFiles(pattern);

    const modules: MagentoModule[] = await Promise.all(
      files.map(async (file) => {
        const data = await workspace.fs.readFile(file);
        const xml = await parseXml(data.toString());

        const module = get(xml, 'config.module[0].$.name');
        const sequence = get(xml, 'config.module[0].sequence[0].module', []);

        const [vendor, name] = module.split('_');

        return {
          name: module,
          vendor,
          module: name,
          path: Uri.joinPath(file, '..'),
          location: file.path.includes('vendor') ? 'vendor' : 'app/code',
          dependencies: sequence.map((item: any) => item.$.name),
        };
      })
    );

    this.data.modules = uniqBy(modules, 'name');
  }

  private async resolveMagentoRoot() {
    if (!workspace.workspaceFolders) return null;

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
          return uri;
        }
      } catch (e) {
        // Do nothing
      }
    }

    return null;
  }
}
