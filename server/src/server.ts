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
import { indexWorkspace } from './indexer';

const connection = createConnection(ProposedFeatures.all);
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

connection.onInitialize(async (params: InitializeParams) => {
  const result: InitializeResult = {
    capabilities: {
      definitionProvider: true,
      completionProvider: {
        triggerCharacters: ['\\'],
      },
      textDocumentSync: TextDocumentSyncKind.Incremental,
    },
  };

  const workspaceFolders = params.workspaceFolders ?? [];

  await Promise.all(
    workspaceFolders.map((workspace) => {
      return indexWorkspace(workspace);
    })
  );

  return result;
});

connection.onCompletion(handleCodeCompletion);

documents.listen(connection);
connection.listen();
