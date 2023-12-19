import { Memoize } from 'typescript-memoize';
import { NodeKind, getIdentifierName } from './ast';
import { PhpMethod } from './php-method';
import { PhpNode } from './php-node';
import { Class } from 'php-parser';
import { PhpFile } from './php-file';

export class PhpClass extends PhpNode<NodeKind.Class> {
  constructor(ast: Class, public parent: PhpFile) {
    super(ast);
  }

  public get name() {
    return getIdentifierName(this.ast.name);
  }

  @Memoize()
  public get methods() {
    return this.searchAst(NodeKind.Method).map((ast) => new PhpMethod(ast, this));
  }
}
