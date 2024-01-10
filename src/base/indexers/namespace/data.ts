import { trimStart } from 'lodash-es';
import { fileExists } from 'utils/vscode';
import { Uri } from 'vscode';

interface Namespace {
  directories: Uri[];
  namespace: string;
}

interface ClassNamespace {
  uri: Uri;
  fileUri: Uri;
  className: string;
  namespace: string;
  baseNamespace: string;
  subNamespace: string;
}

export class NamespaceIndexerData {
  public namespaces = new Map<string, Namespace>();

  public async getClassNamespace(namespace: string): Promise<ClassNamespace | null> {
    const classNamespace = trimStart(namespace, '\\');
    const parts = classNamespace.split('\\');

    for (let i = parts.length; i > 0; i--) {
      const baseNamespace = parts.slice(0, i).join('\\') + '\\';

      if (!this.namespaces.has(baseNamespace)) {
        continue;
      }

      const namespaceData = this.namespaces.get(baseNamespace)!;
      const className = parts.pop()!;
      const subNamespace = parts.slice(i).join('\\');
      const namespace = `${subNamespace}\\${className}`;

      const uri = await this.getFileDirectory(namespace, namespaceData.directories);

      if (!uri) {
        continue;
      }

      const fileUri = Uri.joinPath(uri, `${namespace}.php`);

      return {
        baseNamespace: namespaceData.namespace,
        fileUri,
        uri,
        subNamespace,
        namespace,
        className,
      };
    }

    return null;
  }

  private async getFileDirectory(namespace: string, directories: Uri[]) {
    for (const directory of directories) {
      const classPath = namespace.replace(/\\/g, '/');
      const fileUri = Uri.joinPath(directory, `${classPath}.php`);
      const exists = await fileExists(fileUri);

      if (exists) {
        return directory;
      }
    }

    return null;
  }
}
