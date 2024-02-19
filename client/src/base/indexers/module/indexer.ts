import { get } from 'lodash-es';
import { resolveMagentoRoot } from 'utils/magento';
import { parseXml } from 'utils/xml';
import { RelativePattern, Uri, WorkspaceFolder, workspace } from 'vscode';
import { Indexer } from '../indexer';
import { MagentoModule, ModuleIndexerData } from './data';

export class ModuleIndexer extends Indexer {
  protected data = new ModuleIndexerData();

  public async index(workspaceFolder: WorkspaceFolder) {
    const magentoRoot = await resolveMagentoRoot(workspaceFolder);

    if (!magentoRoot) {
      throw new Error('Could not find Magento root directory.');
    }

    this.data.appCode = Uri.joinPath(magentoRoot, 'app/code');
    this.data.magentoRoot = magentoRoot;

    await this.indexModules(magentoRoot);
  }

  public getData() {
    return this.data;
  }

  public getName(): string {
    return 'modules';
  }

  private async indexModules(root: Uri) {
    const pattern = new RelativePattern(root, '**/etc/module.xml');
    const ignorePattern = 'dev/**';
    const files = await workspace.findFiles(pattern, ignorePattern);

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
}
