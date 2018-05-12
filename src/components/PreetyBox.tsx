import * as React from 'react';
import './../styles/PreetyBox.css';

interface IProps {
    name:string,
    payload:JSX.Element,
    style:React.CSSProperties
}

export const PreetyBox = (props:IProps) => {
    
    return(
        <div className="PrettyBox" style={props.style}>
            <div className="PrettyBoxHeader">
                {props.name}
            </div>
            <div className="PrettyBoxPayload">
                {props.payload}
            </div>
        </div>
    );
}