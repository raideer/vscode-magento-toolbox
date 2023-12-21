import { RelativePattern, Uri, WorkspaceFolder, workspace } from 'vscode';
import { resolveMagentoRoot } from 'utils/magento';
import { NamespaceIndexerData } from './data';
import { Indexer } from '..';
import { isArray } from 'lodash-es';

export class NamespaceIndexer extends Indexer {
  protected data = new NamespaceIndexerData();

  public async index(workspaceFolder: WorkspaceFolder) {
    const magentoRoot = await resolveMagentoRoot(workspaceFolder);

    if (!magentoRoot) {
      throw new Error('Could not find Magento root directory.');
    }

    const files = await this.discoverComposerConfigs(magentoRoot);

    for (const file of files) {
      const contents = await workspace.fs.readFile(file);
      const composer = JSON.parse(contents.toString());

      if (!composer.autoload) {
        continue;
      }

      if (composer.autoload['psr-4']) {
        for (const namespace in composer.autoload['psr-4']) {
          const path = composer.autoload['psr-4'][namespace];
          const paths = isArray(path) ? path : [path];

          paths.forEach((path) => {
            const uri = Uri.joinPath(file, '..', path);
            this.data.namespaces.set(namespace, {
              uri,
              namespace,
            });
          });
        }
      } else if (composer.autoload['psr-0']) {
        for (const namespace in composer.autoload['psr-0']) {
          const path = composer.autoload['psr-0'][namespace];

          const paths = isArray(path) ? path : [path];

          paths.forEach((path) => {
            const uri = Uri.joinPath(file, '..', path, namespace.replace('\\\\', '/'));
            this.data.namespaces.set(namespace, {
              uri,
              namespace,
            });
          });
        }
      }
    }
  }

  public getData() {
    return this.data;
  }

  public getName(): string {
    return 'namespaces';
  }

  private async saveModuleNamespaces(composer: any) {}

  private async discoverComposerConfigs(root: Uri) {
    const pattern = new RelativePattern(root, '**/composer.json');
    const files = await workspace.findFiles(pattern);

    return files;
  }
}
