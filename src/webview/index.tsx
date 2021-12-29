import { render } from 'preact';
import NewModule from './components/NewModule';

const vscode = window.acquireVsCodeApi();
const root = document.getElementById('root');

if (root) {
  window.addEventListener('message', (event) => {
    const message = event.data;

    switch (message.command) {
      case 'renderNewModule':
        render(<NewModule vscode={vscode} data={message.payload} />, root);
        break;
      default:
        console.warn('Unknown command: ', message.command);
    }
  });

  render(<div>Loading...</div>, root);
  vscode.postMessage({ command: 'loaded' });
}
