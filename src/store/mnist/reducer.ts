import { Reducer } from 'redux';
import { MnistActions, MnistState } from './types';

export const initialState: MnistState = {
    predictionValues: []
};

export const mnistReducer: Reducer<MnistState> = (
  state: MnistState = initialState, 
  action: MnistActions
) => {
  
    switch ((action as MnistActions).type) {
      case '@@mnist/PREDICTIONS_LIST_UPDATED':
        return { ...state, predictionValues: action.payload.predictions };
      default:
        return state;
    }
  };
  
export default mnistReducer;