import { Action } from 'redux';
import {FullScreenMode} from "../../data/FullScreenMode";

export interface AppState {
    isMobile:boolean;
    fullScreenMode:FullScreenMode;
    isNotifiedOfDataConsumption:boolean;
    isModelLoading:boolean;
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
        fullScreenMode:FullScreenMode;
    }
}

export interface SetDataConsumptionNotificationStatus extends Action {
    type: '@@app/SET_DATA_CONSUMPTION_NOTIFICATION_STATUS';
    payload: {
        isNotifiedOfDataConsumption:boolean;
    }
}

export interface SetModelLoadingStatus extends Action {
    type: '@@app/SET_MODEL_LOADING_STATUS';
    payload: {
        isModelLoading:boolean;
    }
}

export type AppActions =
    | SetDeviceAsMobile
    | SetFullScreenMode
    | SetDataConsumptionNotificationStatus
    | SetModelLoadingStatus