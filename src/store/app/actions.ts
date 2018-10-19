import {ActionCreator} from 'redux';
import {SetDataConsumptionNotificationStatus, SetDeviceAsMobile, SetFullScreenMode} from './types';
import {FullScreenMode} from "../../data/FullScreenMode";

export const setDeviceAsMobile: ActionCreator<SetDeviceAsMobile> = (status:boolean) => ({
    type: '@@app/SET_DEVICE_AS_MOBILE',
    payload: {
        isMobile: status
    }
});

export const setFullScreenMode: ActionCreator<SetFullScreenMode> = (mode:FullScreenMode) => ({
    type: '@@app/SET_FULL_SCREEN_MODE',
    payload: {
        fullScreenMode: mode
    }
});

export const setDataConsumptionNotificationStatus: ActionCreator<SetDataConsumptionNotificationStatus> =
    (status:boolean) => ({
    type: '@@app/SET_DATA_CONSUMPTION_NOTIFICATION_STATUS',
    payload: {
        isNotifiedOfDataConsumption: status
    }
});