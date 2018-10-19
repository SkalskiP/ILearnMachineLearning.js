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
                isFullScreen: action.payload.isFullScreen
            };
        default:
            return state;
    }
};

export default appReducer;