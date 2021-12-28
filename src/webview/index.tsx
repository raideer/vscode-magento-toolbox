import { createContext, render } from 'preact';
import NewModule from './components/NewModule';

declare global {
  interface Window {
    acquireVsCodeApi(): any;
  }
}

export const Webview = createContext<any>(null);

const vscode = window.acquireVsCodeApi();
const root = document.getElementById('root');

if (root) {
  window.addEventListener('message', (event) => {
    const message = event.data;

    switch (message.command) {
      case 'renderNewModule':
        render(
          <Webview.Provider value={message.payload}>
            <NewModule vscode={vscode} />
          </Webview.Provider>,
          root
        );
        break;
      default:
        console.warn('Unknown command: ', message.command);
    }
  });

  render(<div>Loading...</div>, root);
  vscode.postMessage({ command: 'loaded' });
}
