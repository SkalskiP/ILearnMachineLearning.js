import { ActionCreator } from 'redux';
import { IPredictionsUpdatedAction } from './types';

export const updateModelPredictions: ActionCreator<IPredictionsUpdatedAction> = (predictions:number[]) => ({
    type: '@@mnist/PREDICTIONS_LIST_UPDATED',
    payload: {
        predictions,
    },
  });