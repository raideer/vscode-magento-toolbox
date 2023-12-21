import { trimStart } from 'lodash-es';
import { Uri } from 'vscode';

interface Namespace {
  uri: Uri;
  namespace: string;
}

export class NamespaceIndexerData {
  public namespaces = new Map<string, Namespace>();

  public getNamespace(namespace: string) {
    const classNamespace = trimStart(namespace, '\\');
    const parts = classNamespace.split('\\');

    for (let i = parts.length; i > 0; i--) {
      const namespace = parts.slice(0, i).join('\\') + '\\';

      if (this.namespaces.has(namespace)) {
        return this.namespaces.get(namespace);
      }
    }

    return null;
  }
}
