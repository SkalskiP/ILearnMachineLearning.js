import { IRect } from '../../interfaces/IRect';
import { Point } from './Point';

export class Rect implements IRect {

    public x:number;
    public y:number;
    public width:number;
    public height:number;

    constructor(x:number, y:number, width:number, height:number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    public getCenterPoint():Point {
        let centerX:number = this.x + this.width/2;
        let centerY:number = this.y + this.height/2;
        return(new Point(centerX, centerY));
    }
}
