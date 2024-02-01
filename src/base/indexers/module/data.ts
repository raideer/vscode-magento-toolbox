import { Uri } from 'vscode';

export interface MagentoModule {
  name: string;
  vendor: string;
  module: string;
  path: Uri;
  location: 'vendor' | 'app/code';
  dependencies: string[];
}

export interface ModuleIndex {
  magentoRoot: Uri;
  appCode: Uri;
  modules: Map<string, MagentoModule>;
}

export class ModuleIndexerData {
  constructor(
    public modules: Map<string, MagentoModule> = new Map(),
    public magentoRoot?: Uri,
    public appCode?: Uri
  ) {}

  public getModule(name: string) {
    return this.modules.get(name);
  }

  public getModuleList(location?: MagentoModule['location']) {
    const modules = Array.from(this.modules.keys());

    if (!location) {
      return modules;
    }

    return modules.filter((name) => this.modules.get(name)?.location === location);
  }
}
