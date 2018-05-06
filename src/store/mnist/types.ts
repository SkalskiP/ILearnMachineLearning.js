import { Action } from 'redux';

export interface MnistState {
    predictions:number[]
}

export interface IModelPredictions {
    predictions:number[]
}

export interface IPoint {
    x:number,
    y:number
}

export interface IPredictionsUpdatedAction extends Action {
    type: '@@mnist/PREDICTIONS_LIST_UPDATED';
    payload: {
        predictions:number[];
    };
}

export type MnistActions = IPredictionsUpdatedAction;