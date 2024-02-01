/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable import/no-mutable-exports */
import { ExtensionContext, WorkspaceFolder } from 'vscode';
import { WorkspaceIndex } from './indexers';

interface Ext {
  context?: ExtensionContext;
  workspaceIndex?: Map<WorkspaceFolder, WorkspaceIndex>;
}

export const ext: Ext = {};
