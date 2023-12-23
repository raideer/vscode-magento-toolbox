import { Program } from 'php-parser';
import { NodeKind, parsePhpClass, searchAst } from './ast';
import { first } from 'lodash-es';
import { PhpClass } from './php-class';
import { TextEditor, Uri } from 'vscode';
import { PhpNode } from './php-node';
import { PhpUseItem } from './php-use';
import { Memoize } from 'typescript-memoize';
import { loadXml } from 'utils/xml';
import { readFile } from 'utils/vscode';

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
