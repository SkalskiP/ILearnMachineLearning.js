import { Reducer } from 'redux';
import {
    AppState,
    AppActions
} from './types';

export const appReducer: Reducer<AppState> = (
    state: AppState = null,
    action: AppActions
) => {
    switch (action.type) {
        case '@@app/SET_DEVICE_AS_MOBILE':
            return {
                ...state,
                isMobile: action.payload.isMobile
            };
        case '@@app/SET_FULL_SCREEN_MODE':
            return {
                ...state,
                fullScreenMode: action.payload.fullScreenMode
            };
        case '@@app/SET_DATA_CONSUMPTION_NOTIFICATION_STATUS':
            return {
                ...state,
                isNotifiedOfDataConsumption: action.payload.isNotifiedOfDataConsumption
            };
        default:
            return state;
    }
};

export default appReducer;