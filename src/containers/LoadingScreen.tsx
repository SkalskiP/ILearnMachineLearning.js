import * as React from 'react';
import { Rect } from '../utils/geometry/Rect';
import { Point } from '../utils/geometry/Point';
import { DrawUtil } from '../utils/DrawUtil';
import { UnitUtil } from '../utils/UnitUtil';

export class LoadingScreen extends React.Component {

    protected canvasWrapper:HTMLDivElement;
    protected canvas:HTMLCanvasElement;
    protected canvasRect:Rect;

    public componentDidMount() {
        this.setUpCanvas();
        this.animate();
    }

    protected setUpCanvas = () => {
        const canvasWrapperRect = this.canvasWrapper.getBoundingClientRect();
        this.canvas.width = canvasWrapperRect.width;
        this.canvas.height = canvasWrapperRect.height
        this.canvasRect = new Rect(0, 0, canvasWrapperRect.width, canvasWrapperRect.height);
    }

    protected animate() {

        let center:Point = this.canvasRect.getCenterPoint();
        let canvas = this.canvas;
        let radious1 = Math.min(center.x, center.y) * 0.5;
        let angleDiffDeg1 = 120;
        let startAngleDeg1= 0;

        let radious2 = Math.min(center.x, center.y) * 0.4;
        let angleDiffDeg2 = 90;
        let startAngleDeg2= 0;

        let step = function() {
            DrawUtil.clearCanvas(canvas);
            let endAngleRad1 = (startAngleDeg1 + angleDiffDeg1) % 360;
            let startAngleRad1 = startAngleDeg1 % 360;
            startAngleDeg1 += 2;

            let endAngleRad2 = (startAngleDeg2 + angleDiffDeg2) % 360;
            let startAngleRad2 = startAngleDeg2 % 360;
            startAngleDeg2 -= 3;
            
            DrawUtil.drawCircleWithGradient(canvas, center, radious1, startAngleRad1, endAngleRad1, 20);
            DrawUtil.drawCircle(canvas, center, radious2, startAngleRad2, endAngleRad2, 10, "#fff");
            DrawUtil.drawText(canvas, "Loading model...", 20, center, "#fff", true);

            requestAnimationFrame(step);
        }
        return step();
    }

    public render() {

        return(
            <div className="LoadingScreen" ref = {ref => this.canvasWrapper = ref}>
                <canvas className={"AnimationCanvas"} ref = {ref => this.canvas = ref}/>
            </div>
        );
    }
}
