import { applyMiddleware, createStore, Store } from 'redux';
import { ApplicationState, reducers } from './store';
import { MnistState } from './store/mnist/types';


const initialApplicationState: ApplicationState = {
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