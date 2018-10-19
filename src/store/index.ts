import { Reducer } from 'redux';
import { combineReducers } from 'redux';
import mnistReducer from './mnist/reducer';
import { MnistState } from './mnist/types'
import {AppState} from "./app/types";
import appReducer from "./app/reducer";

export interface ApplicationState {
    app: AppState;
    predictions: MnistState;
}

export const reducers: Reducer<ApplicationState> = combineReducers<ApplicationState>({
    app: appReducer,
    predictions: mnistReducer
});