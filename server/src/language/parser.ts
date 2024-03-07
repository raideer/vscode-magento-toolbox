import { join } from 'path';
import Parser from 'web-tree-sitter';

export enum TreeSitterLanguage {
  XML = 'tree-sitter-html',
}

const parsers = new Map<TreeSitterLanguage, Parser>();

export const getParser = async (language: TreeSitterLanguage) => {
  if (parsers.has(language)) {
    return parsers.get(language)!;
  }

  await Parser.init();

  const parser = new Parser();
  const lang = await Parser.Language.load(`${__dirname}/${language}.wasm`);
  parser.setLanguage(lang);

  parsers.set(language, parser);

  return parser;
};
