import { IPoint } from '../interfaces/IPoint';
import { ISize } from '../interfaces/ISize';
import { UnitUtil } from './UnitUtil';

export class DrawUtil {

    public static clearCanvas(canvas:HTMLCanvasElement): void {
        let ctx:CanvasRenderingContext2D = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

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

    public static drawCircle(canvas:HTMLCanvasElement, anchorPoint:IPoint, radius:number, startAngleDeg:number, endAngleDeg:number, color:string = "#ffffff", thickness:number = 20): void {
        let ctx:CanvasRenderingContext2D = canvas.getContext('2d');
        let startAngleRad = UnitUtil.deg2rad(startAngleDeg);
        let endAngleRad = UnitUtil.deg2rad(endAngleDeg);

        ctx.strokeStyle = color;
        ctx.lineWidth = thickness;
        ctx.beginPath();
        ctx.arc(anchorPoint.x, anchorPoint.y, radius, startAngleRad, endAngleRad, false);
        ctx.stroke();
    }

    public static drawText(canvas:HTMLCanvasElement, text:string, textSize:number, anchorPoint:IPoint, color:string = "#ffffff") {
        let ctx:CanvasRenderingContext2D = canvas.getContext('2d');
        
        ctx.fillStyle = color;
        ctx.textAlign = "center";
        ctx.textBaseline="middle"; 
        ctx.font = textSize + "px Titillium Web";
        ctx.fillText(text, anchorPoint.x, anchorPoint.y); 
    }

    public static getImageDataAndScale(canvas:HTMLCanvasElement, outputSize:ISize): ImageData {
        let scaled:HTMLCanvasElement = document.createElement("canvas");
        let scaledCtx:CanvasRenderingContext2D = scaled.getContext('2d');
        scaled.width = outputSize.width;
        scaled.height = outputSize.height;
        scaledCtx.drawImage(canvas, 0, 0, outputSize.width, outputSize.height);
        return scaledCtx.getImageData(0, 0, outputSize.width, outputSize.height);
    }
}