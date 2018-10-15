import { IPoint } from '../interfaces/IPoint';
import { ISize } from '../interfaces/ISize';
import { UnitUtil } from './UnitUtil';
import { IRect } from '../interfaces/IRect';
import { IDetectedObject } from '../interfaces/IDetectedObject';

export class DrawUtil {

    public static clearCanvas(canvas:HTMLCanvasElement): void {
        let ctx:CanvasRenderingContext2D = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    public static drawLine(canvas:HTMLCanvasElement, startPoint:IPoint, endPoint:IPoint, color:string = "#111111", thickness:number = 25): void {
        let ctx:CanvasRenderingContext2D = canvas.getContext('2d');
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = thickness;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(endPoint.x + 1, endPoint.y + 1);
        ctx.stroke();
        ctx.restore();
    }

    public static drawRect(canvas:HTMLCanvasElement, rect:IRect, color:string = "#fff", thickness:number = 1): void {
        let ctx:CanvasRenderingContext2D = canvas.getContext('2d');
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = thickness;
        ctx.beginPath();
        ctx.rect(rect.x, rect.y, rect.width, rect.height);
        ctx.stroke();
        ctx.restore();
    }

    public static shadeEverythingButRect(canvas:HTMLCanvasElement, rect:IRect, color:string = "rgba(0, 0, 0, 0.7)"): void {
        let ctx:CanvasRenderingContext2D = canvas.getContext('2d');
        ctx.save();
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
        ctx.restore();
    }

    public static drawFullCircle(canvas:HTMLCanvasElement, anchorPoint:IPoint, radius:number, color:string = "#ffffff"):void {
        const ctx:CanvasRenderingContext2D = canvas.getContext('2d');
        ctx.save();
        const startAngleRad = UnitUtil.deg2rad(0);
        const endAngleRad = UnitUtil.deg2rad(360);
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(anchorPoint.x, anchorPoint.y, radius, startAngleRad, endAngleRad, false);
        ctx.fill();
        ctx.restore();
    }

    public static drawCircle(canvas:HTMLCanvasElement, anchorPoint:IPoint, radius:number, startAngleDeg:number, endAngleDeg:number, thickness:number = 20, color:string = "#ffffff"): void {
        let ctx:CanvasRenderingContext2D = canvas.getContext('2d');
        let startAngleRad = UnitUtil.deg2rad(startAngleDeg);
        let endAngleRad = UnitUtil.deg2rad(endAngleDeg);
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = thickness;
        ctx.beginPath();
        ctx.arc(anchorPoint.x, anchorPoint.y, radius, startAngleRad, endAngleRad, false);
        ctx.stroke();
        ctx.restore();
    }

    public static drawCircleWithGradient(canvas:HTMLCanvasElement, anchorPoint:IPoint, radius:number, startAngleDeg:number, endAngleDeg:number, thickness:number = 20, colorStart:string = "#ff6138", colorEnd:string = "#ffB700"): void {
        let ctx:CanvasRenderingContext2D = canvas.getContext('2d');
        let startAngleRad = UnitUtil.deg2rad(startAngleDeg);
        let endAngleRad = UnitUtil.deg2rad(endAngleDeg);
        let smallCord = Math.min(anchorPoint.x, anchorPoint.y);
        let gradient = ctx.createLinearGradient(0, anchorPoint.y - smallCord, 2 * anchorPoint.x, anchorPoint.y + smallCord);
        gradient.addColorStop(0, colorStart);
        gradient.addColorStop(1, colorEnd);
        ctx.save();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = thickness;
        ctx.beginPath();
        ctx.arc(anchorPoint.x, anchorPoint.y, radius, startAngleRad, endAngleRad, false);
        ctx.stroke();
        ctx.restore();
    }

    public static drawText(canvas:HTMLCanvasElement, text:string, textSize:number, anchorPoint:IPoint, color:string = "#ffffff", bold:boolean = false):void {
        let ctx:CanvasRenderingContext2D = canvas.getContext('2d');
        ctx.save();
        ctx.fillStyle = color;
        ctx.textAlign = "center";
        ctx.textBaseline="middle"; 
        ctx.font = (bold ? "bold " : "") + textSize + "px Titillium Web";
        ctx.fillText(text, anchorPoint.x, anchorPoint.y); 
        ctx.restore();
    }

    public static drawPredictionRect(canvas:HTMLCanvasElement, prediction:IDetectedObject, thickness:number = 1, color:string = "#fff", textSize:number = 10): void {
        DrawUtil.drawRect(canvas, prediction.rect, color, thickness);
        let ctx:CanvasRenderingContext2D = canvas.getContext('2d');
        ctx.save();
        ctx.font = "bold " + textSize + "px Titillium Web";
        let txt = prediction.class + " " + prediction.probability.toFixed(2);
        let padding = 2;
        let width = ctx.measureText(txt).width; 
        ctx.fillStyle = color;
        ctx.textAlign = "start";
        ctx.textBaseline = "top";
        ctx.fillRect(prediction.rect.x, prediction.rect.y, width + padding * 2, textSize + padding * 2);
        ctx.fillStyle = "#fff";
        ctx.fillText(txt, prediction.rect.x + padding, prediction.rect.y);
        ctx.restore();
    }

    public static getImageDataAndScale(canvas:HTMLCanvasElement, outputSize:ISize): ImageData {
        let scaled:HTMLCanvasElement = document.createElement("canvas");
        let scaledCtx:CanvasRenderingContext2D = scaled.getContext('2d');
        scaled.width = outputSize.width;
        scaled.height = outputSize.height;
        scaledCtx.drawImage(canvas, 0, 0, outputSize.width, outputSize.height);
        return scaledCtx.getImageData(0, 0, outputSize.width, outputSize.height);
    }

    public static getRandomRGBColor():string {
        return "rgb(" + Math.round(Math.random() * 255) + "," + Math.round(Math.random() * 255) + "," + Math.round(Math.random() * 255) + ")";
    }
}