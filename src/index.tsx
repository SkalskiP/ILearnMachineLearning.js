import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { RootView } from './RootView';
import { Store } from 'redux';
import { ApplicationState } from './store/index';
import configureStore from './configureStore';
import {setDeviceAsMobile} from "./store/app/actions";
import {AppSettings} from "./settings/AppSettings";

const store: Store<ApplicationState> = configureStore();

const isDeviceMobile = (isMobile:boolean) => store.dispatch(setDeviceAsMobile(isMobile));

const handleResize = () => {
    const isMobile:boolean = window.innerWidth < AppSettings.MOBILE_BORDER_WIDTH;
    isDeviceMobile(isMobile);

};

handleResize()
window.addEventListener("resize", handleResize);

const startingPoint = (
  <Provider store={store}>
    <BrowserRouter>
      <RootView/>
    </BrowserRouter>
  </Provider>
);


ReactDOM.render(
  startingPoint,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
