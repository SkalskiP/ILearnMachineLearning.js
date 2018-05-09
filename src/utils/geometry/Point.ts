import { IPoint } from '../../interfaces/IPoint';

export class Point implements IPoint {

    public x:number;
    public y:number;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
