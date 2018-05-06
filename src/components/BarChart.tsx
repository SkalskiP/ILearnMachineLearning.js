import * as React from 'react';
import './../styles/BarChart.css';

export class BarChart extends React.Component {

    public componentDidMount() {
        console.log('BAR CHART MOUNTED');
    }

    public componentDidUpdate() {
        console.log('BAR CHART UPDATED');
    }

    public render() {
        return(
            <div className="BarChart"/>
        )
    }
}