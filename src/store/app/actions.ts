import { ActionCreator } from 'redux';
import {
    SetDeviceAsMobile,
    SetFullScreenMode
} from './types';

export const setDeviceAsMobile: ActionCreator<SetDeviceAsMobile> = (isDeviceMobile:boolean) => ({
    type: '@@app/SET_DEVICE_AS_MOBILE',
    payload: {
        isMobile: isDeviceMobile
    }
});

export const setFullScreenMode: ActionCreator<SetFullScreenMode> = (isFullScreenOn:boolean) => ({
    type: '@@app/SET_FULL_SCREEN_MODE',
    payload: {
        isFullScreen: isFullScreenOn
    }
});