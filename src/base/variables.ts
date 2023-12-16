import { MagentoIndex } from 'base/indexer';
import { ExtensionContext } from 'vscode';

export namespace ext {
  export let context: ExtensionContext;
  export let index: MagentoIndex;
}
