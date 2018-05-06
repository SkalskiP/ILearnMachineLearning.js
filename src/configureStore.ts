import { applyMiddleware, createStore, Store } from 'redux';
import { ApplicationState, reducers } from './store';

export default function configureStore(
    initialState: ApplicationState
): Store<ApplicationState> {
    return createStore<ApplicationState>(
        reducers,
        initialState
    )
}