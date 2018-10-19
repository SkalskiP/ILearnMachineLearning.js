import * as React from 'react';

interface IProps {
    key?:string;
    label:string;
    onClick?:() => any;
}

export const TextButton = (props:IProps) => {
    return(
        <div
            className="TextButton"
            onClick={props.onClick}
            key={props.key}
        >
            {props.label}
        </div>
    )
};
