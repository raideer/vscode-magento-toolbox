import { UseItem } from 'php-parser';
import { last } from 'lodash-es';
import { NodeKind } from './ast';
import { PhpNode } from './php-node';
import { PhpFile } from './php-file';

export class PhpUseItem extends PhpNode<NodeKind.UseItem> {
  constructor(ast: UseItem, public parent: PhpFile) {
    super(ast);
  }

  public get fullName() {
    if (this.ast.alias) {
      return this.ast.alias.name;
    }
    return this.ast.name;
  }

  public get name() {
    if (this.ast.alias) {
      return this.ast.alias.name;
    }

    const parts = this.ast.name.split('\\');
    return last(parts)!;
  }
}
