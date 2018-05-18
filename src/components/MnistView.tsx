import * as React from 'react';
import { DrawingBoard } from '../containers/DrawingBoard';
import { CircleChart } from '../containers/CircleChart';
import { PreetyBox } from './PreetyBox';

export const MnistView = () => {

    let prettyBoxLeftStyle:React.CSSProperties = {
        width: "40%",
        height: "100%"
    }

    let prettyBoxRightStyle:React.CSSProperties = {
        width: "60%",
        height: "100%"
    }

    return(
        <div className="MnistView">
            <PreetyBox 
                name="Draw" 
                style={prettyBoxLeftStyle} 
                payload={<DrawingBoard/>}
            />
            <PreetyBox 
                name="Predictions" 
                style={prettyBoxRightStyle} 
                payload={<CircleChart/>}
            />
        </div>
    );
}