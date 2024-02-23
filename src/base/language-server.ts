import * as path from 'path';

import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from 'vscode-languageclient/node';
import { ext } from './variables';

let client: LanguageClient;

export async function activateLs() {
  // The server is implemented in node
  const serverModule = ext.context!.asAbsolutePath(path.join('server', 'out', 'server.js'));

  const debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };

  // If the extension is launched in debug mode then the debug server options are used
  // Otherwise the run options are used
  const serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: debugOptions,
    },
  };

  // Options to control the language client
  const clientOptions: LanguageClientOptions = {
    // Register the server for all documents by default
    documentSelector: [{ scheme: 'file', pattern: '**/*.{xml,php,phtml}' }],
  };

  // Create the language client and start the client.
  client = new LanguageClient(
    'magento2-language-server',
    'Magento2 Language Server',
    serverOptions,
    clientOptions
  );

  // Start the client. This will also launch the server
  await client.start();
}

export function deactivateLs(): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}
