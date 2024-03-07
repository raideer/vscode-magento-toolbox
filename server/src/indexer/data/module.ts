import { readFile } from 'fs/promises';
import Parser from 'web-tree-sitter';
import { first, tail } from 'lodash-es';
import { TreeSitterLanguage, getParser } from 'language/parser';
import { join } from 'path';

export interface Module {
  name: string;
  location: string;
  sequence: string[];
}

export const indexModule = async (path: string): Promise<Module> => {
  await Parser.init();
  const file = await readFile(path);
  const parser = await getParser(TreeSitterLanguage.XML);
  const tree = parser.parse(file.toString());

  const matches = tree
    .getLanguage()
    .query(
      `(element
    (_
      ((tag_name) @tag (#eq? @tag module)
        (attribute
            ((attribute_name) @name (#eq? @name name)
                (quoted_attribute_value
                    (attribute_value) @module_name
                  )
              )
          )
      )
    )
  )`
    )
    .matches(tree.rootNode);

  const modules = matches.map((match) => {
    const name = match.captures.find((capture) => capture.name === 'module_name');

    return name!.node.text;
  });

  const module = first(modules);
  const moduleLocation = join(path, '../..');

  return {
    name: module as string,
    location: moduleLocation,
    sequence: tail(modules),
  };
};
