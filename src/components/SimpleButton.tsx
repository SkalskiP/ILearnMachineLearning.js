import * as React from 'react';
import { ISize } from '../interfaces/ISize';

interface IProps {
    name:string,
    style:React.CSSProperties,
    onClick:() => void
}

export const SimpleButton = (props:IProps) => {

    return(
        <div className="SimpleButton" style={props.style} onClick={props.onClick}>
            {props.name}
        </div>
    );
}