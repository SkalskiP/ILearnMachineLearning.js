import {Point} from "./geometry/Point";

export class MathUtil {
    public static getDistance(primalPoint:Point, destinationPoint:Point):number {
        return Math.sqrt(
            Math.pow(primalPoint.x - destinationPoint.x, 2) + Math.pow(primalPoint.y - destinationPoint.y, 2));
    }
}