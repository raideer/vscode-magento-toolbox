import {
  CompletionItem,
  CompletionList,
  CompletionParams,
  ServerRequestHandler,
} from 'vscode-languageserver/node';

export const handleCodeCompletion: ServerRequestHandler<
  CompletionParams,
  CompletionItem[] | CompletionList | undefined | null,
  CompletionItem[],
  void
> = () => {
  return [];
};
