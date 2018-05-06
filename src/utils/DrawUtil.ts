import { IPoint } from '../interfaces/IPoint';

export class DrawUtil {

    public static drawLine(canvas:HTMLCanvasElement, startPoint:IPoint, endPoint:IPoint, color:string = "#111111", thickness:number = 25): void {
        let ctx:CanvasRenderingContext2D = canvas.getContext('2d');
        ctx.strokeStyle = color;
        ctx.lineWidth = thickness;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(endPoint.x + 1, endPoint.y + 1);
        ctx.stroke();
    }

    public static clearCanvas(canvas:HTMLCanvasElement): void {
        let ctx:CanvasRenderingContext2D = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    public static getImgData(canvas): ImageData {
        let scaled:HTMLCanvasElement = document.createElement("canvas");
        scaled.width = 28;
        scaled.height = 28;
        let scaledCtx:CanvasRenderingContext2D = scaled.getContext('2d');
        scaledCtx.drawImage(canvas, 0, 0, 28, 28);
        return scaledCtx.getImageData(0, 0, 28, 28);

        // let ctx:CanvasRenderingContext2D = canvas.getContext('2d');
        // const scaled = ctx.drawImage(canvas, 0, 0, 28, 28);
        // return ctx.getImageData(0, 0, 28, 28);
    }
}