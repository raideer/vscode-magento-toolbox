import {
  createConnection,
  TextDocuments,
  ProposedFeatures,
  InitializeParams,
  TextDocumentSyncKind,
  InitializeResult,
} from 'vscode-languageserver/node';

import { TextDocument } from 'vscode-languageserver-textdocument';
import { handleCodeCompletion } from './handler/completion-handler';

const connection = createConnection(ProposedFeatures.all);
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

connection.onInitialize((params: InitializeParams) => {
  const result: InitializeResult = {
    capabilities: {
      definitionProvider: true,
      completionProvider: {
        triggerCharacters: ['\\'],
      },
      textDocumentSync: TextDocumentSyncKind.Incremental,
    },
  };

  return result;
});

connection.onCompletion(handleCodeCompletion);

documents.listen(connection);
connection.listen();
