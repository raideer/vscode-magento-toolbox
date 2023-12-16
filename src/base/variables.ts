import { WorkspaceIndex } from 'base/indexer';
import { ExtensionContext, WorkspaceFolder } from 'vscode';

export namespace ext {
  export let context: ExtensionContext;
  export let workspaceIndex: Map<WorkspaceFolder, WorkspaceIndex>;
}
