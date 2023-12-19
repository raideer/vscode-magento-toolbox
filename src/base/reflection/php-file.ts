import { Program } from 'php-parser';
import { NodeKind, parsePhpClass, searchAst } from './ast';
import { first } from 'lodash-es';
import { PhpClass } from './php-class';
import { TextEditor, Uri } from 'vscode';
import { PhpNode } from './php-node';
import { PhpUseItem } from './php-use';
import { Memoize } from 'typescript-memoize';

export class PhpFile extends PhpNode<NodeKind.Program> {
  constructor(ast: Program, public uri: Uri) {
    super(ast);
  }

  @Memoize()
  public get namespace() {
    const namespace = first(searchAst(this.ast, NodeKind.Namespace));

    if (!namespace) {
      throw new Error('No namespace found');
    }

    return namespace.name;
  }

  @Memoize()
  public get classes() {
    return this.searchAst(NodeKind.Class).map((ast) => new PhpClass(ast, this));
  }

  @Memoize()
  public get useItems() {
    return this.searchAst(NodeKind.UseItem).map((ast) => new PhpUseItem(ast, this));
  }

  public static fromTextEditor(editor: TextEditor) {
    const fullText = editor.document.getText();
    const ast = parsePhpClass(fullText, editor.document.fileName);

    return new PhpFile(ast, editor.document.uri);
  }
}
