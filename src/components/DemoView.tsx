import * as React from 'react';
import './../styles/DemoView.css';
import { DrawingBoard } from '../containers/DrawingBoard';
import { CircleChart } from '../containers/CircleChart';

export const DemoView = () => {

    let prettyContainerLeft:React.CSSProperties = {
        width: "40%",
        height: "100%"
    }

    let prettyContainerRight:React.CSSProperties = {
        width: "60%",
        height: "100%"
    }

    return(
        <div className="DemoView">
            <div className="PrettyContainer" style={prettyContainerLeft}>
                <div className="PrettyContainerHeader">
                    Draw
                </div>
                <div className="PrettyFiller">
                    <DrawingBoard/>
                </div>
            </div>
            <div className="PrettyContainer" style={prettyContainerRight}>
                <div className="PrettyContainerHeader">
                    Predictions
                </div>
                <div className="PrettyFiller">
                    <CircleChart/>
                </div>
            </div>
        </div>
    );
}