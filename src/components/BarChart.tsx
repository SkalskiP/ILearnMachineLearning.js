import * as React from 'react';
import { Dispatch, connect } from 'react-redux';
import { ApplicationState } from '../store/index';
import './../styles/BarChart.css';
import { updateModelPredictions } from '../store/mnist/actions';

interface Props {
    predictions:number[];
}

class BarChartComponent extends React.Component<Props, {}> {
    constructor(props: any) {
        super(props);
    }

    public componentDidMount() {
        console.log('BAR CHART MOUNTED');
        console.log(this.props.predictions);
    }

    public componentDidUpdate() {
        console.log('BAR CHART UPDATED');
        console.log(this.props.predictions);
    }

    public render() {
        console.log('TEST');
        
        return(
            <div className="BarChart"/>
        )
    }
}

const mapStateToProps = (state: ApplicationState) => ({
    predictions: state.predictions.predictionValues
});

const mapDispatchToProps = (dispatch: Dispatch<ApplicationState>) => ({
    onNewPrediction: (predictions:number[]) => dispatch(updateModelPredictions(predictions))
});

export const BarChart = connect(mapStateToProps, mapDispatchToProps)(
    BarChartComponent
);