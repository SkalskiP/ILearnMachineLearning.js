import * as React from "react";
import {connect} from "react-redux";
import {ApplicationState} from "../../store";
import {AppSettings} from "../../settings/AppSettings";
import {IPoint} from "../../interfaces/IPoint";
import {DrawUtil} from "../../utils/DrawUtil";

interface Props {
    predictions?:number[];
}

interface State {
    targetValues:number[];
}

class LineChartComponent extends React.Component<Props, State> {
    protected canvas:HTMLCanvasElement = null;
    protected mainDiv:HTMLDivElement = null;

    constructor(props: Props) {
        super(props);
        this.state = {
            targetValues: []
        };
    }

    public componentDidMount() {
        this.canvas.width = 0;
        this.canvas.height = 0;
        this.setUpCanvas();
    }

    public componentDidUpdate() {
        this.drawChart(this.props.predictions);
    }

    protected setUpCanvas() {
        if (!!this.canvas && !!this.mainDiv) {
            this.canvas.style.width ='100%';
            this.canvas.style.height='100%';
            this.canvas.width  = this.canvas.offsetWidth;
            this.canvas.height = this.canvas.offsetHeight;

            const ctx = this.canvas.getContext("2d");
            const linearGradient = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
            linearGradient.addColorStop(0, AppSettings.SECOND_ALTERNATIVE_COLOR);
            linearGradient.addColorStop(1, AppSettings.ALTERNATIVE_COLOR);
            ctx.fillStyle = linearGradient;
            ctx.fillRect(0,0, this.canvas.width, this.canvas.height);
        }
    }

    protected drawChart(prediction:number[]) {
        DrawUtil.clearCanvas(this.canvas);

        const ctx = this.canvas.getContext("2d");
        const linearGradient = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        linearGradient.addColorStop(0, AppSettings.SECOND_ALTERNATIVE_COLOR);
        linearGradient.addColorStop(1, AppSettings.ALTERNATIVE_COLOR);
        ctx.fillStyle = linearGradient;
        ctx.fillRect(0,0, this.canvas.width, this.canvas.height);

        const width:number = this.canvas.width;
        const height: number = this.canvas.height;
        const horizontalTick: number = width/(prediction.length - 1);

        const points:IPoint[] = [];

        prediction.forEach((pred:number, index:number) => {
            points.push({x: index * horizontalTick, y: height * (1 - pred)});
        });

        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.moveTo(0, height);
        points.forEach((point:IPoint) => {
            ctx.lineTo(point.x,point.y);
        });
        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fill();
    }

    public render() {
        return(
            <div
                className="LineChart"
                ref = {ref => this.mainDiv = ref}
            >
                <canvas
                    className="Board"
                    ref = {ref => this.canvas = ref}
                />
            </div>
        );
    }
}

const mapStateToProps = (state: ApplicationState) => ({
    predictions: state.predictions.predictionValues
});

export const LineChart = connect(mapStateToProps, null)(
    LineChartComponent
);