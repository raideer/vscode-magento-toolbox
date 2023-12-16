import { ExtensionContext } from 'vscode';
import { MagentoIndex } from './indexer';

export namespace ext {
  export let context: ExtensionContext;
  export let index: MagentoIndex;
}
