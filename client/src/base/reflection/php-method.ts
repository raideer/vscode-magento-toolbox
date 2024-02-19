import { Method } from 'php-parser';
import { NodeKind, getIdentifierName } from './ast';
import { PhpNode } from './php-node';
import { PhpClass } from './php-class';

export class PhpMethod extends PhpNode<NodeKind.Method> {
  constructor(ast: Method, public parent: PhpClass) {
    super(ast);
  }

  public get name() {
    return getIdentifierName(this.ast.name);
  }
}
