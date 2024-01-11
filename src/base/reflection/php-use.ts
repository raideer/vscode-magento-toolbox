import { UseItem } from 'php-parser';
import { NodeKind } from './ast';
import { PhpNode } from './php-node';
import { PhpFile } from './php-file';
import { last } from 'lodash-es';

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
