import * as React from 'react';

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