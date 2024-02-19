import { Program } from 'php-parser';
import { first } from 'lodash-es';
import { TextEditor, Uri } from 'vscode';
import { Memoize } from 'typescript-memoize';
import { readFile } from 'utils/vscode';
import { NodeKind, parsePhpClass, searchAst } from './ast';
import { PhpClass } from './php-class';
import { PhpNode } from './php-node';
import { PhpUseItem } from './php-use';
import { PhpInterface } from './php-interface';

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
  public get interfaces() {
    return this.searchAst(NodeKind.Interface).map((ast) => new PhpInterface(ast, this));
  }

  @Memoize()
  public get useItems() {
    return this.searchAst(NodeKind.UseItem).map((ast) => new PhpUseItem(ast, this));
  }

  public static fromTextEditor(editor: TextEditor) {
    const fullText = editor.document.getText();
    return PhpFile.fromText(fullText, editor.document.uri);
  }

  public static fromText(text: string, uri: Uri) {
    const ast = parsePhpClass(text, uri.fsPath);
    return new PhpFile(ast, uri);
  }

  public static async fromUri(uri: Uri) {
    const text = await readFile(uri);
    return PhpFile.fromText(text, uri);
  }
}
