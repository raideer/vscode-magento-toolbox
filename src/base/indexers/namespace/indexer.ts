import { Progress, RelativePattern, Uri, WorkspaceFolder, workspace } from 'vscode';
import { resolveMagentoRoot } from 'utils/magento';
import { isArray } from 'lodash-es';
import { NamespaceIndexerData } from './data';
import { Indexer } from '../indexer';

export class NamespaceIndexer extends Indexer {
  protected data = new NamespaceIndexerData();

  public async index(
    workspaceFolder: WorkspaceFolder,
    progress: Progress<{
      message?: string;
      increment?: number;
    }>
  ) {
    const magentoRoot = await resolveMagentoRoot(workspaceFolder);

    if (!magentoRoot) {
      throw new Error('Could not find Magento root directory.');
    }

    progress.report({ message: `Running ${this.getName()} indexer (scanning)` });

    const files = await this.discoverComposerConfigs(magentoRoot);

    let i = 0;

    const promises = files.map(async (file) => {
      await this.processComposerConfig(file);
      // eslint-disable-next-line no-plusplus
      progress.report({ message: `Running ${this.getName()} indexer (${++i}/${files.length})` });
    });

    await Promise.all(promises);
  }

  private async processComposerConfig(file: Uri) {
    const contents = await workspace.fs.readFile(file);
    const composer = JSON.parse(contents.toString());

    if (!composer.autoload) {
      return;
    }

    if (composer.autoload['psr-4']) {
      for (const namespace in composer.autoload['psr-4']) {
        const autoloadPath = composer.autoload['psr-4'][namespace];
        const paths = isArray(autoloadPath) ? autoloadPath : [autoloadPath];

        paths.forEach((path) => {
          const uri = Uri.joinPath(file, '..', path);
          this.saveNamespace(namespace, uri);
        });
      }
    }

    if (composer.autoload['psr-0']) {
      for (const namespace in composer.autoload['psr-0']) {
        const autoloadPath = composer.autoload['psr-0'][namespace];

        const paths = isArray(autoloadPath) ? autoloadPath : [autoloadPath];

        paths.forEach((path) => {
          const uri = Uri.joinPath(file, '..', path, namespace.replace('\\\\', '/'));
          this.saveNamespace(namespace, uri);
        });
      }
    }
  }

  private saveNamespace(namespace: string, uri: Uri) {
    const key = namespace === '' ? '\\' : namespace;

    if (this.data.namespaces.has(key)) {
      const namespaceData = this.data.namespaces.get(key)!;
      namespaceData.directories.push(uri);
      return;
    }

    this.data.namespaces.set(key, {
      directories: [uri],
      namespace: key,
    });
  }

  public getData() {
    return this.data;
  }

  public getName(): string {
    return 'namespaces';
  }

  private async discoverComposerConfigs(root: Uri) {
    const pattern = new RelativePattern(root, '**/composer.json');
    const files = await workspace.findFiles(pattern, 'dev/**');

    return files;
  }
}
