import * as React from 'react';
import { Dispatch, connect } from 'react-redux';
import { ApplicationState } from '../../store/index';
import { updateModelPredictions } from '../../store/mnist/actions';
import { Point } from '../../utils/geometry/Point';
import { Rect } from '../../utils/geometry/Rect';
import { DrawUtil } from '../../utils/DrawUtil';
import { AppSettings } from '../../settings/AppSettings';

interface Props {
    predictions:number[];
}

interface State {
    circleScale:number;
}

class CircleChartComponent extends React.Component<Props, State> {
    
    protected chart:HTMLDivElement;
    protected passiveCanvas:HTMLCanvasElement;
    protected activeCanvas:HTMLCanvasElement;
    protected canvasRect:Rect;
    protected circlePaths:number[];

    // Settings
    protected startAngle:number = -90;
    protected maxAngle:number = 360;
    protected numberOfClasses:number = 10;
    protected inactiveCircleColor:string = "rgba(255,255,255,0.05)";
    protected activeCircleColor:string = "#fff";
    protected bestCircleColor:string = "#ef6c00";
    
    constructor(props: any) {
        super(props);
        this.state = { circleScale: 1 };
    }

    public componentDidMount() {
        this.setUpCanvas();
        this.initCirclePaths();
        this.initChart();
        window.addEventListener("resize", this.onResize);
    }

    public componentWillUnmount() {
        window.removeEventListener("resize", this.onResize);
    }

    public componentDidUpdate() {
        this.initChart();
        this.animate(250);
    }

    protected onResize = () => {
        this.setUpCanvas();
        this.initCirclePaths();
        this.initChart();
    };

    protected setUpCanvas = () => {
        const chartRect = this.chart.getBoundingClientRect();

        this.passiveCanvas.width = 0;
        this.passiveCanvas.height = 0;

        this.passiveCanvas.width = chartRect.width;
        this.passiveCanvas.height = chartRect.height;

        this.activeCanvas.width = chartRect.width;
        this.activeCanvas.height = chartRect.height;

        this.canvasRect = new Rect(0, 0, chartRect.width, chartRect.height);
    };

    protected initCirclePaths():void {
        let diameter:number = Math.min(this.canvasRect.height, this.canvasRect.width, AppSettings.CIRCLE_CHART_BASE_DIAMETER)
        this.setState({ circleScale: diameter/AppSettings.CIRCLE_CHART_BASE_DIAMETER });
        
        let maxCircleRadious:number = 0.9 * diameter/2;
        let minCircleRadious:number = 0.3 * diameter/2;
        let newCirclePaths:number[] = [];

        for(let i = 1; i <= this.numberOfClasses; i++) {
            newCirclePaths.push(minCircleRadious + (maxCircleRadious - minCircleRadious) * i/this.numberOfClasses);
        }

        this.circlePaths = newCirclePaths;
    }

    protected initChart() {
        DrawUtil.clearCanvas(this.passiveCanvas);
        let chartCenter:Point = this.canvasRect.getCenterPoint();
        let circleThickness = this.state.circleScale * AppSettings.CIRCLE_CHART_BASE_CIRCLE_THICKNESS;
        this.circlePaths.forEach((radious:number) => {
            DrawUtil.drawCircle(this.passiveCanvas, chartCenter, radious, 0, 360, circleThickness, this.inactiveCircleColor);
        });
    }

    protected animate(duration) {
        let start = new Date().getTime();
        let end = start + duration;

        let chartCenter:Point = this.canvasRect.getCenterPoint();
        let predictions = this.props.predictions;
        let canvas = this.activeCanvas;
        let circlePaths = this.circlePaths;
        let startAngle = this.startAngle;
        let maxAngle = this.maxAngle;
        let bestCircleColor = this.bestCircleColor;
        let activeCircleColor = this.activeCircleColor;
        let baseCircleThickness = this.state.circleScale * AppSettings.CIRCLE_CHART_BASE_CIRCLE_THICKNESS;
        let circleScale = this.state.circleScale;

        let indexOfMax = predictions.indexOf(Math.max(...predictions));

        let step = function() {
            let timestamp = new Date().getTime();
            let progress = Math.min((duration - (end - timestamp)) / duration, 1);
            let predictionTextSize = circleScale * AppSettings.CIRCLE_CHART_BASE_TEXT_SIZE;

            DrawUtil.clearCanvas(canvas);

            if(predictions.length > 0) {    
                DrawUtil.drawText(canvas, "" + indexOfMax, predictionTextSize, chartCenter, bestCircleColor, true);
            }

            predictions.forEach((value:number, index:number) => {
                let endAngle:number = maxAngle * value * progress + startAngle;

                if(index !== indexOfMax)
                    DrawUtil.drawCircle(canvas, chartCenter, circlePaths[index], startAngle, endAngle, baseCircleThickness, activeCircleColor);
                else
                    DrawUtil.drawCircleWithGradient(canvas, chartCenter, circlePaths[index], startAngle, endAngle, baseCircleThickness);
                
            });
            if (progress < 1) requestAnimationFrame(step);
        }
        return step();
    }

    public render() {
        return(
            <div className="CircleChart" ref = {ref => this.chart = ref}>
                <canvas className={"ChartCanvas"} ref = {ref => this.passiveCanvas = ref}/>
                <canvas className={"ChartCanvas"} ref = {ref => this.activeCanvas = ref}/>
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