import { IRect } from './IRect';

export interface IDetectedObject {
    class:string,
    probability:number,
    rect:IRect
}