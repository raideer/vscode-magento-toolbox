import * as php from 'php-parser';

const parser = new php.Engine({
  ast: {
    withPositions: true,
    extractDoc: true,
  },
});

export enum NodeKind {
  Program = 'program',
  Namespace = 'namespace',
  Class = 'class',
  Interface = 'interface',
  UseGroup = 'usegroup',
  UseItem = 'useitem',
  Method = 'method',
}

export type KindType<K> = K extends NodeKind.Program
  ? php.Program
  : K extends NodeKind.Namespace
  ? php.Namespace
  : K extends NodeKind.Class
  ? php.Class
  : K extends NodeKind.Method
  ? php.Method
  : K extends NodeKind.UseGroup
  ? php.UseGroup
  : K extends NodeKind.UseItem
  ? php.UseItem
  : K extends NodeKind.Interface
  ? php.Interface
  : never;

export const searchAst = <K extends NodeKind>(ast: any, kind: K): KindType<K>[] => {
  const results: KindType<K>[] = [];

  const search = (node: any) => {
    if (!node) return;

    if (Array.isArray(node)) {
      for (const item of node) {
        search(item);
      }
    } else {
      if (node.kind === kind) {
        results.push(node);
      }

      for (const key in node) {
        if (node[key] !== node) {
          search(node[key]);
        }
      }
    }
  };

  search(ast);
  return results;
};

export const parsePhpClass = (code: string, filename = 'file.php') => {
  return parser.parseCode(code, filename);
};

export const getIdentifierName = (node: php.Identifier | string) => {
  if (typeof node === 'string') {
    return node;
  }

  return node.name;
};
