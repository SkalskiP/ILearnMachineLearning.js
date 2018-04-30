import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { RootView } from './RootView';

ReactDOM.render(
  <RootView />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
