import {
  CompletionItem,
  CompletionItemKind,
  CompletionList,
  CompletionParams,
  ServerRequestHandler,
} from 'vscode-languageserver/node';
import { handleXmlCodeCompletion } from './completion/xml';

export const handleCodeCompletion: ServerRequestHandler<
  CompletionParams,
  CompletionItem[] | CompletionList | undefined | null,
  CompletionItem[],
  void
> = (params, ...rest) => {
  if (params.textDocument.uri.endsWith('.xml')) {
    return handleXmlCodeCompletion(params, ...rest);
  }
};