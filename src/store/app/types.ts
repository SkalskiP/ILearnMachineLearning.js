import { Action } from 'redux';

export interface AppState {
    isMobile:boolean;
    isFullScreen:boolean;
}

export interface SetDeviceAsMobile extends Action {
    type: '@@app/SET_DEVICE_AS_MOBILE';
    payload: {
        isMobile:boolean;
    }
}

export interface SetFullScreenMode extends Action {
    type: '@@app/SET_FULL_SCREEN_MODE';
    payload: {
        isFullScreen:boolean;
    }
}
export type AppActions =
    | SetDeviceAsMobile
    | SetFullScreenMode