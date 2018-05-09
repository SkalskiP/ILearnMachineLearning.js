import * as React from 'react';
import './../styles/SimpleButton.css';
import { ISize } from '../interfaces/ISize';

interface IProps {
    name:string,
    size:ISize
    onClick:() => void
}

export const SimpleButton = (props:IProps) => {

    let simpleButtonStyle:React.CSSProperties = {
        width: props.size.width,
        height: props.size.height
    }

    return(
        <div className="SimpleButton" style={simpleButtonStyle} onClick={props.onClick}>
            {props.name}
        </div>
    );
}