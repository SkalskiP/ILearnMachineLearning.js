import {IPoint} from "../interfaces/IPoint";

export class MouseUtil {

    public static clientCoordinatesFromEvent(event:any):IPoint {
        if ("clientX" in event)
            return {x: event.clientX, y: event.clientY};
        else if (typeof event.touches !== "undefined" && event.touches.length)
            return {x: event.touches[0].clientX, y: event.touches[0].clientY};
        else
            return null;
    }
}
