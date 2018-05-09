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
    
    constructor(props: any) {
        super(props);
    }

    public componentDidMount() {
        this.setUpCanvas();
    }

    public componentDidUpdate() {
        console.log(this.props.predictions);
        this.drawChart();
    }

    protected drawChart() {
        let chartCenter:Point = this.canvasRect.getCenterPoint();
        let maxCircleRadious:number = 0.9 * this.canvas.height/2;
        // let
        let startAngle:number = - 90;

        DrawUtil.clearCanvas(this.canvas);

        this.props.predictions.forEach((value:number, index:number) => {

            let currentCircleRadious:number = maxCircleRadious * (index + 1)/this.props.predictions.length;
            let currentCircleAngle:number = 320 * value;
            DrawUtil.drawCircle(this.canvas, chartCenter, currentCircleRadious, 0, 360, "rgba(255,255,255,0.05)", 15);
        });
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