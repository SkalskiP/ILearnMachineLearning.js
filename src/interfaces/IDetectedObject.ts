import { Rect } from '../utils/geometry/Rect';

export interface IDetectedObject {
    class:string,
    probability:number,
    rect:Rect
}