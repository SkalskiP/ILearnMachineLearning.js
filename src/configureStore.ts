import { createStore, Store, applyMiddleware } from 'redux';
import { ApplicationState, reducers } from './store';
import {createLogger} from "redux-logger";
import {FullScreenMode} from "./data/FullScreenMode";

const initialApplicationState: ApplicationState = {
    app: {
        isMobile: false,
        fullScreenMode: FullScreenMode.UNKNOWN,
        isNotifiedOfDataConsumption: false,
        isModelLoading: false
    },
    predictions: {
        predictionValues: []
    }
  };

const logger = createLogger();

export default function configureStore(
    initialState: ApplicationState = initialApplicationState
): Store<ApplicationState> {
    return createStore<ApplicationState>(
        reducers,
        initialState,
        applyMiddleware(logger)
    )
}