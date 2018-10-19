import {Circle} from "./Circle";

export class AnimatedCircle extends Circle {

    public dx:number;
    public dy:number;

    constructor(x:number, y:number, radius:number, dx:number, dy:number) {
        super(x, y, radius);
        this.dx = dx;
        this.dy = dy;
    }

    public bounceOf(minX:number, maxX:number, minY:number, maxY:number) {
        if (this.x + this.radius > maxX || this.x - this.radius < minX)
            this.dx = - this.dx;

        if (this.y + this.radius > maxY || this.y - this.radius < minY)
            this.dy = - this.dy;
    }

    public setNewPositionWhenOut(minX:number, maxX:number, minY:number, maxY:number) {
        if (this.x > maxX || this.x < minX || this.y > maxY || this.y < minY) {
            this.x = Math.random() * maxX;
            this.y = Math.random() * maxY;
        }
    }

    public update() {
        this.translateByVector({x: this.dx, y: this.dy})
    }
}