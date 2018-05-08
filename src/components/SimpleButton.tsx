import * as React from 'react';
import './../styles/SimpleButton.css';

interface IProps {
    name:string,
    width:number,
    height:number,
    onClick:() => void
}

export const SimpleButton = (props:IProps) => {

    let simpleButtonStyle:React.CSSProperties = {
        width: props.width,
        height: props.height
    }

    return(
        <div className="SimpleButton" style={simpleButtonStyle} onClick={props.onClick}>
            {props.name}
        </div>
    );
}