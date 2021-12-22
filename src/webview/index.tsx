import { render } from 'preact';
import NewModule from './components/NewModule';

declare global {
  interface Window {
    acquireVsCodeApi(): any;
  }
}

const vscode = window.acquireVsCodeApi();
const root = document.getElementById('root');

if (root) {
  window.addEventListener('message', event => {
    const message = event.data;
  
    switch (message.command) {
      case 'renderNewModule':
        render(<NewModule vscode={vscode} />, root);
        break;
    }
  });

  render(<div>Loading...</div>, root);
  vscode.postMessage({ command: 'loaded' });
}

