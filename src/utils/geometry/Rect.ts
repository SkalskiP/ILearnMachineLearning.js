import { IRect } from '../../interfaces/IRect';
import { Point } from './Point';
import { IPoint } from '../../interfaces/IPoint';

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

    public translateByVector(vector:IPoint) {
        this.x = this.x + vector.x;
        this.y = this.y + vector.y;
        return this;
    }

    public inflate(vector:IPoint) {
        this.x = this.x - vector.x;
        this.y = this.y - vector.y;
        this.width = this.width + 2*vector.x;
        this.height = this.height + 2*vector.y;
        return this;
    }

    public toString() {
        return("{x: " + this.x + ", y: " + this.y + ", width: " + this.width + ", height: " + this.height + "}");
    }
}
