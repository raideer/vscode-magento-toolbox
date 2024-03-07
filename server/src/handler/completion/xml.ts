import {
  CompletionItem,
  CompletionItemKind,
  CompletionList,
  CompletionParams,
  ServerRequestHandler,
} from 'vscode-languageserver/node';

export const handleXmlCodeCompletion: ServerRequestHandler<
  CompletionParams,
  CompletionItem[] | CompletionList | undefined | null,
  CompletionItem[],
  void
> = (params) => {
  
};
