import { URI, WorkspaceFolder } from 'vscode-languageserver';
import { glob } from 'glob';
import { Module, indexModule } from './data/module';

interface WorkspaceIndex {
  modules: Map<string, Module>;
}

const workspaceIndex = new Map<URI, WorkspaceIndex>();

export const indexWorkspace = async (workspaceFolder: WorkspaceFolder) => {
  const matches = await glob('**/module.xml', {
    cwd: workspaceFolder.uri,
  });

  const modules = await Promise.all(
    matches.map((location) => {
      return indexModule(location);
    })
  );

  workspaceIndex.set(workspaceFolder.uri, {
    modules: new Map(modules.map((module) => [module.name, module])),
  });
};
