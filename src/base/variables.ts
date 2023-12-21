import { ExtensionContext, WorkspaceFolder } from 'vscode';
import { WorkspaceIndex } from './indexers';

export namespace ext {
  export let context: ExtensionContext;
  export let workspaceIndex: Map<WorkspaceFolder, WorkspaceIndex>;
}
