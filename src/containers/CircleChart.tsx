import * as React from 'react';
import { Dispatch, connect } from 'react-redux';
import { ApplicationState } from '../store/index';
import './../styles/CircleChart.css';
import { updateModelPredictions } from '../store/mnist/actions';

interface Props {
    predictions:number[];
}

class CircleChartComponent extends React.Component<Props, {}> {
    
    protected chart:HTMLDivElement;
    protected canvas:HTMLCanvasElement;
    
    constructor(props: any) {
        super(props);
    }

    public componentDidMount() {
        this.setUpCanvas();
        console.log('BAR CHART MOUNTED');
        console.log(this.props.predictions);
    }

    public componentDidUpdate() {
        console.log('BAR CHART UPDATED');
        console.log(this.props.predictions);
    }

    protected setUpCanvas = () => {
        const chartRect = this.chart.getBoundingClientRect();

        console.log(chartRect);
        

        if (chartRect.width >= chartRect.height) {
            this.canvas.width = chartRect.height;
            this.canvas.height = chartRect.height;
        }
        else {
            this.canvas.width = chartRect.width;
            this.canvas.height = chartRect.width;
        }
        
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