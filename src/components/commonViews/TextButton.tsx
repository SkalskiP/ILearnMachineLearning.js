import * as React from 'react';
import { Link } from 'react-router-dom';


interface IProps {
    key?:string;
    label:string;
    onClick?:() => any;
    rout?:string,
    style?:React.CSSProperties;
}

export const TextButton = (props:IProps) => {
    return(
        <div
            className="TextButton"
            onClick={props.onClick}
            key={props.key}
            style={props.style}
        >
            {!props.rout && props.label}
            {!!props.rout && <Link to={props.rout}>
                {props.label}
            </Link>}
        </div>
    )
};
