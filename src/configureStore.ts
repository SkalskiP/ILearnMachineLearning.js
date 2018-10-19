import { createStore, Store, applyMiddleware } from 'redux';
import { ApplicationState, reducers } from './store';
import {createLogger} from "redux-logger";

const initialApplicationState: ApplicationState = {
    app: {
        isMobile: false,
        isFullScreen: false
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