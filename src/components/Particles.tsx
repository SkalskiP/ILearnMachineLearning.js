import * as React from "react";
import {DrawUtil} from "../utils/DrawUtil";
import {AnimatedCircle} from "../utils/geometry/AnimatiedCircle";
import {ParticlesAnimationUtil} from "../utils/ParticlesAnimationUtil";
import {MathUtil} from "../utils/MathUtil";
import {IPoint} from "../interfaces/IPoint";
import {MouseUtil} from "../utils/MouseUtil";

export class Particles extends React.Component {

    private canvas:HTMLCanvasElement;
    private mainDiv:HTMLDivElement;
    private mousePosition:IPoint = null;

    public componentDidMount() {
        this.handleResize();
        window.addEventListener("resize", this.handleResize);
        window.addEventListener("deviceorientation", this.handleResize);

        if (!!this.canvas) {
            this.canvas.addEventListener("mousemove", this.handleMouseMove);
            this.canvas.addEventListener("touchmove", this.handleMouseMove);
            this.canvas.addEventListener("touchend", this.clearMousePosition);
        }

        this.animate();
    };

    public componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
        window.removeEventListener("deviceorientation", this.handleResize);

        if (!!this.canvas) {
            this.canvas.removeEventListener("mousemove", this.handleMouseMove);
            this.canvas.removeEventListener("touchmove", this.handleMouseMove);
            this.canvas.removeEventListener("touchend", this.clearMousePosition);
        }
    };

    public handleMouseMove = (event) => {
        const clientMousePosition = MouseUtil.clientCoordinatesFromEvent(event);
        event.preventDefault();
        event.stopPropagation();
        if (clientMousePosition && !!this.canvas) {
            const canvasRect = this.canvas.getBoundingClientRect();
            this.mousePosition = {x: clientMousePosition.x - canvasRect.left, y: clientMousePosition.y - canvasRect.top};
        }
    };

    public clearMousePosition = () => {
        this.mousePosition = null;
    };

    public handleResize = () => {
        if (!this.mainDiv || !this.canvas)
            return;

        const mainDivSize = this.mainDiv.getBoundingClientRect();
        this.canvas.width = mainDivSize.width;
        this.canvas.height = mainDivSize.height;
    };

    public animate = () => {
        let animationWidth:number = this.canvas.width;
        let animationHeight:number = this.canvas.height;
        const quantity:number = Math.floor(animationHeight * animationWidth / 10000);
        const circles:AnimatedCircle[] = ParticlesAnimationUtil.generateRandomAnimatedCircles(quantity, animationWidth, animationHeight);

        const loop = () => {
            requestAnimationFrame(loop);
            let animationWidth:number = this.canvas.width;
            let animationHeight:number = this.canvas.height;
            DrawUtil.clearCanvas(this.canvas);

            for(let i = 0; i < circles.length; i ++) {
                for(let j = i + 1; j < circles.length; j ++) {
                    let firstPoint = {x: circles[i].x, y: circles[i].y};
                    let secondPoint = {x: circles[j].x, y: circles[j].y};

                    if (i !== j && MathUtil.getDistance(firstPoint, secondPoint) < 100) {
                        DrawUtil.drawLine(this.canvas, firstPoint, secondPoint, "#999999", 1);
                    }
                }
            }

            circles.forEach((circle:AnimatedCircle) => {
                DrawUtil.drawFullCircle(this.canvas, {x: circle.x, y: circle.y}, circle.radius, "#999999");
                circle.update(0, animationWidth, 0, animationHeight);
                if (this.mousePosition) {
                    const distanceVector:IPoint = MathUtil.subtract(circle as IPoint, this.mousePosition);
                    if (MathUtil.getLength(distanceVector) < 200) {
                        const directionVector:IPoint = MathUtil.normalize(distanceVector);
                        circle.translateByVector(MathUtil.scale(directionVector, 1));
                    }

                }

            });
        };
        loop();
    };

    public render() {

        return(
            <div className="Particles"
                 ref={(ref) => this.mainDiv = ref}
            >
                <canvas
                    ref={(ref) => this.canvas = ref}
                />
            </div>
        )
    }
}