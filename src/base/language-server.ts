import * as path from 'path';

import {
  Executable,
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
} from 'vscode-languageclient/node';
import { ext } from './variables';

let client: LanguageClient;

export async function activateLs() {
  const lsPath = ext.context!.asAbsolutePath(
    path.join('..', 'magento-language-server', 'bin', 'magento2ls')
  );

  const debugOptions = {
    env: {
      XDEBUG_MODE: 'debug',
      HOME: process.env.HOME,
      XDG_CACHE_HOME: process.env.XDG_CACHE_HOME,
    },
  };

  // If the extension is launched in debug mode then the debug server options are used
  // Otherwise the run options are used
  const serverOptions: ServerOptions = {
    run: { command: 'php', args: [lsPath, 'language-server'] },
    debug: {
      command: 'php',
      args: ['-dxdebug.start_with_request=1', lsPath, 'language-server'],
      options: debugOptions,
    },
  } as { run: Executable; debug: Executable };

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
