import * as React from 'react';
import { Dispatch, connect } from 'react-redux';
import { ApplicationState } from '../store/index';
import './../styles/CircleChart.css';
import { updateModelPredictions } from '../store/mnist/actions';
import { Point } from '../utils/geometry/Point';
import { Rect } from '../utils/geometry/Rect';
import { DrawUtil } from '../utils/DrawUtil';

interface Props {
    predictions:number[];
}

class CircleChartComponent extends React.Component<Props, {}> {
    
    protected chart:HTMLDivElement;
    protected canvas:HTMLCanvasElement;
    protected canvasRect:Rect;
    protected circlePaths:number[];

    // Settings
    protected startAngle:number = -90;
    protected maxAngle:number = 360;
    protected numberOfClasses:number = 10;
    protected baseCircleThickness:number = 15;
    protected inactiveCircleColor:string = "rgba(255,255,255,0.05)";
    protected activeCircleColor:string = "#fff"
    protected bestCircleColor:string = "#ef6c00"
    
    constructor(props: any) {
        super(props);
    }

    public componentDidMount() {
        this.setUpCanvas();
        this.initCirclePaths();
        this.initChart();
    }

    public componentDidUpdate() {
        this.initChart();
        this.drawChart();
    }

    protected initChart() {
        DrawUtil.clearCanvas(this.canvas);
        let chartCenter:Point = this.canvasRect.getCenterPoint();
        this.circlePaths.forEach((radious:number) => {
            DrawUtil.drawCircle(this.canvas, chartCenter, radious, 0, 360, this.inactiveCircleColor, this.baseCircleThickness);
        });
    }

    protected initCirclePaths():void {
        let maxCircleRadious:number = 0.9 * this.canvas.height/2;
        let minCircleRadious:number = 0.3 * this.canvas.height/2;
        let newCirclePaths:number[] = [];

        for(let i = 1; i <= this.numberOfClasses; i++) {
            newCirclePaths.push(minCircleRadious + (maxCircleRadious - minCircleRadious) * i/this.numberOfClasses);
        }

        this.circlePaths = newCirclePaths;
    }

    protected drawChart() {
        let chartCenter:Point = this.canvasRect.getCenterPoint();
        let predictions = this.props.predictions;
        let indexOfMax = predictions.indexOf(Math.max(...predictions));

        this.props.predictions.forEach((value:number, index:number) => {
            let endAngle:number = this.maxAngle * value + this.startAngle;
            let color = index === indexOfMax ? this.bestCircleColor : this.activeCircleColor;
            DrawUtil.drawCircle(this.canvas, chartCenter, this.circlePaths[index], this.startAngle, endAngle, color, this.baseCircleThickness);
        });

        if(predictions.length > 0)
            DrawUtil.drawText(this.canvas, "" + indexOfMax, 120, chartCenter, this.bestCircleColor);
    }

    protected setUpCanvas = () => {
        const chartRect = this.chart.getBoundingClientRect();

        if (chartRect.width >= chartRect.height) {
            this.canvas.width = chartRect.height;
            this.canvas.height = chartRect.height;
        }
        else {
            this.canvas.width = chartRect.width;
            this.canvas.height = chartRect.width;
        }

        this.canvasRect = new Rect(0, 0, this.canvas.width, this.canvas.height);
    }

    public render() {
        return(
            <div className="CircleChart" ref = {ref => this.chart = ref}>
                <canvas className={"ChartCanvas"} ref = {ref => this.canvas = ref}/>
            </div>
        )
    }
}

const mapStateToProps = (state: ApplicationState) => ({
    predictions: state.predictions.predictionValues
});

const mapDispatchToProps = (dispatch: Dispatch<ApplicationState>) => ({
    onNewPrediction: (predictions:number[]) => dispatch(updateModelPredictions(predictions))
});

export const CircleChart = connect(mapStateToProps, mapDispatchToProps)(
    CircleChartComponent
);