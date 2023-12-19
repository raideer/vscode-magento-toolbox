import {
  Class,
  Engine,
  Identifier,
  Method,
  Namespace,
  Node,
  Program,
  UseGroup,
  UseItem,
} from 'php-parser';

const parser = new Engine({
  ast: {
    withPositions: true,
    extractDoc: true,
  },
});

export enum NodeKind {
  Program = 'program',
  Namespace = 'namespace',
  Class = 'class',
  UseGroup = 'usegroup',
  UseItem = 'useitem',
  Method = 'method',
}

export type KindType<K> = K extends NodeKind.Program
  ? Program
  : K extends NodeKind.Namespace
  ? Namespace
  : K extends NodeKind.Class
  ? Class
  : K extends NodeKind.Method
  ? Method
  : K extends NodeKind.UseGroup
  ? UseGroup
  : K extends NodeKind.UseItem
  ? UseItem
  : never;

export const searchAst = <K extends NodeKind>(ast: Node | Node[], kind: K): KindType<K>[] => {
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

export const getIdentifierName = (node: Identifier | string) => {
  if (typeof node === 'string') {
    return node;
  }

  return node.name;
};
