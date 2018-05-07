import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { RootView } from './RootView';
import { Store } from 'redux';
import { ApplicationState } from './store/index';
import configureStore from './configureStore';
import { Provider } from 'react-redux';

const store: Store<ApplicationState> = configureStore();

const startingPoint = (
  <Provider store={store}>
      <RootView />
  </Provider>
);


ReactDOM.render(
  startingPoint,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
