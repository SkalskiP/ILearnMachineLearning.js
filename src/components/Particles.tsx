import * as React from "react";
import {DrawUtil} from "../utils/DrawUtil";
import {AnimatedCircle} from "../utils/geometry/AnimatiedCircle";
import {ParticlesAnimationUtil} from "../utils/ParticlesAnimationUtil";
import {MathUtil} from "../utils/MathUtil";
import {Point} from "../utils/geometry/Point";

export class Particles extends React.Component {

    private canvas:HTMLCanvasElement;
    private mainDiv:HTMLDivElement;

    public componentDidMount() {
        this.handleResize();
        window.addEventListener("resize", this.handleResize);
        this.animate();
    };

    public componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
    };

    public handleResize = () => {
        if (!this.mainDiv || !this.canvas)
            return;

        const mainDivSize = this.mainDiv.getBoundingClientRect();
        this.canvas.width = mainDivSize.width;
        this.canvas.height = mainDivSize.height;
    };

    public animate = () => {
        const animationWidth:number = this.canvas.width;
        const animationHeight:number = this.canvas.height;
        const quantity:number = Math.floor(animationHeight / 100 * animationWidth / 100);
        const circles:AnimatedCircle[] = ParticlesAnimationUtil.generateRandomAnimatedCircles(quantity, animationWidth, animationHeight);

        const loop = () => {
            requestAnimationFrame(loop);
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