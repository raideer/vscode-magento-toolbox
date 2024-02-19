import { KindType, NodeKind, searchAst } from './ast';

export abstract class PhpNode<K = NodeKind> {
  constructor(public ast: KindType<K>) {}

  public searchAst<S extends NodeKind>(kind: S) {
    return searchAst<S>(this.ast, kind);
  }
}
