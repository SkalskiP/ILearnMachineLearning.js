import { Action } from 'redux';

export interface MnistState {
    predictionValues:number[]
}

export interface IModelPredictions {
    predictions:number[]
}

export interface IPredictionsUpdatedAction extends Action {
    type: '@@mnist/PREDICTIONS_LIST_UPDATED';
    payload: {
        predictions:number[];
    };
}

export type MnistActions = IPredictionsUpdatedAction;