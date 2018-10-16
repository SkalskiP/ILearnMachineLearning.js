import {IPoint} from "../interfaces/IPoint";

export class MathUtil {

    public static getDistance(sourcePoint:IPoint, targetPoint:IPoint):number {
        return Math.sqrt(
            Math.pow(sourcePoint.x - targetPoint.x, 2) + Math.pow(sourcePoint.y - targetPoint.y, 2));
    }

    public static subtract(sourcePoint:IPoint, targetPoint:IPoint):IPoint {
        return {x: targetPoint.x - sourcePoint.x, y: targetPoint.y - sourcePoint.y};
    }

    public static scale(point:IPoint, factor:number):IPoint {
        return {x: point.x / factor, y: point.y / factor};
    }

    public static getLength(point:IPoint):number {
        return Math.sqrt(point.x * point.x + point.y * point.y);
    }


    public static normalize(vector:IPoint) {
        const vectorLength:number = MathUtil.getLength(vector);
        return MathUtil.scale(vector, vectorLength);
    }
}