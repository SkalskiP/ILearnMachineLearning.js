import * as React from "react";
import {DrawUtil} from "../../utils/DrawUtil";
import {AnimatedCircle} from "../../utils/geometry/AnimatiedCircle";
import {ParticlesAnimationUtil} from "../../utils/ParticlesAnimationUtil";
import {MathUtil} from "../../utils/MathUtil";
import {IPoint} from "../../interfaces/IPoint";
import {MouseUtil} from "../../utils/MouseUtil";

export class Particles extends React.Component {

    protected canvas:HTMLCanvasElement;
    protected mainDiv:HTMLDivElement;
    protected mousePosition:IPoint = null;
    protected stopAnimation:boolean = false;

    // SETTINGS - MAGIC NUMBERS

    protected dotsToAreaRatio:number = 1/10000;
    protected inactivePadding:number = 10;
    protected maxLineLength:number = 150;
    protected gravityReach:number = 200;

    public componentDidMount() {
        this.handleResize();
        window.addEventListener("resize", this.handleResize);
        window.addEventListener("deviceorientation", this.handleResize);

        if (!!this.canvas) {
            // window.addEventListener("mousemove", this.handleMouseMove);
            // window.addEventListener("touchmove", this.handleMouseMove);
            // window.addEventListener("touchend", this.clearMousePosition);
        }

        this.animate();
    };

    public componentWillUnmount() {
        this.stopAnimation = true;
        window.removeEventListener("resize", this.handleResize);
        window.removeEventListener("deviceorientation", this.handleResize);

        if (!!this.canvas) {
            // window.removeEventListener("mousemove", this.handleMouseMove);
            // window.removeEventListener("touchmove", this.handleMouseMove);
            // window.removeEventListener("touchend", this.clearMousePosition);
        }
    };

    public handleMouseMove = (event) => {
        const clientMousePosition = MouseUtil.clientCoordinatesFromEvent(event);
        event.preventDefault();
        event.stopPropagation();
        if (clientMousePosition && !!this.canvas) {
            const canvasRect = this.canvas.getBoundingClientRect();
            const padding = this.inactivePadding;
            const newPositionX:number = clientMousePosition.x - canvasRect.left;
            const newPositionY:number = clientMousePosition.y - canvasRect.top;
            if (newPositionX < padding || newPositionX > canvasRect.width - padding ||
                newPositionY < padding || newPositionY > canvasRect.height - padding) {
                this.clearMousePosition()
            }
            else {
                this.mousePosition = {x: newPositionX, y: newPositionY};
            }
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
        const quantity:number = Math.floor(animationHeight * animationWidth * this.dotsToAreaRatio);
        const circles:AnimatedCircle[] = ParticlesAnimationUtil.generateRandomAnimatedCircles(quantity, animationWidth, animationHeight);

        const loop = () => {
            if(this.stopAnimation)
                return;

            requestAnimationFrame(loop);
            let animationWidth:number = this.canvas.width;
            let animationHeight:number = this.canvas.height;
            DrawUtil.clearCanvas(this.canvas);

            // DRAWING LINES

            for(let i = 0; i < circles.length; i ++) {
                for(let j = i + 1; j < circles.length; j ++) {
                    let firstPoint = {x: circles[i].x, y: circles[i].y};
                    let secondPoint = {x: circles[j].x, y: circles[j].y};

                    const distance:number = MathUtil.getDistance(firstPoint, secondPoint);
                    if (i !== j && distance < this.maxLineLength) {
                        const lineAlpha:number = (this.maxLineLength - distance)/this.maxLineLength;
                        const lineColor:string = `rgba(221, 221, 221, ${lineAlpha})`;
                        DrawUtil.drawLine(this.canvas, firstPoint, secondPoint, lineColor, 1);
                    }
                }
            }

            // DRAWING AND POINT UPDATE

            circles.forEach((circle:AnimatedCircle) => {
                DrawUtil.drawFullCircle(this.canvas, {x: circle.x, y: circle.y}, circle.radius, "#ddd");
                circle.bounceOf(0, animationWidth, 0, animationHeight);
                circle.setNewPositionWhenOut(0, animationWidth, 0, animationHeight);
                circle.update();
                if (this.mousePosition) {
                    const distanceVector:IPoint = MathUtil.subtract(circle as IPoint, this.mousePosition);
                    if (MathUtil.getLength(distanceVector) < this.gravityReach) {
                        const directionVector:IPoint = MathUtil.normalize(distanceVector);
                        circle.translateByVector(MathUtil.scale(directionVector, 2));
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