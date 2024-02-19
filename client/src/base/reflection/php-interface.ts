import { Interface } from 'php-parser';
import { NodeKind, getIdentifierName } from './ast';
import { PhpFile } from './php-file';
import { PhpNode } from './php-node';

export class PhpInterface extends PhpNode<NodeKind.Interface> {
  constructor(ast: Interface, public parent: PhpFile) {
    super(ast);
  }

  public get name() {
    return getIdentifierName(this.ast.name);
  }
}
