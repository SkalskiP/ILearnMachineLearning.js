import { Reducer } from 'redux';
import { combineReducers } from 'redux';
import mnistReducer from './mnist/reducer';
import { MnistState } from './mnist/types'

export interface ApplicationState {
    predictions: MnistState;
}

export const reducers: Reducer<ApplicationState> = combineReducers<ApplicationState>({
    predictions: mnistReducer
});