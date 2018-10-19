import {IPoint} from "../../interfaces/IPoint";

export class Circle {

    public x:number;
    public y:number;
    public radius:number;

    constructor(x:number, y:number, radius:number) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    public translateByVector(vector:IPoint) {
        this.x = this.x + vector.x;
        this.y = this.y + vector.y;
        return this;
    }
}