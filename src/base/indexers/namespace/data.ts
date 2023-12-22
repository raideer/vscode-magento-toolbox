import { trimStart } from 'lodash-es';
import { Uri } from 'vscode';

interface Namespace {
  uri: Uri;
  namespace: string;
}

interface ClassNamespace {
  uri: Uri;
  className: string;
  namespace: string;
  subNamespace: string;
}

export class NamespaceIndexerData {
  public namespaces = new Map<string, Namespace>();

  public getClassNamespace(namespace: string): ClassNamespace | null {
    const classNamespace = trimStart(namespace, '\\');
    const parts = classNamespace.split('\\');

    for (let i = parts.length; i > 0; i--) {
      const baseNamespace = parts.slice(0, i).join('\\') + '\\';

      if (this.namespaces.has(baseNamespace)) {
        const namespaceData = this.namespaces.get(baseNamespace)!;
        const className = parts.pop()!;
        const subNamespace = parts.slice(i).join('\\');

        return {
          namespace: namespaceData.namespace,
          uri: namespaceData.uri,
          subNamespace,
          className,
        };
      }
    }

    return null;
  }
}
