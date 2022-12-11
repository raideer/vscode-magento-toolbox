import { createRoot } from 'react-dom/client';
import { Renderer } from './components/Wizard/Renderer';

import './styles.css';

const vscode = window.acquireVsCodeApi();
const container = document.getElementById('root');

if (!container) {
  throw new Error('Container not found');
}

const root = createRoot(container);

window.addEventListener('message', (event) => {
  const message = event.data;

  switch (message.command) {
    case 'render-wizard':
      root.render(<Renderer vscode={vscode} wizard={message.payload} />);
      break;
    default:
      console.warn('Unknown command: ', message.command);
  }
});

root.render(<div>Loading...</div>);
vscode.postMessage({ command: 'loaded' });
