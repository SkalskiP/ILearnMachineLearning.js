import * as React from 'react';
import './../styles/DemoView.css';
import { BarChart } from './BarChart';
import { DrawingBoard } from './DrawingBoard';



export class DemoView extends React.Component {

    public render() {

        return(
            <div className="DemoView">
                <div className="PrettyContainer">
                    <div className="PrettyContainerHeader">
                        Draw
                    </div>
                    <div className="PrettyFiller">
                        <DrawingBoard/>
                    </div>
                </div>
                <div className="PrettyContainer">
                    <div className="PrettyContainerHeader">
                        Predictions
                    </div>
                    <div className="PrettyFiller">
                        <BarChart/>
                    </div>
                </div>
            </div>
        );
    }
}