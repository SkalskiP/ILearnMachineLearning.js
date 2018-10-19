import { createStore, Store } from 'redux';
import { ApplicationState, reducers } from './store';


const initialApplicationState: ApplicationState = {
    app: {
        isMobile: false,
        isFullScreen: false
    },
    predictions: {
        predictionValues: []
    }
  };

export default function configureStore(
    initialState: ApplicationState = initialApplicationState
): Store<ApplicationState> {
    return createStore<ApplicationState>(
        reducers,
        initialState
    )
}