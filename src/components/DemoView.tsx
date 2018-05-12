import * as React from 'react';
import { DrawingBoard } from '../containers/DrawingBoard';
import { CircleChart } from '../containers/CircleChart';
import { PreetyBox } from './PreetyBox';

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
            <PreetyBox 
                name="Draw" 
                style={prettyContainerLeft} 
                payload={<DrawingBoard/>}
            />
            <PreetyBox 
                name="Predictions" 
                style={prettyContainerRight} 
                payload={<CircleChart/>}
            />
        </div>
    );
}