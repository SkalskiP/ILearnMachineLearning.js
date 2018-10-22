import * as React from 'react';

interface IProps {
    name:string,
    payload:JSX.Element,
    style?:React.CSSProperties
}

export const RoundedCornersBox = (props:IProps) => {

    return(
        <div className="RoundedCornersBox" style={props.style}>
            <div className="Header">
                {props.name}
            </div>
            <div className="Content">
                {props.payload}
            </div>
        </div>
    );
};