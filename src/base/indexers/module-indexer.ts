import { Indexer, IndexerData } from 'base/indexer';
import { get, uniqBy } from 'lodash-es';
import { parseXml } from 'utils/xml';
import { RelativePattern, Uri, WorkspaceFolder, workspace } from 'vscode';

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
  modules: Map<string, MagentoModule>;
}

export class ModuleIndexerData implements IndexerData<ModuleIndex> {
  constructor(public data: ModuleIndex) {}

  public getModule(name: string) {
    return this.data.modules.get(name);
  }

  public getModuleList() {
    return Array.from(this.data.modules.keys());
  }
}

export class ModuleIndexer implements Indexer<ModuleIndex> {
  public name = 'modules';

  protected data: Partial<ModuleIndex> = {
    modules: new Map(),
  };

  public async index(workspaceFolder: WorkspaceFolder) {
    const magentoRoot = await this.resolveMagentoRoot(workspaceFolder);

    if (!magentoRoot) {
      throw new Error('Could not find Magento root directory.');
    }

    this.data.appCode = Uri.joinPath(magentoRoot, 'app/code');
    this.data.magentoRoot = magentoRoot;

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
          path: Uri.joinPath(file, '../..'),
          location: file.path.includes('vendor') ? 'vendor' : 'app/code',
          dependencies: sequence.map((item: any) => item.$.name),
        };
      })
    );

    modules.forEach((module) => {
      this.data.modules!.set(module.name, module);
    });
  }

  private async resolveMagentoRoot(workspaceFolder: WorkspaceFolder) {
    const { uri } = workspaceFolder;

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

    return null;
  }
}
