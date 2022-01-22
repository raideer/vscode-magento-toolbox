import { render } from 'preact';
import Module from './components/Module';
import SystemConfig from './components/SystemConfig';

const vscode = window.acquireVsCodeApi();
const root = document.getElementById('root');

if (root) {
  window.addEventListener('message', (event) => {
    const message = event.data;

    switch (message.command) {
      case 'renderModule':
        render(<Module vscode={vscode} data={message.payload} />, root);
        break;
      case 'renderSystemConfig':
        render(<SystemConfig vscode={vscode} data={message.payload} />, root);
        break;
      default:
        console.warn('Unknown command: ', message.command);
    }
  });

  render(<div>Loading...</div>, root);
  vscode.postMessage({ command: 'loaded' });
}
